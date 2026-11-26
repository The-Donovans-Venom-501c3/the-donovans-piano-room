"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ApiError } from "@/lib/api/api";
import {
  liveSessionApi,
  normalizeParticipant,
  normalizePoll,
} from "@/lib/api/liveSessionService";
import {
  ChatMessage,
  ChatMode,
  ChatRestriction,
  CurrentUserRestriction,
  LiveSession,
  LiveSessionSocketTicket,
  Participant,
  Poll,
  ReactionSendEvent,
  ServerReaction,
  SessionJoinConfig,
  WsInboundEvent,
} from "@/interfaces/liveSessionInterface";

interface UseLiveSessionOptions {
  currentUserId: string;
  onReaction: (reaction: ServerReaction) => void;
}

interface PendingChatRequest {
  clientMessageId: string;
  text: string;
  resolve: (accepted: boolean) => void;
  timeout: ReturnType<typeof setTimeout>;
}

interface PendingReactionRequest {
  emoji: string;
  timeout: ReturnType<typeof setTimeout>;
}

type PresenceStatus = "idle" | "loading" | "live" | "reconnecting" | "error";
type PollOperation = "idle" | "creating" | "voting" | "closing";

const DEFAULT_POLL_LIMITS = {
  questionMaxCodePoints: 300,
  optionMinCount: 2,
  optionMaxCount: 10,
  optionMaxCodePoints: 150,
};

function getCreateSessionErrorMessage(error: unknown): string {
  if (!(error instanceof ApiError)) {
    return "Unable to create the live session. Please try again.";
  }

  switch (error.code) {
    case "YOUTUBE_BROADCAST_NOT_FOUND":
      return "No public live or upcoming YouTube stream was found. Create or start the stream in YouTube Studio and try again.";
    case "MULTIPLE_YOUTUBE_BROADCASTS":
      return "Multiple YouTube streams were found. Ensure only one applicable stream is live or scheduled, then try again.";
    case "YOUTUBE_VIDEO_ALREADY_REGISTERED":
      return "This YouTube stream is already registered, but the existing session could not be loaded. Please refresh and try again.";
    case "YOUTUBE_UNAVAILABLE":
      return "YouTube could not be reached. Please try again shortly.";
    case "LIVE_SESSION_HOST_NOT_FOUND":
      return "The configured live-session host could not be found. Please contact an administrator.";
    default:
      if (error.status === 400) return error.message;
      if (error.status === 401) return "Your login has expired. Please sign in again.";
      if (error.status === 403) return "Only the configured host can create a live session.";
      return error.message || "Unable to create the live session. Please try again.";
  }
}

