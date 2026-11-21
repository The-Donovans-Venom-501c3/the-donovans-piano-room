export type SessionStatus = "scheduled" | "live" | "ended";
export type ChatMode = "enabled" | "read_only" | "disabled";

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
  restriction?: CurrentUserRestriction | null;
  allowedReactions: string[];
  activePoll: Poll | null;
  pollLimits: PollLimits;
  limits: {
    maxMessageLength: number;
    typingWindowMs: number;
    heartbeatIntervalMs: number;
  };
}

export interface CurrentUserRestriction {
  restricted: boolean;
  expiresAt: string | null;
}

export interface ChatMessage {
  id: string;
  userId: string;
  name: string;
  avatarUrl?: string;
  pronouns?: string;
  text: string | null;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  cursor?: string;
  isHost?: boolean;
}

export interface ServerChatMessage {
  id: string;
  clientMessageId: string;
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

export interface ServerParticipant {
  userId: string;
  displayName: string;
  picture?: string | null;
  role: string;
}

export interface ServerReaction {
  id: string;
  emoji: string;
  sender: {
    id: string;
    displayName: string;
    picture?: string | null;
  };
  createdAt: string;
}

export interface ReactionSendEvent {
  version: 1;
  type: "reaction.send";
  requestId: string;
  emoji: string;
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

export interface PollLimits {
  questionMaxCodePoints: number;
  optionMinCount: number;
  optionMaxCount: number;
  optionMaxCodePoints: number;
}

export interface ServerPollSnapshot {
  id: string;
  question: string;
  status: "active" | "closed";
  revision: number;
  closedAt?: string | null;
  options: Array<{
    id: string;
    text: string;
    voteCount: number;
  }>;
  myVoteOptionId?: string | null;
  totalVotes: number;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  revision: number;
  isClosed: boolean;
  closedAt?: string | null;
  userVotedOptionId?: string | null;
  totalVotes: number;
}

export type WsInboundEvent =
  | {
      type: "session.ready";
      role: "host" | "participant";
      chatMode: ChatMode;
      canSend: boolean;
      restriction: CurrentUserRestriction;
      reactions: {
        enabled: boolean;
        allowed: string[];
      };
      poll: {
        active: boolean;
        current: ServerPollSnapshot | null;
        limits: PollLimits;
      };
    }
  | {
      type: "presence.snapshot";
      participants: ServerParticipant[];
      activeCount: number;
    }
  | {
      type: "presence.joined";
      participant: ServerParticipant;
      activeCount: number;
    }
  | { type: "presence.left"; userId: string; activeCount: number }
  | {
      type: "chat.ack";
      requestId: string;
      clientMessageId: string;
      messageId: string;
      status: "accepted" | "duplicate";
    }
  | { type: "chat.message"; message: ServerChatMessage }
  | {
      type: "error";
      requestId: string | null;
      code: string;
      message: string;
      retryable: boolean;
      retryAfterMs?: number;
    }
  | {
      type: "chat.message_deleted";
      sessionId: string;
      messageId: string;
      deletedAt: string;
    }
  | { type: "session.chat_mode"; chatMode: ChatMode }
  | { type: "typing.updated"; payload: { userId: string; name: string; isTyping: boolean } }
  | {
      type: "reaction.ack";
      requestId: string;
      reactionId: string;
      status: "accepted";
    }
  | { type: "reaction.created"; reaction: ServerReaction }
  | { type: "poll.started"; poll: ServerPollSnapshot }
  | {
      type: "poll.vote_recorded";
      pollId: string;
      optionId: string;
      revision: number;
    }
  | {
      type: "poll.results_updated";
      pollId: string;
      revision: number;
      results: Array<{ optionId: string; voteCount: number }>;
      totalVotes: number;
    }
  | { type: "poll.closed"; poll: ServerPollSnapshot }
  | {
      type: "chat.restriction_updated";
      restricted: boolean;
      expiresAt: string | null;
    }
  | { type: "session.ended"; payload: { sessionId: string; endedAt?: string } }
  | { type: "pong"; payload?: unknown };
