import { apiRequest, ApiError } from "./api";
import {
  ChatMode,
  ChatRestriction,
  LiveSession,
  MessagesPage,
  Participant,
  Poll,
  ServerParticipant,
  SessionJoinConfig,
} from "@/interfaces/liveSessionInterface";

const BASE = "/live-sessions";

interface SessionResponse {
  session: LiveSession | null;
}

interface RawChatMessage {
  id: string;
  sender: {
    id: string;
    displayName: string;
    picture?: string | null;
    pronouns?: string | null;
  };
  text: string;
  createdAt: string;
  cursor: string;
}

interface RawPoll {
  id: string;
  question: string;
  status: "active" | "closed";
  options: Array<{
    id: string;
    text: string;
    voteCount: number;
  }>;
  myVoteOptionId?: string | null;
  totalVotes?: number;
}

interface JoinResponse {
  session: LiveSession;
  chat: {
    mode: ChatMode;
    canConnect: boolean;
    canSend: boolean;
    messageMaxCodePoints: number;
    restriction: {
      restricted: boolean;
      expiresAt: string | null;
    };
  };
  socket: {
    url: string;
    protocolVersion: number;
  };
  typing: {
    enabled: boolean;
    timeoutMs: number;
  };
  reactions: {
    enabled: boolean;
    allowed: string[];
  };
  poll: {
    active: boolean;
    current: RawPoll | null;
  };
}

function normalizePoll(poll: RawPoll | null): Poll | null {
  if (!poll) return null;

  return {
    id: poll.id,
    question: poll.question,
    options: poll.options.map((option) => ({
      id: option.id,
      text: option.text,
      votes: option.voteCount,
    })),
    isClosed: poll.status === "closed",
    userVotedOptionId: poll.myVoteOptionId ?? null,
    totalVotes: poll.totalVotes ?? 0,
  };
}

export function normalizeParticipant(participant: ServerParticipant): Participant {
  return {
    id: participant.userId,
    name: participant.displayName,
    avatarUrl: participant.picture ?? undefined,
    role: participant.role,
  };
}

