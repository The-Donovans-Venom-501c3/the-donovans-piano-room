import { apiRequest, ApiError } from "./api";
import {
  ChatMode,
  ChatRestriction,
  LiveSession,
  MessagesPage,
  Participant,
  Poll,
  SessionJoinConfig,
} from "@/interfaces/liveSessionInterface";

const BASE = "/live-sessions";

export const liveSessionApi = {
  // 1. Find the current scheduled or live session
  getCurrentSession: async () => {
    try {
      return await apiRequest<LiveSession | null>(`${BASE}/current`, {
        cache: "no-store",
      });
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        return null;
      }
      throw err;
    }
  },

  // 2. Reload one known session
  getSession: (sessionId: string) =>
    apiRequest<LiveSession>(`${BASE}/${sessionId}`, { cache: "no-store" }),

  // 3. Authorize entry and get feature configuration
  joinSession: (sessionId: string) =>
    apiRequest<SessionJoinConfig>(`${BASE}/${sessionId}/join`, {
      method: "POST",
    }),

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
    return apiRequest<MessagesPage>(
      `${BASE}/${sessionId}/messages${qs ? `?${qs}` : ""}`,
      { cache: "no-store" }
    );
  },

  // 6. Participant snapshot and host search
  getParticipants: (sessionId: string, search?: string) => {
    const qs = search ? `?search=${encodeURIComponent(search)}` : "";
    return apiRequest<{ participants: Participant[]; count: number }>(
      `${BASE}/${sessionId}/participants${qs}`,
      { cache: "no-store" }
    );
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