function buildTicketedWebSocketUrl(socket: LiveSessionSocketTicket): string {
  if (!socket.ticket || socket.protocolVersion !== 1) {
    throw new Error("The backend returned an invalid WebSocket ticket.");
  }

  const url = new URL(socket.url);
  if (url.protocol !== "ws:" && url.protocol !== "wss:") {
    throw new Error("The backend returned an invalid WebSocket URL.");
  }

  url.searchParams.set("ticket", socket.ticket);
  return url.toString();
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
  const [pollOperation, setPollOperation] = useState<PollOperation>("idle");
  const [pollError, setPollError] = useState<string | null>(null);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [createSessionError, setCreateSessionError] = useState<string | null>(null);
  const [isSendingReaction, setIsSendingReaction] = useState(false);
  const [isReactionRateLimited, setIsReactionRateLimited] = useState(false);
  const [reactionError, setReactionError] = useState<string | null>(null);
  const [typingUsers, setTypingUsers] = useState<
    Record<string, { name: string; timeout: ReturnType<typeof setTimeout> }>
  >({});

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectAttemptRef = useRef(0);
  const socketAttemptGenerationRef = useRef(0);
  const shouldReconnectRef = useRef(false);
  const hasLivePresenceRef = useRef(false);
  const socketRoleRef = useRef<"host" | "participant">("participant");
  const isCreatingSessionRef = useRef(false);
  const pollOperationRef = useRef<PollOperation>("idle");
  const lastMessageCursorRef = useRef<string | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingSentRef = useRef(false);
  const pendingChatRequestsRef = useRef<Map<string, PendingChatRequest>>(new Map());
  const pendingReactionRequestsRef = useRef<
    Map<string, PendingReactionRequest>
  >(new Map());
  const reactionCooldownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const reactionCooldownUntilRef = useRef(0);
  const failedChatMessageRef = useRef<{
    text: string;
    clientMessageId: string;
  } | null>(null);

  useEffect(() => {
    if (messages.length > 0) {
      lastMessageCursorRef.current = messages[messages.length - 1].cursor ?? null;
    }
  }, [messages]);

  const applyPollSnapshot = useCallback((incoming: Poll) => {
    setActivePoll((current) => {
      if (
        current?.id === incoming.id &&
        incoming.revision < current.revision
      ) {
        return current;
      }

      return {
        ...incoming,
        userVotedOptionId:
          incoming.userVotedOptionId === undefined && current?.id === incoming.id
            ? current.userVotedOptionId
            : incoming.userVotedOptionId ?? null,
      };
    });
  }, []);

  const markMessageDeleted = useCallback(
    (messageId: string, deletedAt: string | null) => {
      setMessages((current) =>
        current.map((message) =>
          message.id === messageId
            ? {
                ...message,
                text: null,
                isDeleted: true,
                deletedAt: deletedAt ?? message.deletedAt,
              }
            : message
        )
      );
    },
    []
  );

  const refreshCurrentSession = useCallback(async () => {
    setIsLoadingSession(true);
    try {
      const session = await liveSessionApi.getCurrentSession();
      setCurrentSession(session);
      setError(null);
      return session;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load session");
      return null;
    } finally {
      setIsLoadingSession(false);
    }
  }, []);

  useEffect(() => {
    refreshCurrentSession();
  }, [refreshCurrentSession]);

  useEffect(() => {
    if (currentSession?.status !== "scheduled" || isJoined) return;

    let disposed = false;
    const refreshScheduledSession = async () => {
      if (document.visibilityState !== "visible") return;
      try {
        const session = await liveSessionApi.getCurrentSession();
        if (!disposed) setCurrentSession(session);
      } catch {
        // Preserve the scheduled session during a transient background refresh failure.
      }
    };
    const interval = window.setInterval(refreshScheduledSession, 30_000);
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") void refreshScheduledSession();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      disposed = true;
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [currentSession?.status, isJoined]);

  const cleanupSocket = useCallback(() => {
    shouldReconnectRef.current = false;
    socketAttemptGenerationRef.current += 1;
    socketRoleRef.current = "participant";
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
    for (const pending of pendingReactionRequestsRef.current.values()) {
      clearTimeout(pending.timeout);
    }
    pendingReactionRequestsRef.current.clear();
    setIsSendingReaction(false);
    if (reactionCooldownTimerRef.current) {
      clearTimeout(reactionCooldownTimerRef.current);
      reactionCooldownTimerRef.current = null;
    }
    reactionCooldownUntilRef.current = 0;
    setIsReactionRateLimited(false);
    const socket = wsRef.current;
    wsRef.current = null;
    socket?.close();
  }, []);

  const connectWebSocket = useCallback(
    async (
      sessionId: string,
      initialSocket?: LiveSessionSocketTicket,
    ) => {
      cleanupSocket();
      shouldReconnectRef.current = true;
      const attemptGeneration = socketAttemptGenerationRef.current;
      setConnectionState((prev) =>
        prev === "reconnecting" ? "reconnecting" : "connecting"
      );

      let socket = initialSocket;
      if (!socket) {
        try {
          const refreshedJoin = await liveSessionApi.joinSession(sessionId);
          if (
            !shouldReconnectRef.current ||
            socketAttemptGenerationRef.current !== attemptGeneration
          ) {
            return;
          }

          socket = refreshedJoin.socket;
          setConfig(refreshedJoin);
          setCurrentSession(refreshedJoin.session);
          setChatMode(refreshedJoin.session.chatMode);
          setRestriction(refreshedJoin.restriction || null);
          setActivePoll(refreshedJoin.activePoll);
        } catch (err) {
          if (
            !shouldReconnectRef.current ||
            socketAttemptGenerationRef.current !== attemptGeneration
          ) {
            return;
          }

          const terminalFailure =
            err instanceof ApiError &&
            err.status >= 400 &&
            err.status < 500 &&
            err.status !== 429;

          if (terminalFailure) {
            shouldReconnectRef.current = false;
            setConnectionState(err.status === 409 ? "ended" : "disconnected");
            setPresenceStatus("error");
            setError(err.message);
            return;
          }

          setConnectionState("reconnecting");
          setPresenceStatus("reconnecting");
          setError(
            err instanceof Error
              ? err.message
              : "Unable to refresh the live-session connection",
          );
          const delay = Math.min(
            1000 * 2 ** reconnectAttemptRef.current,
            15000,
          );
          reconnectAttemptRef.current += 1;
          reconnectTimerRef.current = setTimeout(() => {
            void connectWebSocket(sessionId);
          }, delay);
          return;
        }
      }

      if (
        !shouldReconnectRef.current ||
        socketAttemptGenerationRef.current !== attemptGeneration
      ) {
        return;
      }

      let socketUrl: string;
      try {
        socketUrl = buildTicketedWebSocketUrl(socket);
      } catch (err) {
        shouldReconnectRef.current = false;
        setConnectionState("disconnected");
        setPresenceStatus("error");
        setError(
          err instanceof Error ? err.message : "Invalid WebSocket configuration",
        );
        return;
      }

      let ws: WebSocket;
      try {
        ws = new WebSocket(socketUrl);
      } catch (err) {
        shouldReconnectRef.current = false;
        setConnectionState("disconnected");
        setPresenceStatus("error");
        setError(
          err instanceof Error
            ? err.message
            : "Unable to open the WebSocket connection",
        );
        return;
      }
      wsRef.current = ws;

      ws.onopen = async () => {
        if (wsRef.current !== ws) return;

        const wasReconnecting = reconnectAttemptRef.current > 0;
        reconnectAttemptRef.current = 0;
        setConnectionState("connected");
        setError(null);
        setReactionError(null);

        if (wasReconnecting && lastMessageCursorRef.current) {
          try {
            const [missed, reloadedSession] = await Promise.all([
              liveSessionApi.getMessages(sessionId, {
                after: lastMessageCursorRef.current,
              }),
              liveSessionApi.getSession(sessionId),
            ]);
            if (missed.items.length > 0) {
              setMessages((prev) => {
                const existingIds = new Set(prev.map((m) => m.id));
                const fresh = missed.items.filter((m) => !existingIds.has(m.id));
                return [...prev, ...fresh];
              });
            }
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
              socketRoleRef.current = parsed.role;
              setChatMode(parsed.chatMode);
              setRestriction(parsed.restriction.restricted ? parsed.restriction : null);
              setConfig((previous) =>
                previous
                  ? {
                      ...previous,
                      pollLimits: parsed.poll.limits,
                      permissions: {
                        ...previous.permissions,
                        isHost: parsed.role === "host",
                        canChat: parsed.canSend,
                        canReact: parsed.reactions.enabled,
                      },
                      allowedReactions: parsed.reactions.allowed,
                    }
                  : previous
              );
              if (parsed.poll.current) {
                applyPollSnapshot(normalizePoll(parsed.poll.current)!);
              } else {
                setActivePoll((current) =>
                  current?.isClosed ? current : null
                );
              }
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
                isDeleted: false,
                deletedAt: null,
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
              if (parsed.requestId) {
                const pendingReaction = pendingReactionRequestsRef.current.get(
                  parsed.requestId
                );
                if (pendingReaction) {
                  clearTimeout(pendingReaction.timeout);
                  pendingReactionRequestsRef.current.delete(parsed.requestId);
                  setIsSendingReaction(
                    pendingReactionRequestsRef.current.size > 0
                  );
                  setReactionError(parsed.message);

                  if (parsed.code === "INVALID_REACTION") {
                    setConfig((current) =>
                      current
                        ? {
                            ...current,
                            allowedReactions: current.allowedReactions.filter(
                              (emoji) => emoji !== pendingReaction.emoji
                            ),
                          }
                        : current
                    );
                  }
                  if (parsed.code === "SESSION_NOT_LIVE") {
                    setConfig((current) =>
                      current
                        ? {
                            ...current,
                            permissions: {
                              ...current.permissions,
                              canReact: false,
                            },
                          }
                        : current
                    );
                  }

                  if (parsed.code === "REACTION_RATE_LIMITED") {
                    const retryAfterMs = Math.max(parsed.retryAfterMs ?? 3000, 0);
                    reactionCooldownUntilRef.current = Date.now() + retryAfterMs;
                    setIsReactionRateLimited(true);
                    if (reactionCooldownTimerRef.current) {
                      clearTimeout(reactionCooldownTimerRef.current);
                    }
                    reactionCooldownTimerRef.current = setTimeout(() => {
                      reactionCooldownUntilRef.current = 0;
                      setIsReactionRateLimited(false);
                      setReactionError(null);
                      reactionCooldownTimerRef.current = null;
                    }, retryAfterMs);
                  }
                  break;
                }
              }

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
              markMessageDeleted(parsed.messageId, parsed.deletedAt);
              break;

            case "session.chat_mode":
              setChatMode(parsed.chatMode);
              setCurrentSession((current) =>
                current ? { ...current, chatMode: parsed.chatMode } : current
              );
              setConfig((current) =>
                current
                  ? {
                      ...current,
                      session: { ...current.session, chatMode: parsed.chatMode },
                      permissions: {
                        ...current.permissions,
                        canChat: parsed.chatMode === "enabled",
                      },
                    }
                  : current
              );
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

            case "reaction.ack": {
              const pending = pendingReactionRequestsRef.current.get(
                parsed.requestId
              );
              if (!pending) break;
              clearTimeout(pending.timeout);
              pendingReactionRequestsRef.current.delete(parsed.requestId);
              setIsSendingReaction(
                pendingReactionRequestsRef.current.size > 0
              );
              setReactionError(null);
              break;
            }

            case "reaction.created":
              onReaction(parsed.reaction);
              break;

            case "poll.started":
              applyPollSnapshot(normalizePoll(parsed.poll)!);
              setPollError(null);
              break;

            case "poll.vote_recorded":
              setActivePoll((current) => {
                if (!current || current.id !== parsed.pollId) return current;
                if (parsed.revision < current.revision) return current;
                return {
                  ...current,
                  revision: Math.max(current.revision, parsed.revision),
                  userVotedOptionId: parsed.optionId,
                };
              });
              setPollError(null);
              break;

            case "poll.results_updated": {
              if (socketRoleRef.current !== "host") break;

              const results = new Map(
                parsed.results.map((result) => [result.optionId, result.voteCount])
              );
              setActivePoll((current) => {
                if (!current || current.id !== parsed.pollId) return current;
                if (parsed.revision < current.revision) return current;
                return {
                  ...current,
                  revision: parsed.revision,
                  totalVotes: parsed.totalVotes,
                  options: current.options.map((option) => ({
                    ...option,
                    votes: results.get(option.id) ?? option.votes,
                  })),
                };
              });
              break;
            }

            case "poll.closed":
              applyPollSnapshot(normalizePoll(parsed.poll)!);
              setPollError(null);
              break;

            case "chat.restriction_updated":
              setRestriction(
                parsed.restricted
                  ? {
                      restricted: true,
                      expiresAt: parsed.expiresAt,
                    }
                  : null
              );
              setConfig((current) =>
                current
                  ? {
                      ...current,
                      permissions: {
                        ...current.permissions,
                        canChat:
                          !parsed.restricted &&
                          current.session.chatMode === "enabled",
                      },
                    }
                  : current
              );
              break;

            case "session.ended":
              shouldReconnectRef.current = false;
              setConnectionState("ended");
              setParticipants([]);
              setActiveParticipantCount(0);
              setPresenceStatus("idle");
              for (const pending of pendingReactionRequestsRef.current.values()) {
                clearTimeout(pending.timeout);
              }
              pendingReactionRequestsRef.current.clear();
              setIsSendingReaction(false);
              if (reactionCooldownTimerRef.current) {
                clearTimeout(reactionCooldownTimerRef.current);
                reactionCooldownTimerRef.current = null;
              }
              reactionCooldownUntilRef.current = 0;
              setIsReactionRateLimited(false);
              setReactionError("Reactions are unavailable because the session ended.");
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

        for (const pending of pendingReactionRequestsRef.current.values()) {
          clearTimeout(pending.timeout);
        }
        pendingReactionRequestsRef.current.clear();
        setIsSendingReaction(false);
        setConnectionState("reconnecting");
        setPresenceStatus("reconnecting");
        const delay = Math.min(1000 * 2 ** reconnectAttemptRef.current, 15000);
        reconnectAttemptRef.current += 1;
        reconnectTimerRef.current = setTimeout(() => {
          void connectWebSocket(sessionId);
        }, delay);
      };

      ws.onerror = () => {
        if (wsRef.current !== ws) return;
        setPresenceStatus((current) =>
          current === "live" ? "reconnecting" : current
        );
      };
    },
    [applyPollSnapshot, cleanupSocket, currentUserId, markMessageDeleted, onReaction]
  );

  const joinSession = useCallback(
    async (sessionId: string) => {
      setIsJoining(true);
      setError(null);
      setParticipants([]);
      setActiveRestrictions([]);
      setActiveParticipantCount(0);
      setPresenceStatus("loading");
      hasLivePresenceRef.current = false;
      try {
        const joinData = await liveSessionApi.joinSession(sessionId);
        setConfig(joinData);
        setCurrentSession(joinData.session);
        setChatMode(joinData.session.chatMode);
        setRestriction(joinData.restriction || null);
        setReactionError(null);
        setActivePoll(joinData.activePoll);
        pollOperationRef.current = "idle";
        setPollOperation("idle");
        setPollError(null);
        setIsJoined(true);
        void connectWebSocket(sessionId, joinData.socket);

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

  useEffect(() => {
    if (!isJoined || !currentSession || !config?.permissions.isHost) return;

    let cancelled = false;
    liveSessionApi
      .getRestrictions(currentSession.id)
      .then((restrictions) => {
        if (!cancelled) setActiveRestrictions(restrictions);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load chat restrictions"
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [config?.permissions.isHost, currentSession, isJoined]);

  const leaveSession = useCallback(() => {
    cleanupSocket();
    setIsJoined(false);
    setConnectionState("disconnected");
    setMessages([]);
    setParticipants([]);
    setActiveRestrictions([]);
    setActiveParticipantCount(0);
    setPresenceStatus("idle");
    hasLivePresenceRef.current = false;
    setActivePoll(null);
    pollOperationRef.current = "idle";
    setPollOperation("idle");
    setPollError(null);
    setReactionError(null);
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

  const sendReaction = useCallback(
    (emoji: string) => {
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
        setReactionError("Reactions are unavailable while reconnecting.");
        return false;
      }
      if (!config?.permissions.canReact) {
        setReactionError("Reactions are not available for this session.");
        return false;
      }
      if (!config.allowedReactions.includes(emoji)) {
        setReactionError("That reaction is not supported.");
        return false;
      }
      if (
        pendingReactionRequestsRef.current.size > 0 ||
        reactionCooldownUntilRef.current > Date.now()
      ) {
        return false;
      }

      const requestId = crypto.randomUUID();
      const timeout = setTimeout(() => {
        if (!pendingReactionRequestsRef.current.has(requestId)) return;
        pendingReactionRequestsRef.current.delete(requestId);
        setIsSendingReaction(false);
        setReactionError("The reaction was not confirmed. Please try again.");
      }, 5000);

      pendingReactionRequestsRef.current.set(requestId, { emoji, timeout });
      setIsSendingReaction(true);
      setReactionError(null);

      try {
        const event: ReactionSendEvent = {
          version: 1,
          type: "reaction.send",
          requestId,
          emoji,
        };
        wsRef.current.send(JSON.stringify(event));
        return true;
      } catch {
        clearTimeout(timeout);
        pendingReactionRequestsRef.current.delete(requestId);
        setIsSendingReaction(false);
        setReactionError("The reaction could not be sent. Please try again.");
        return false;
      }
    },
    [config]
  );

  const createPoll = async (question: string, options: string[]) => {
    if (!currentSession || pollOperationRef.current !== "idle") return false;
    pollOperationRef.current = "creating";
    setPollOperation("creating");
    setPollError(null);
    try {
      const poll = await liveSessionApi.createPoll(currentSession.id, {
        question,
        options,
      });
      applyPollSnapshot(poll);
      return true;
    } catch (err) {
      if (
        err instanceof ApiError &&
        (err.code === "ACTIVE_POLL_ALREADY_EXISTS" ||
          err.code === "POLL_SNAPSHOT_UNAVAILABLE")
      ) {
        try {
          const current = await liveSessionApi.getCurrentPoll(currentSession.id);
          if (current) {
            applyPollSnapshot(current);
            if (err.code === "POLL_SNAPSHOT_UNAVAILABLE") {
              setPollError(null);
              return true;
            }
          }
        } catch {
          // Preserve the original action error.
        }
      }
      setPollError(err instanceof Error ? err.message : "Unable to launch poll");
      return false;
    } finally {
      pollOperationRef.current = "idle";
      setPollOperation("idle");
    }
  };

  const votePoll = async (optionId: string) => {
    if (
      !currentSession ||
      !activePoll ||
      activePoll.isClosed ||
      activePoll.userVotedOptionId ||
      pollOperationRef.current !== "idle"
    ) {
      return false;
    }

    pollOperationRef.current = "voting";
    setPollOperation("voting");
    setPollError(null);
    try {
      const updated = await liveSessionApi.votePoll(
        currentSession.id,
        activePoll.id,
        optionId
      );
      applyPollSnapshot(updated);
      return true;
    } catch (err) {
      if (err instanceof ApiError && err.code === "POLL_CLOSED") {
        setActivePoll((current) =>
          current ? { ...current, isClosed: true } : current
        );
      } else if (
        err instanceof ApiError &&
        (err.code === "POLL_ALREADY_VOTED" ||
          err.code === "POLL_OPTION_NOT_FOUND")
      ) {
        try {
          const current = await liveSessionApi.getCurrentPoll(currentSession.id);
          if (current) applyPollSnapshot(current);
        } catch {
          // Preserve the original action error.
        }
      }
      setPollError(err instanceof Error ? err.message : "Unable to submit vote");
      return false;
    } finally {
      pollOperationRef.current = "idle";
      setPollOperation("idle");
    }
  };

  const closePoll = async () => {
    if (
      !currentSession ||
      !activePoll ||
      activePoll.isClosed ||
      pollOperationRef.current !== "idle"
    ) {
      return false;
    }

    pollOperationRef.current = "closing";
    setPollOperation("closing");
    setPollError(null);
    try {
      const closed = await liveSessionApi.closePoll(
        currentSession.id,
        activePoll.id
      );
      applyPollSnapshot(closed);
      return true;
    } catch (err) {
      setPollError(err instanceof Error ? err.message : "Unable to close poll");
      return false;
    } finally {
      pollOperationRef.current = "idle";
      setPollOperation("idle");
    }
  };

  const dismissClosedPoll = () => {
    setActivePoll((current) => (current?.isClosed ? null : current));
    setPollError(null);
  };

  const changeChatMode = async (mode: ChatMode) => {
    if (!currentSession) return;
    try {
      const session = await liveSessionApi.updateChatMode(currentSession.id, mode);
      setCurrentSession(session);
      setChatMode(session.chatMode);
      setConfig((current) =>
        current
          ? {
              ...current,
              session,
              permissions: {
                ...current.permissions,
                canChat: session.chatMode === "enabled",
              },
            }
          : current
      );
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to change chat mode");
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (!currentSession) return;
    try {
      const deleted = await liveSessionApi.deleteMessage(
        currentSession.id,
        messageId
      );
      markMessageDeleted(deleted.messageId, deleted.deletedAt);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete message");
    }
  };

  const restrictUser = async (userId: string) => {
    if (!currentSession) return;
    try {
      const restriction = await liveSessionApi.restrictUser(
        currentSession.id,
        userId
      );
      setActiveRestrictions((prev) => [
        ...prev.filter((item) => item.userId !== userId),
        restriction,
      ]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to mute participant");
    }
  };

  const unrestrictUser = async (userId: string) => {
    if (!currentSession) return;
    try {
      await liveSessionApi.unrestrictUser(currentSession.id, userId);
      setActiveRestrictions((prev) =>
        prev.filter((restriction) => restriction.userId !== userId)
      );
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to unmute participant");
    }
  };

  const registerHostSession = async (title: string): Promise<LiveSession | null> => {
    if (isCreatingSessionRef.current) return null;

    isCreatingSessionRef.current = true;
    setIsCreatingSession(true);
    setCreateSessionError(null);
    try {
      const created = await liveSessionApi.createSession({ title });
      setCurrentSession(created);
      setError(null);
      return created;
    } catch (err) {
      if (
        err instanceof ApiError &&
        err.code === "YOUTUBE_VIDEO_ALREADY_REGISTERED"
      ) {
        try {
          const existing = await liveSessionApi.getCurrentSession();
          if (existing) {
            setCurrentSession(existing);
            setError(null);
            return existing;
          }
        } catch {
          // Fall through to the duplicate-session recovery message below.
        }
      }

      setCreateSessionError(getCreateSessionErrorMessage(err));
      return null;
    } finally {
      isCreatingSessionRef.current = false;
      setIsCreatingSession(false);
    }
  };

  const clearCreateSessionError = () => setCreateSessionError(null);

  const syncYouTube = async () => {
    if (!currentSession) return;
    try {
      const synced = await liveSessionApi.syncSession(currentSession.id);
      setCurrentSession(synced);
      setChatMode(synced.chatMode);
      setConfig((current) =>
        current
          ? {
              ...current,
              session: synced,
              permissions: {
                ...current.permissions,
                canChat: synced.chatMode === "enabled" && !restriction,
              },
            }
          : current
      );
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sync YouTube");
    }
  };

  return {
    currentSession,
    isLoadingSession,
    refreshCurrentSession,
    isCreatingSession,
    createSessionError,
    clearCreateSessionError,
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
    pollLimits: config?.pollLimits ?? DEFAULT_POLL_LIMITS,
    pollOperation,
    pollError,
    allowedReactions: config?.allowedReactions ?? [],
    canReact: Boolean(config?.permissions.canReact),
    isSendingReaction,
    isReactionRateLimited,
    reactionError,
    typingNames: Object.values(typingUsers).map((u) => u.name),
    joinSession,
    leaveSession,
    sendMessage,
    notifyTyping,
    sendReaction,
    createPoll,
    votePoll,
    closePoll,
    dismissClosedPoll,
    changeChatMode,
    deleteMessage,
    restrictUser,
    unrestrictUser,
    registerHostSession,
    syncYouTube,
  };
}