export const liveSessionApi = {
  // 1. Find the current scheduled or live session
  getCurrentSession: async () => {
    try {
      const response = await apiRequest<SessionResponse>(`${BASE}/current`, {
        cache: "no-store",
      });
      return response.session;
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        return null;
      }
      throw err;
    }
  },

  // 2. Reload one known session
  getSession: async (sessionId: string) => {
    const response = await apiRequest<SessionResponse>(`${BASE}/${sessionId}`, {
      cache: "no-store",
    });
    if (!response.session) {
      throw new ApiError("Live session not found", 404);
    }
    return response.session;
  },

  // 3. Authorize entry and get feature configuration
  joinSession: async (sessionId: string): Promise<SessionJoinConfig> => {
    const response = await apiRequest<JoinResponse>(`${BASE}/${sessionId}/join`, {
      method: "POST",
    });

    return {
      session: {
        ...response.session,
        chatMode: response.chat.mode,
      },
      wsUrl: response.socket.url,
      permissions: {
        // The authoritative role arrives in the session.ready socket event.
        isHost: false,
        canChat: response.chat.canSend,
        canReact: response.reactions.enabled,
        canVote: true,
      },
      restriction: response.chat.restriction.restricted
        ? response.chat.restriction
        : null,
      activePoll: normalizePoll(response.poll.current),
      limits: {
        maxMessageLength: response.chat.messageMaxCodePoints,
        typingWindowMs: response.typing.timeoutMs,
        heartbeatIntervalMs: 20000,
      },
    };
  },

  // 5. Initial history, scroll-back, and reconnect recovery
  getMessages: (
    sessionId: string,
    params?: { before?: string; after?: string; limit?: number }
  ) => {
    const query = new URLSearchParams();
    if (params?.before) query.set("before", params.before);
    if (params?.after) query.set("after", params.after);
    if (params?.limit) query.set("limit", String(params.limit));
    const qs = query.toString();
    return apiRequest<{
      messages: RawChatMessage[];
      page: { nextCursor: string | null; hasMore: boolean };
    }>(
      `${BASE}/${sessionId}/messages${qs ? `?${qs}` : ""}`,
      { cache: "no-store" }
    ).then((response): MessagesPage => ({
      items: response.messages.map((message) => ({
        id: message.id,
        userId: message.sender.id,
        name: message.sender.displayName,
        avatarUrl: message.sender.picture ?? undefined,
        pronouns: message.sender.pronouns ?? undefined,
        text: message.text,
        createdAt: message.createdAt,
        cursor: message.cursor,
      })),
      nextCursor: response.page.nextCursor,
      hasMore: response.page.hasMore,
    }));
  },

  // 6. Participant snapshot and host search
  getParticipants: (sessionId: string, search?: string) => {
    const qs = search ? `?search=${encodeURIComponent(search)}` : "";
    return apiRequest<{ participants: ServerParticipant[]; activeCount: number }>(
      `${BASE}/${sessionId}/participants${qs}`,
      { cache: "no-store" }
    ).then((response) => ({
      participants: response.participants.map(normalizeParticipant),
      count: response.activeCount,
    }));
  },

  // 7. Reload the active poll
  getCurrentPoll: (sessionId: string) =>
    apiRequest<Poll | null>(`${BASE}/${sessionId}/polls/current`, {
      cache: "no-store",
    }),

  // 8. Host creates and launches a poll
  createPoll: (
    sessionId: string,
    payload: { question: string; options: string[] }
  ) =>
    apiRequest<Poll>(`${BASE}/${sessionId}/polls`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // 9. Attendee submits one choice
  votePoll: (sessionId: string, pollId: string, optionId: string) =>
    apiRequest<Poll>(`${BASE}/${sessionId}/polls/${pollId}/votes`, {
      method: "POST",
      body: JSON.stringify({ optionId }),
    }),

  // 10. Host closes a poll
  closePoll: (sessionId: string, pollId: string) =>
    apiRequest<Poll>(`${BASE}/${sessionId}/polls/${pollId}/close`, {
      method: "POST",
    }),

  // 11. Host enables, disables, or makes chat read-only
  updateChatMode: (sessionId: string, chatMode: ChatMode) =>
    apiRequest<{ chatMode: ChatMode }>(`${BASE}/${sessionId}/chat-mode`, {
      method: "PATCH",
      body: JSON.stringify({ chatMode }),
    }),

  // 12. Host deletes a message
  deleteMessage: (sessionId: string, messageId: string) =>
    apiRequest<void>(`${BASE}/${sessionId}/messages/${messageId}`, {
      method: "DELETE",
    }),

  // 13. Host restricts a participant from chatting
  restrictUser: (
    sessionId: string,
    userId: string,
    payload?: { reason?: string; durationSeconds?: number }
  ) =>
    apiRequest<ChatRestriction>(
      `${BASE}/${sessionId}/chat-restrictions/${userId}`,
      {
        method: "PUT",
        body: JSON.stringify(payload || {}),
      }
    ),

  // 14. Host removes a chat restriction
  unrestrictUser: (sessionId: string, userId: string) =>
    apiRequest<void>(`${BASE}/${sessionId}/chat-restrictions/${userId}`, {
      method: "DELETE",
    }),

  // 15. Host loads active restrictions
  getRestrictions: (sessionId: string) =>
    apiRequest<ChatRestriction[]>(`${BASE}/${sessionId}/chat-restrictions`, {
      cache: "no-store",
    }),

  // 16. Configured host registers a YouTube session
  createSession: (payload: { youtubeVideoId: string; title?: string }) =>
    apiRequest<LiveSession>(BASE, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // 17. Configured host requests immediate YouTube synchronization
  syncSession: (sessionId: string) =>
    apiRequest<LiveSession>(`${BASE}/${sessionId}/sync`, {
      method: "POST",
    }),
};
