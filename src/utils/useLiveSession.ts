"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { apiBase } from "@/lib/api/api";
import { liveSessionApi } from "@/lib/api/liveSessionService";
import {
  ChatMessage,
  ChatMode,
  ChatRestriction,
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
  const [chatMode, setChatMode] = useState<ChatMode>("open");
  const [restriction, setRestriction] = useState<ChatRestriction | null>(null);
  const [activeRestrictions, setActiveRestrictions] = useState<ChatRestriction[]>([]);

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMoreMessages, setHasMoreMessages] = useState(false);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);

  const [activePoll, setActivePoll] = useState<Poll | null>(null);
  const [typingUsers, setTypingUsers] = useState<
    Record<string, { name: string; timeout: ReturnType<typeof setTimeout> }>
  >({});

  const wsRef = useRef<WebSocket | null>(null);
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectAttemptRef = useRef(0);
  const shouldReconnectRef = useRef(false);
  const lastMessageIdRef = useRef<string | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingSentRef = useRef(false);

  useEffect(() => {
    if (messages.length > 0) {
      lastMessageIdRef.current = messages[messages.length - 1].id;
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
    if (heartbeatRef.current) clearInterval(heartbeatRef.current);
    if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  const connectWebSocket = useCallback(
    (sessionId: string, wsUrl: string, heartbeatMs = 20000) => {
      cleanupSocket();
      shouldReconnectRef.current = true;
      setConnectionState((prev) =>
        prev === "reconnecting" ? "reconnecting" : "connecting"
      );

      const ws = new WebSocket(resolveWebSocketUrl(wsUrl));
      wsRef.current = ws;

      ws.onopen = async () => {
        const wasReconnecting = reconnectAttemptRef.current > 0;
        reconnectAttemptRef.current = 0;
        setConnectionState("connected");
        setError(null);

        heartbeatRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: "ping" }));
          }
        }, heartbeatMs);

        if (wasReconnecting && lastMessageIdRef.current) {
          try {
            const [missed, latestPoll, reloadedSession] = await Promise.all([
              liveSessionApi.getMessages(sessionId, {
                after: lastMessageIdRef.current,
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
        try {
          const parsed: WsInboundEvent = JSON.parse(event.data);

          switch (parsed.type) {
            case "presence.snapshot":
            case "presence.updated":
              setParticipants(parsed.payload.participants);
              break;

            case "chat.message":
              setMessages((prev) => {
                if (prev.some((m) => m.id === parsed.payload.id)) return prev;
                return [...prev, parsed.payload];
              });
              break;

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
                setRestriction(parsed.payload.restriction);
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
        if (heartbeatRef.current) clearInterval(heartbeatRef.current);
        if (!shouldReconnectRef.current) return;

        setConnectionState("reconnecting");
        const delay = Math.min(1000 * 2 ** reconnectAttemptRef.current, 15000);
        reconnectAttemptRef.current += 1;
        reconnectTimerRef.current = setTimeout(() => {
          connectWebSocket(sessionId, wsUrl, heartbeatMs);
        }, delay);
      };
    },
    [cleanupSocket, currentUserId, onReaction]
  );

  const joinSession = useCallback(
    async (sessionId: string) => {
      setIsJoining(true);
      setError(null);
      try {
        const joinData = await liveSessionApi.joinSession(sessionId);
        setConfig(joinData);
        setCurrentSession(joinData.session);
        setChatMode(joinData.session.chatMode);
        setRestriction(joinData.restriction || null);
        setActivePoll(joinData.activePoll);

        const [historyPage, participantSnapshot] = await Promise.all([
          liveSessionApi.getMessages(sessionId, { limit: 50 }),
          liveSessionApi.getParticipants(sessionId),
        ]);

        setMessages(historyPage.items);
        setNextCursor(historyPage.nextCursor);
        setHasMoreMessages(historyPage.hasMore);
        setParticipants(participantSnapshot.participants);

        if (joinData.permissions.isHost) {
          const restrictions = await liveSessionApi.getRestrictions(sessionId);
          setActiveRestrictions(restrictions);
        }

        setIsJoined(true);
        connectWebSocket(
          sessionId,
          joinData.wsUrl,
          joinData.limits?.heartbeatIntervalMs || 20000
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to join session");
      } finally {
        setIsJoining(false);
      }
    },
    [connectWebSocket]
  );

  const leaveSession = useCallback(() => {
    cleanupSocket();
    setIsJoined(false);
    setConnectionState("disconnected");
    setMessages([]);
    setParticipants([]);
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
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN)
        return;

      const maxLen = config?.limits?.maxMessageLength || 200;
      const safeText = [...trimmed].slice(0, maxLen).join("");

      wsRef.current.send(
        JSON.stringify({
          type: "chat.send",
          payload: { text: safeText },
        })
      );

      if (isTypingSentRef.current) {
        isTypingSentRef.current = false;
        wsRef.current.send(JSON.stringify({ type: "typing.stop" }));
      }
    },
    [config]
  );

  const notifyTyping = useCallback(() => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

    if (!isTypingSentRef.current) {
      isTypingSentRef.current = true;
      wsRef.current.send(JSON.stringify({ type: "typing.start" }));
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN && isTypingSentRef.current) {
        isTypingSentRef.current = false;
        wsRef.current.send(JSON.stringify({ type: "typing.stop" }));
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
    messages,
    hasMoreMessages,
    isLoadingOlder,
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