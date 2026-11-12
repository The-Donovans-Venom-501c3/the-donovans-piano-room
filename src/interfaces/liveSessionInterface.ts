export type SessionStatus = "scheduled" | "live" | "ended";
export type ChatMode = "open" | "read_only" | "disabled";

export interface LiveSession {
  id: string;
  youtubeVideoId: string;
  title?: string;
  status: SessionStatus;
  chatMode: ChatMode;
  scheduledStartAt?: string;
  startedAt?: string;
  endedAt?: string;
}

export interface SessionJoinConfig {
  session: LiveSession;
  wsUrl: string;
  permissions: {
    isHost: boolean;
    canChat: boolean;
    canReact: boolean;
    canVote: boolean;
  };
  restriction?: ChatRestriction | null;
  activePoll: Poll | null;
  limits: {
    maxMessageLength: number;
    typingWindowMs: number;
    heartbeatIntervalMs: number;
  };
}

export interface ChatMessage {
  id: string;
  userId: string;
  name: string;
  avatarUrl?: string;
  pronouns?: string;
  text: string;
  createdAt: string;
  isHost?: boolean;
}

export interface MessagesPage {
  items: ChatMessage[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface Participant {
  id: string;
  name: string;
  avatarUrl?: string;
  role: "Host" | "Participant" | string;
  isRestricted?: boolean;
}

export interface ChatRestriction {
  userId: string;
  userName?: string;
  reason?: string;
  expiresAt?: string | null;
  createdAt: string;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  isClosed: boolean;
  userVotedOptionId?: string | null;
  totalVotes?: number;
}

export type WsInboundEvent =
  | { type: "presence.snapshot"; payload: { participants: Participant[]; count: number } }
  | { type: "presence.updated"; payload: { participants: Participant[]; count: number } }
  | { type: "chat.message"; payload: ChatMessage }
  | { type: "chat.message_deleted"; payload: { messageId: string } }
  | { type: "chat.mode_changed"; payload: { chatMode: ChatMode } }
  | { type: "typing.updated"; payload: { userId: string; name: string; isTyping: boolean } }
  | { type: "reaction.created"; payload: { emoji: string; userId?: string } }
  | { type: "poll.created"; payload: Poll }
  | { type: "poll.updated"; payload: Poll }
  | { type: "poll.closed"; payload: Poll }
  | { type: "user.restricted"; payload: { userId: string; restriction: ChatRestriction } }
  | { type: "user.unrestricted"; payload: { userId: string } }
  | { type: "session.ended"; payload: { sessionId: string; endedAt?: string } }
  | { type: "pong"; payload?: unknown };