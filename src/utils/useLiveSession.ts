"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { apiBase } from "@/lib/api/api";
import {
  liveSessionApi,
  normalizeParticipant,
} from "@/lib/api/liveSessionService";
import {
  ChatMessage,
  ChatMode,
  ChatRestriction,
  CurrentUserRestriction,
  LiveSession,
  Participant,
  Poll,
  SessionJoinConfig,
  WsInboundEvent,
} from "@/interfaces/liveSessionInterface";

interface UseLiveSessionOptions {
  currentUserId: string;
  onReaction: (emoji: string) => void;
}

interface PendingChatRequest {
  clientMessageId: string;
  text: string;
  resolve: (accepted: boolean) => void;
  timeout: ReturnType<typeof setTimeout>;
}

type PresenceStatus = "idle" | "loading" | "live" | "reconnecting" | "error";

function resolveWebSocketUrl(wsPath: string): string {
  if (wsPath.startsWith("ws://") || wsPath.startsWith("wss://")) return wsPath;

  if (apiBase.startsWith("http://") || apiBase.startsWith("https://")) {
    const backendOrigin = new URL(apiBase).origin.replace(/^http/, "ws");
    return `${backendOrigin}${wsPath}`;
  }

  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${protocol}//${window.location.host}${wsPath}`;
}

export function useLiveSession({ currentUserId, onReaction }: UseLiveSessionOptions) {
  const [currentSession, setCurrentSession] = useState<LiveSession | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  const [isJoined, setIsJoined] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [connectionState, setConnectionState] = useState<
    "disconnected" | "connecting" | "connected" | "reconnecting" | "ended"
  >("disconnected");
  const [error, setError] = useState<string | null>(null);

  const [config, setConfig] = useState<SessionJoinConfig | null>(null);
  const [chatMode, setChatMode] = useState<ChatMode>("enabled");
  const [restriction, setRestriction] = useState<CurrentUserRestriction | null>(null);
  const [activeRestrictions, setActiveRestrictions] = useState<ChatRestriction[]>([]);

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [activeParticipantCount, setActiveParticipantCount] = useState(0);
  const [presenceStatus, setPresenceStatus] = useState<PresenceStatus>("idle");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMoreMessages, setHasMoreMessages] = useState(false);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  const [activePoll, setActivePoll] = useState<Poll | null>(null);
  const [typingUsers, setTypingUsers] = useState<
    Record<string, { name: string; timeout: ReturnType<typeof setTimeout> }>
  >({});

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectAttemptRef = useRef(0);
  const shouldReconnectRef = useRef(false);
  const hasLivePresenceRef = useRef(false);
  const lastMessageCursorRef = useRef<string | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingSentRef = useRef(false);
  const pendingChatRequestsRef = useRef<Map<string, PendingChatRequest>>(new Map());
  const failedChatMessageRef = useRef<{
    text: string;
    clientMessageId: string;
  } | null>(null);

  useEffect(() => {
    if (messages.length > 0) {
      lastMessageCursorRef.current = messages[messages.length - 1].cursor ?? null;
    }
  }, [messages]);

  const refreshCurrentSession = useCallback(async () => {
    setIsLoadingSession(true);
    try {
      const session = await liveSessionApi.getCurrentSession();
      setCurrentSession(session);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load session");
    } finally {
      setIsLoadingSession(false);
    }
  }, []);

  useEffect(() => {
    refreshCurrentSession();
  }, [refreshCurrentSession]);

  const cleanupSocket = useCallback(() => {
    shouldReconnectRef.current = false;
    if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
    for (const pending of pendingChatRequestsRef.current.values()) {
      clearTimeout(pending.timeout);
      failedChatMessageRef.current = {
        text: pending.text,
        clientMessageId: pending.clientMessageId,
      };
      pending.resolve(false);
    }
    pendingChatRequestsRef.current.clear();
    setIsSendingMessage(false);
    const socket = wsRef.current;
    wsRef.current = null;
    socket?.close();
  }, []);

  const connectWebSocket = useCallback(
    (sessionId: string, wsUrl: string) => {
      cleanupSocket();
      shouldReconnectRef.current = true;
      setConnectionState((prev) =>
        prev === "reconnecting" ? "reconnecting" : "connecting"
      );

      const ws = new WebSocket(resolveWebSocketUrl(wsUrl));
      wsRef.current = ws;

      ws.onopen = async () => {
        if (wsRef.current !== ws) return;

        const wasReconnecting = reconnectAttemptRef.current > 0;
        reconnectAttemptRef.current = 0;
        setConnectionState("connected");
        setError(null);

        if (wasReconnecting && lastMessageCursorRef.current) {
          try {
            const [missed, latestPoll, reloadedSession] = await Promise.all([
              liveSessionApi.getMessages(sessionId, {
                after: lastMessageCursorRef.current,
              }),
              liveSessionApi.getCurrentPoll(sessionId),
              liveSessionApi.getSession(sessionId),
            ]);
            if (missed.items.length > 0) {
              setMessages((prev) => {
                const existingIds = new Set(prev.map((m) => m.id));
                const fresh = missed.items.filter((m) => !existingIds.has(m.id));
                return [...prev, ...fresh];
              });
            }
            setActivePoll(latestPoll);
            setChatMode(reloadedSession.chatMode);
            setCurrentSession(reloadedSession);
          } catch {
            // Silent recovery fallback
          }
        }
      };

      ws.onmessage = (event) => {
        if (wsRef.current !== ws) return;

        try {
          const parsed: WsInboundEvent = JSON.parse(event.data);

          switch (parsed.type) {
            case "session.ready":
              setChatMode(parsed.chatMode);
              setRestriction(parsed.restriction.restricted ? parsed.restriction : null);
              setConfig((previous) =>
                previous
                  ? {
                      ...previous,
                      permissions: {
                        ...previous.permissions,
                        isHost: parsed.role === "host",
                        canChat: parsed.canSend,
                      },
                    }
                  : previous
              );
              break;

            case "presence.snapshot":
              hasLivePresenceRef.current = true;
              setParticipants(parsed.participants.map(normalizeParticipant));
              setActiveParticipantCount(parsed.activeCount);
              setPresenceStatus("live");
              break;

            case "presence.joined": {
              hasLivePresenceRef.current = true;
              const participant = normalizeParticipant(parsed.participant);
              setParticipants((current) => {
                const existingIndex = current.findIndex(
                  (item) => item.id === participant.id
                );
                if (existingIndex === -1) return [...current, participant];

                const next = [...current];
                next[existingIndex] = participant;
                return next;
              });
              setActiveParticipantCount(parsed.activeCount);
              setPresenceStatus("live");
              break;
            }

            case "presence.left":
              hasLivePresenceRef.current = true;
              setParticipants((current) =>
                current.filter((participant) => participant.id !== parsed.userId)
              );
              setActiveParticipantCount(parsed.activeCount);
              setPresenceStatus("live");
              break;

            case "chat.ack": {
              const pending = pendingChatRequestsRef.current.get(parsed.requestId);
              if (!pending) break;

              clearTimeout(pending.timeout);
              pendingChatRequestsRef.current.delete(parsed.requestId);
              if (
                failedChatMessageRef.current?.clientMessageId ===
                pending.clientMessageId
              ) {
                failedChatMessageRef.current = null;
              }
              setIsSendingMessage(false);
              setError(null);
              pending.resolve(true);
              break;
            }

            case "chat.message": {
              const serverMessage = parsed.message;
              const normalizedMessage: ChatMessage = {
                id: serverMessage.id,
                userId: serverMessage.sender.id,
                name: serverMessage.sender.displayName,
                avatarUrl: serverMessage.sender.picture ?? undefined,
                pronouns: serverMessage.sender.pronouns ?? undefined,
                text: serverMessage.text,
                createdAt: serverMessage.createdAt,
                cursor: serverMessage.cursor,
              };

              setMessages((prev) => {
                if (prev.some((message) => message.id === normalizedMessage.id)) {
                  return prev;
                }
                return [...prev, normalizedMessage];
              });
              break;
            }

            case "error": {
              setError(parsed.message);
              if (!parsed.requestId) break;

              const pending = pendingChatRequestsRef.current.get(parsed.requestId);
              if (!pending) break;

              clearTimeout(pending.timeout);
              pendingChatRequestsRef.current.delete(parsed.requestId);
              failedChatMessageRef.current = {
                text: pending.text,
                clientMessageId: pending.clientMessageId,
              };
              setIsSendingMessage(false);
              pending.resolve(false);
              break;
            }

            case "chat.message_deleted":
              setMessages((prev) =>
                prev.filter((m) => m.id !== parsed.payload.messageId)
              );
              break;

            case "chat.mode_changed":
              setChatMode(parsed.payload.chatMode);
              break;

            case "typing.updated": {
              const { userId, name, isTyping } = parsed.payload;
              if (userId === currentUserId) break;

              setTypingUsers((prev) => {
                const copy = { ...prev };
                if (copy[userId]?.timeout) clearTimeout(copy[userId].timeout);

                if (!isTyping) {
                  delete copy[userId];
                } else {
                  const timeout = setTimeout(() => {
                    setTypingUsers((curr) => {
                      const next = { ...curr };
                      delete next[userId];
                      return next;
                    });
                  }, 5000);
                  copy[userId] = { name, timeout };
                }
                return copy;
              });
              break;
            }

            case "reaction.created":
              onReaction(parsed.payload.emoji);
              break;

            case "poll.created":
            case "poll.updated":
            case "poll.closed":
              setActivePoll(parsed.payload);
              break;

            case "user.restricted":
              if (parsed.payload.userId === currentUserId) {
                setRestriction({
                  restricted: true,
                  expiresAt: parsed.payload.restriction.expiresAt ?? null,
                });
              }
              setActiveRestrictions((prev) => [
                ...prev.filter((r) => r.userId !== parsed.payload.userId),
                parsed.payload.restriction,
              ]);
              break;

            case "user.unrestricted":
              if (parsed.payload.userId === currentUserId) {
                setRestriction(null);
              }
              setActiveRestrictions((prev) =>
                prev.filter((r) => r.userId !== parsed.payload.userId)
              );
              break;

            case "session.ended":
              shouldReconnectRef.current = false;
              setConnectionState("ended");
              setParticipants([]);
              setActiveParticipantCount(0);
              setPresenceStatus("idle");
              setActivePoll((prev) => (prev ? { ...prev, isClosed: true } : null));
              setCurrentSession((prev) =>
                prev ? { ...prev, status: "ended" } : null
              );
              ws.close();
              break;
          }
        } catch {
          // Ignore malformed frame
        }
      };

      ws.onclose = () => {
        if (wsRef.current !== ws) return;
        wsRef.current = null;
        if (!shouldReconnectRef.current) return;

        setConnectionState("reconnecting");
        setPresenceStatus("reconnecting");
        const delay = Math.min(1000 * 2 ** reconnectAttemptRef.current, 15000);
        reconnectAttemptRef.current += 1;
        reconnectTimerRef.current = setTimeout(() => {
          connectWebSocket(sessionId, wsUrl);
        }, delay);
      };

      ws.onerror = () => {
        if (wsRef.current !== ws) return;
        setPresenceStatus((current) =>
          current === "live" ? "reconnecting" : current
        );
      };
    },
    [cleanupSocket, currentUserId, onReaction]
  );

  const joinSession = useCallback(
    async (sessionId: string) => {
      setIsJoining(true);
      setError(null);
      setParticipants([]);
      setActiveParticipantCount(0);
      setPresenceStatus("loading");
      hasLivePresenceRef.current = false;
      try {
        const joinData = await liveSessionApi.joinSession(sessionId);
        setConfig(joinData);
        setCurrentSession(joinData.session);
        setChatMode(joinData.session.chatMode);
        setRestriction(joinData.restriction || null);
        setActivePoll(joinData.activePoll);
        setIsJoined(true);
        connectWebSocket(sessionId, joinData.wsUrl);

        const [historyResult, participantResult] = await Promise.allSettled([
          liveSessionApi.getMessages(sessionId, { limit: 50 }),
          liveSessionApi.getParticipants(sessionId),
        ]);

        if (historyResult.status === "fulfilled") {
          setMessages(historyResult.value.items);
          setNextCursor(historyResult.value.nextCursor);
          setHasMoreMessages(historyResult.value.hasMore);
        } else {
          setError(
            historyResult.reason instanceof Error
              ? historyResult.reason.message
              : "Unable to load chat history"
          );
        }

        if (participantResult.status === "fulfilled") {
          if (!hasLivePresenceRef.current) {
            setParticipants(participantResult.value.participants);
            setActiveParticipantCount(participantResult.value.count);
          }
        } else if (!hasLivePresenceRef.current) {
          setPresenceStatus("error");
        }

        if (joinData.permissions.isHost) {
          const restrictions = await liveSessionApi.getRestrictions(sessionId);
          setActiveRestrictions(restrictions);
        }

      } catch (err) {
        cleanupSocket();
        setIsJoined(false);
        setPresenceStatus("error");
        setError(err instanceof Error ? err.message : "Unable to join session");
      } finally {
        setIsJoining(false);
      }
    },
    [cleanupSocket, connectWebSocket]
  );

  const leaveSession = useCallback(() => {
    cleanupSocket();
    setIsJoined(false);
    setConnectionState("disconnected");
    setMessages([]);
    setParticipants([]);
    setActiveParticipantCount(0);
    setPresenceStatus("idle");
    hasLivePresenceRef.current = false;
    setActivePoll(null);
    setConfig(null);
  }, [cleanupSocket]);

  useEffect(() => {
    return () => cleanupSocket();
  }, [cleanupSocket]);

  const loadOlderMessages = useCallback(async () => {
    if (!currentSession || !nextCursor || isLoadingOlder || !hasMoreMessages) return;
    setIsLoadingOlder(true);
    try {
      const page = await liveSessionApi.getMessages(currentSession.id, {
        before: nextCursor,
        limit: 50,
      });
      setMessages((prev) => {
        const existingIds = new Set(prev.map((m) => m.id));
        const older = page.items.filter((m) => !existingIds.has(m.id));
        return [...older, ...prev];
      });
      setNextCursor(page.nextCursor);
      setHasMoreMessages(page.hasMore);
    } finally {
      setIsLoadingOlder(false);
    }
  }, [currentSession, nextCursor, isLoadingOlder, hasMoreMessages]);

  const sendMessage = useCallback(
    (text: string): Promise<boolean> => {
      const trimmed = text.trim();
      if (!trimmed) return Promise.resolve(false);

      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
        setError("Chat is reconnecting. Please try again in a moment.");
        return Promise.resolve(false);
      }

      if (chatMode !== "enabled" || restriction || !config?.permissions.canChat) {
        setError("You cannot send messages in the current chat state.");
        return Promise.resolve(false);
      }

      const maxLen = config?.limits?.maxMessageLength || 200;
      if ([...trimmed].length > maxLen) {
        setError(`Messages must be ${maxLen} characters or fewer.`);
        return Promise.resolve(false);
      }

      const requestId = crypto.randomUUID();
      const clientMessageId =
        failedChatMessageRef.current?.text === trimmed
          ? failedChatMessageRef.current.clientMessageId
          : crypto.randomUUID();

      setError(null);
      setIsSendingMessage(true);

      const result = new Promise<boolean>((resolve) => {
        const timeout = setTimeout(() => {
          const pending = pendingChatRequestsRef.current.get(requestId);
          if (!pending) return;

          pendingChatRequestsRef.current.delete(requestId);
          failedChatMessageRef.current = {
            text: pending.text,
            clientMessageId: pending.clientMessageId,
          };
          setIsSendingMessage(false);
          setError("The message was not confirmed. Please try again.");
          pending.resolve(false);
        }, 10000);

        pendingChatRequestsRef.current.set(requestId, {
          clientMessageId,
          text: trimmed,
          resolve,
          timeout,
        });

        try {
          wsRef.current?.send(
            JSON.stringify({
              version: 1,
              type: "chat.send",
              requestId,
              clientMessageId,
              text: trimmed,
            })
          );
        } catch {
          clearTimeout(timeout);
          pendingChatRequestsRef.current.delete(requestId);
          failedChatMessageRef.current = { text: trimmed, clientMessageId };
          setIsSendingMessage(false);
          setError("The message could not be sent. Please try again.");
          resolve(false);
        }
      });

      if (isTypingSentRef.current) {
        isTypingSentRef.current = false;
        wsRef.current.send(
          JSON.stringify({
            version: 1,
            type: "typing.stop",
            requestId: crypto.randomUUID(),
          })
        );
      }

      return result;
    },
    [chatMode, config, restriction]
  );

  const notifyTyping = useCallback(() => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

    if (!isTypingSentRef.current) {
      isTypingSentRef.current = true;
      wsRef.current.send(
        JSON.stringify({
          version: 1,
          type: "typing.start",
          requestId: crypto.randomUUID(),
        })
      );
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN && isTypingSentRef.current) {
        isTypingSentRef.current = false;
        wsRef.current.send(
          JSON.stringify({
            version: 1,
            type: "typing.stop",
            requestId: crypto.randomUUID(),
          })
        );
      }
    }, 3000);
  }, []);

  const sendReaction = useCallback((emoji: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: "reaction.send",
          payload: { emoji },
        })
      );
    }
  }, []);

  const createPoll = async (question: string, options: string[]) => {
    if (!currentSession) return;
    const poll = await liveSessionApi.createPoll(currentSession.id, {
      question,
      options,
    });
    setActivePoll(poll);
  };

  const votePoll = async (optionId: string) => {
    if (!currentSession || !activePoll) return;
    const updated = await liveSessionApi.votePoll(
      currentSession.id,
      activePoll.id,
      optionId
    );
    setActivePoll(updated);
  };

  const closePoll = async () => {
    if (!currentSession || !activePoll) return;
    const closed = await liveSessionApi.closePoll(
      currentSession.id,
      activePoll.id
    );
    setActivePoll(closed);
  };

  const changeChatMode = async (mode: ChatMode) => {
    if (!currentSession) return;
    const res = await liveSessionApi.updateChatMode(currentSession.id, mode);
    setChatMode(res.chatMode);
  };

  const deleteMessage = async (messageId: string) => {
    if (!currentSession) return;
    await liveSessionApi.deleteMessage(currentSession.id, messageId);
    setMessages((prev) => prev.filter((m) => m.id !== messageId));
  };

  const restrictUser = async (userId: string) => {
    if (!currentSession) return;
    const res = await liveSessionApi.restrictUser(currentSession.id, userId);
    setActiveRestrictions((prev) => [
      ...prev.filter((r) => r.userId !== userId),
      res,
    ]);
  };

  const unrestrictUser = async (userId: string) => {
    if (!currentSession) return;
    await liveSessionApi.unrestrictUser(currentSession.id, userId);
    setActiveRestrictions((prev) => prev.filter((r) => r.userId !== userId));
  };

  const registerHostSession = async (youtubeVideoId: string, title?: string) => {
    const created = await liveSessionApi.createSession({
      youtubeVideoId,
      title,
    });
    setCurrentSession(created);
    return created;
  };

  const syncYouTube = async () => {
    if (!currentSession) return;
    const synced = await liveSessionApi.syncSession(currentSession.id);
    setCurrentSession(synced);
  };

  return {
    currentSession,
    isLoadingSession,
    refreshCurrentSession,
    isJoined,
    isJoining,
    connectionState,
    error,
    isHost: Boolean(config?.permissions?.isHost),
    chatMode,
    restriction,
    activeRestrictions,
    participants,
    activeParticipantCount,
    presenceStatus,
    messages,
    hasMoreMessages,
    isLoadingOlder,
    isSendingMessage,
    loadOlderMessages,
    activePoll,
    typingNames: Object.values(typingUsers).map((u) => u.name),
    joinSession,
    leaveSession,
    sendMessage,
    notifyTyping,
    sendReaction,
    createPoll,
    votePoll,
    closePoll,
    changeChatMode,
    deleteMessage,
    restrictUser,
    unrestrictUser,
    registerHostSession,
    syncYouTube,
  };
}
