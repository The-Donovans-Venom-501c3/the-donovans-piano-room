"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Image from "next/image";
import { useLiveSession } from "@/utils/useLiveSession";
import { ChatMode } from "@/interfaces/liveSessionInterface";

interface LiveSessionsComponentProps {
  currentUser?: {
    id: string;
    name: string;
    role: "Presenter" | "Participant";
    pronouns?: string;
  };
  youtubeChannelId?: string;
  searchQuery?: string;
}

type SidePanelTab = "people" | "chat" | "react" | "poll" | null;

interface FloatingReaction {
  id: number;
  emoji: string;
  leftPercent: number;
}

const SUPPORTED_REACTIONS = ["👏", "❤️", "🎉", "🔥", "😂", "👍"];

function extractYouTubeChannelId(input?: string): { id: string; type: "channel" | "handle" | "none" } {
  const channelInput = input?.trim() || process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_NAME?.trim() || "";
  if (!channelInput) return { id: "", type: "none" };

  if (channelInput.includes("@")) {
    const handle = channelInput.substring(channelInput.indexOf("@")).split("/")[0].split("?")[0];
    return { id: handle, type: "handle" };
  }

  if (channelInput.includes("youtube.com/channel/")) {
    const channelId = channelInput.split("youtube.com/channel/")[1]?.split("/")[0]?.split("?")[0];
    return { id: channelId || "", type: "channel" };
  }

  return { id: channelInput, type: "channel" };
}

export default function LiveSessionsComponent({
  currentUser = { id: "user-1", name: "You", role: "Participant", pronouns: "She / Her / Hers" },
  youtubeChannelId = "UCHaJE4kPmB9jqlUbbi-sHXA",
}: LiveSessionsComponentProps): React.JSX.Element {
  const [activePanel, setActivePanel] = useState<SidePanelTab>(null);
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [participantSearch, setParticipantSearch] = useState("");

  const [showCreateSessionModal, setShowCreateSessionModal] = useState(false);
  const [newVideoId, setNewVideoId] = useState("");
  const [newSessionTitle, setNewSessionTitle] = useState("");

  const [newQuestion, setNewQuestion] = useState("");
  const [newOptions, setNewOptions] = useState(["", ""]);
  const [pollSelected, setPollSelected] = useState<string | null>(null);

  const [floatingReactions, setFloatingReactions] = useState<FloatingReaction[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [hasEmbedError, setHasEmbedError] = useState(false);

  const chatScrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const triggerReaction = useCallback((emoji: string) => {
    const newId = Date.now() + Math.random();
    const randomLeft = Math.floor(Math.random() * 70) + 15;

    setFloatingReactions((prev) => [
      ...prev,
      { id: newId, emoji, leftPercent: randomLeft },
    ]);

    setTimeout(() => {
      setFloatingReactions((prev) => prev.filter((item) => item.id !== newId));
    }, 2000);
  }, []);

  const {
    currentSession,
    isLoadingSession,
    isJoined,
    isJoining,
    connectionState,
    error,
    isHost,
    chatMode,
    restriction,
    activeRestrictions,
    participants,
    messages,
    hasMoreMessages,
    isLoadingOlder,
    loadOlderMessages,
    activePoll,
    typingNames,
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
  } = useLiveSession({
    currentUserId: currentUser.id,
    onReaction: triggerReaction,
  });

  const parsedChannel = useMemo(() => extractYouTubeChannelId(youtubeChannelId), [youtubeChannelId]);

  const embedUrl = useMemo(() => {
    if (!isMounted) return "";

    if (currentSession?.youtubeVideoId) {
      return `https://www.youtube.com/embed/${encodeURIComponent(currentSession.youtubeVideoId)}?autoplay=1&mute=1&enablejsapi=1`;
    }

    if (parsedChannel.type === "channel" && parsedChannel.id) {
      return `https://www.youtube.com/embed/live_stream?channel=${encodeURIComponent(parsedChannel.id)}&autoplay=1&mute=1&enablejsapi=1`;
    }

    if (parsedChannel.type === "handle") {
      return `https://www.youtube.com/embed/live?channel=${encodeURIComponent(parsedChannel.id)}&autoplay=1&mute=1`;
    }

    return "";
  }, [currentSession?.youtubeVideoId, parsedChannel, isMounted]);

  const directWatchUrl = useMemo(() => {
    if (currentSession?.youtubeVideoId) {
      return `https://www.youtube.com/watch?v=${encodeURIComponent(currentSession.youtubeVideoId)}`;
    }
    if (parsedChannel.type === "channel" && parsedChannel.id) {
      return `https://www.youtube.com/channel/${parsedChannel.id}/live`;
    }
    if (parsedChannel.type === "handle") {
      return `https://www.youtube.com/${parsedChannel.id}/live`;
    }
    return "https://www.youtube.com";
  }, [currentSession?.youtubeVideoId, parsedChannel]);

  const handlePanelOpen = (panel: SidePanelTab) => {
    if (activePanel === panel) {
      setIsPanelCollapsed(!isPanelCollapsed);
    } else {
      setActivePanel(panel);
      setIsPanelCollapsed(false);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    sendMessage(chatMessage);
    setChatMessage("");
  };

  const handleChatScroll = () => {
    const el = chatScrollRef.current;
    if (el && el.scrollTop < 40 && hasMoreMessages && !isLoadingOlder) {
      loadOlderMessages();
    }
  };

  const handleCreatePoll = async (e: React.FormEvent) => {
    e.preventDefault();
    const validOptions = newOptions.filter((opt) => opt.trim() !== "");
    if (!newQuestion.trim() || validOptions.length < 2) return;

    await createPoll(newQuestion.trim(), validOptions);
    setNewQuestion("");
    setNewOptions(["", ""]);
    setPollSelected(null);
  };

  const handleCreateSessionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideoId.trim()) return;
    await registerHostSession(newVideoId.trim(), newSessionTitle.trim() || undefined);
    setShowCreateSessionModal(false);
    setNewVideoId("");
    setNewSessionTitle("");
  };

  const filteredParticipants = useMemo(() => {
    const q = participantSearch.trim().toLowerCase();
    if (!q) return participants;
    return participants.filter((p) => p.name.toLowerCase().includes(q));
  }, [participants, participantSearch]);

  const restrictedUserIds = useMemo(
    () => new Set(activeRestrictions.map((r) => r.userId)),
    [activeRestrictions]
  );

  const codePointCount = [...chatMessage].length;
  const isChatDisabled =
    connectionState !== "connected" ||
    Boolean(restriction) ||
    (!isHost && chatMode !== "open");

  return (
    <div className="w-full flex flex-col justify-start items-start">
      {isJoined ? (
        <div className="w-full flex flex-col">
          {/* HEADER */}
          <div className="w-full flex items-center justify-between mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <button
                onClick={leaveSession}
                className="inline-flex items-center gap-2 bg-[#6F219E] hover:bg-purple-900 text-white text-sm font-bold px-4 py-2 rounded-xl transition cursor-pointer shadow-sm active:scale-95"
              >
                <span>❮</span> Back
              </button>
              <h2 className="text-xl md:text-2xl font-extrabold text-[#632200]">
                {currentSession?.title || "Live session"}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              {isHost && (
                <button
                  onClick={syncYouTube}
                  className="text-xs bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold px-3 py-1.5 rounded-lg transition cursor-pointer"
                >
                  ↻ Sync YouTube
                </button>
              )}
              <a
                href={directWatchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs bg-red-100 hover:bg-red-200 text-red-700 font-bold px-3 py-1.5 rounded-lg transition"
              >
                Watch on YouTube ↗
              </a>
              <div className="flex items-center space-x-2 text-purple-900 font-extrabold text-sm">
                <span>
                  {connectionState === "ended"
                    ? "Session ended"
                    : connectionState === "reconnecting"
                    ? "Reconnecting..."
                    : "Session in progress"}
                </span>
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col lg:flex-row gap-4 items-end lg:items-stretch h-[calc(100vh-290px)] max-h-[520px] min-h-[420px] relative">
            {/* VIDEO PLAYER CONTAINER */}
            <div className="relative flex-1 w-full bg-black rounded-3xl overflow-hidden shadow-xl h-full flex items-center justify-center">
              {connectionState === "ended" ? (
                <div className="text-center p-6 text-white space-y-3 z-10 max-w-md bg-neutral-900/90 rounded-2xl border border-white/10 backdrop-blur-md">
                  <p className="text-lg font-extrabold">This live session has ended</p>
                  <p className="text-xs text-gray-400">
                    Thank you for joining! You can still review the chat history or return to the lobby.
                  </p>
                </div>
              ) : isMounted && embedUrl && !hasEmbedError ? (
                <>
                  <iframe
                    src={embedUrl}
                    title="Embedded YouTube livestream"
                    className="absolute top-0 left-0 w-full h-full object-cover"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  <div className="absolute top-3 right-3 z-30 opacity-80 hover:opacity-100 transition">
                    <button
                      onClick={() => setHasEmbedError(true)}
                      className="bg-black/60 hover:bg-black/80 text-white text-[10px] px-2.5 py-1 rounded-lg backdrop-blur-md border border-white/20 cursor-pointer"
                    >
                      Stream not loading?
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center p-6 text-white space-y-4 z-10 max-w-md bg-neutral-900/90 rounded-2xl border border-white/10 backdrop-blur-md">
                  <div className="w-12 h-12 bg-red-600/20 text-red-500 rounded-full flex items-center justify-center mx-auto text-xl">
                    📺
                  </div>
                  <div className="space-y-1">
                    <p className="text-base font-bold text-white">Playback Restricted or Channel Offline</p>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      This channel may be offline, or YouTube is blocking embed playback. You can view the stream directly on YouTube.
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-3 pt-2">
                    <a
                      href={directWatchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-lg active:scale-95"
                    >
                      Watch Live on YouTube ↗
                    </a>
                    {hasEmbedError && (
                      <button
                        onClick={() => setHasEmbedError(false)}
                        className="text-xs text-gray-300 hover:text-white underline font-medium px-2 py-1 cursor-pointer"
                      >
                        Retry Player
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* REACTION OVERLAY */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
                {floatingReactions.map((item) => (
                  <span
                    key={item.id}
                    className="absolute text-5xl animate-float-up opacity-0"
                    style={{ left: `${item.leftPercent}%`, bottom: "90px" }}
                  >
                    {item.emoji}
                  </span>
                ))}
              </div>

              {/* CONTROL BAR */}
              <div className="absolute bottom-4 inset-x-0 z-40 flex items-center justify-center gap-2 md:gap-3 px-4 pointer-events-none">
                <div className="bg-black/85 backdrop-blur-md p-2 rounded-2xl flex items-center gap-2 border border-white/20 shadow-2xl pointer-events-auto">
                  <button
                    onClick={() => handlePanelOpen("people")}
                    className={`px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 transition cursor-pointer ${
                      activePanel === "people" ? "bg-purple-600 text-white" : "bg-[#41285E]/90 text-white hover:bg-purple-800"
                    }`}
                  >
                    <span>👥</span> People ({participants.length})
                  </button>
                  <button
                    onClick={() => handlePanelOpen("chat")}
                    className={`px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 transition cursor-pointer ${
                      activePanel === "chat" ? "bg-purple-600 text-white" : "bg-[#41285E]/90 text-white hover:bg-purple-800"
                    }`}
                  >
                    <span>💬</span> Chat
                  </button>
                  <button
                    onClick={() => handlePanelOpen("react")}
                    className={`px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 transition cursor-pointer ${
                      activePanel === "react" ? "bg-purple-600 text-white" : "bg-[#41285E]/90 text-white hover:bg-purple-800"
                    }`}
                  >
                    <span>❤️</span> React
                  </button>
                  <button
                    onClick={() => handlePanelOpen("poll")}
                    className={`px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 transition cursor-pointer relative ${
                      activePanel === "poll" ? "bg-purple-600 text-white" : "bg-[#41285E]/90 text-white hover:bg-purple-800"
                    }`}
                  >
                    <span>📊</span> Poll
                    {activePoll && !activePoll.isClosed && (
                      <span className="w-2 h-2 rounded-full bg-yellow-400" />
                    )}
                  </button>
                  <button
                    onClick={() => setShowExitModal(true)}
                    className="bg-[#E65100] hover:bg-orange-600 text-white p-2 rounded-xl transition text-sm font-bold flex items-center justify-center cursor-pointer"
                    title="Exit Session"
                  >
                    🚪
                  </button>
                </div>
              </div>
            </div>

            {/* SIDE PANELS */}
            {activePanel && (
              <div className="flex flex-col justify-end shrink-0 z-40 transition-all">
                {isPanelCollapsed ? (
                  <div className="bg-[#6B21A8] text-[#FDE047] rounded-t-3xl px-6 py-4 flex items-center justify-between w-full lg:w-[320px] xl:w-[350px] shadow-2xl border-t border-x border-purple-400/30">
                    <span className="font-extrabold text-sm md:text-base tracking-wide">
                      {activePanel === "chat" && "Meeting chat"}
                      {activePanel === "people" && `Participants (${participants.length})`}
                      {activePanel === "react" && "Reactions"}
                      {activePanel === "poll" && "Poll"}
                    </span>
                    <div className="flex items-center space-x-4 text-[#FDE047]">
                      <button onClick={() => setIsPanelCollapsed(false)} className="hover:scale-125 transition font-black text-sm cursor-pointer">▲</button>
                      <button onClick={() => setActivePanel(null)} className="hover:scale-125 transition font-black text-sm cursor-pointer">✕</button>
                    </div>
                  </div>
                ) : (
                  <div className="w-full lg:w-[320px] xl:w-[350px] bg-[#F8F5FB] rounded-3xl p-4 flex flex-col justify-between shadow-xl shrink-0 border border-purple-100/50 h-full">
                    <div className="flex items-center justify-between pb-2 shrink-0 px-1">
                      <h3 className="font-extrabold text-lg text-[#4A1D0B]">
                        {activePanel === "people" && `Participants (${participants.length})`}
                        {activePanel === "chat" && "Meeting chat"}
                        {activePanel === "react" && "Reactions"}
                        {activePanel === "poll" && "Poll"}
                      </h3>
                      <div className="flex items-center space-x-3 text-[#6B21A8]">
                        <button onClick={() => setIsPanelCollapsed(true)} className="hover:text-purple-900 font-bold text-sm cursor-pointer">▼</button>
                        <button onClick={() => setActivePanel(null)} className="hover:text-purple-900 font-bold text-sm cursor-pointer">✕</button>
                      </div>
                    </div>

                    {/* CHAT PANEL */}
                    {activePanel === "chat" && (
                      <div className="flex-1 flex flex-col justify-between my-1 overflow-hidden">
                        {isHost && (
                          <div className="flex items-center justify-between bg-purple-100/70 rounded-xl px-2.5 py-1.5 mb-2 text-[11px]">
                            <span className="font-bold text-purple-950">Chat mode:</span>
                            <select
                              value={chatMode}
                              onChange={(e) => changeChatMode(e.target.value as ChatMode)}
                              className="bg-white border border-purple-200 rounded-lg px-2 py-0.5 font-bold text-purple-900 outline-none cursor-pointer"
                            >
                              <option value="open">Open</option>
                              <option value="read_only">Read-only</option>
                              <option value="disabled">Disabled</option>
                            </select>
                          </div>
                        )}

                        <div
                          ref={chatScrollRef}
                          onScroll={handleChatScroll}
                          className="overflow-y-auto space-y-3 flex-1 pr-1 py-1"
                        >
                          {isLoadingOlder && (
                            <p className="text-center text-[10px] text-purple-700 font-semibold">
                              Loading older messages...
                            </p>
                          )}

                          {chatMode === "disabled" && !isHost ? (
                            <p className="text-center text-xs text-gray-400 my-auto">
                              Chat is currently disabled by the host.
                            </p>
                          ) : messages.length === 0 ? (
                            <p className="text-center text-xs text-gray-400 my-auto">
                              No messages yet. Say hello!
                            </p>
                          ) : (
                            messages.map((m) => (
                              <div key={m.id} className="bg-white rounded-2xl p-3 shadow-2xs border border-purple-50/80 group">
                                <div className="flex items-start space-x-2.5 mb-1.5">
                                  <div className="w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center text-white text-xs font-bold shrink-0 overflow-hidden">
                                    {m.avatarUrl ? (
                                      <img src={m.avatarUrl} alt={m.name} className="w-full h-full object-cover" />
                                    ) : (
                                      m.name[0]
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-1">
                                      <h4 className="font-extrabold text-xs text-[#3B1700] truncate">
                                        {m.name}
                                        {m.isHost && (
                                          <span className="ml-1.5 text-[9px] bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded-full">
                                            Host
                                          </span>
                                        )}
                                      </h4>
                                      <div className="flex items-center gap-1.5 shrink-0">
                                        <span className="text-[9px] text-gray-400">
                                          {new Date(m.createdAt).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                          })}
                                        </span>
                                        {isHost && (
                                          <button
                                            onClick={() => deleteMessage(m.id)}
                                            className="text-[10px] text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition cursor-pointer"
                                            title="Delete message"
                                          >
                                            🗑
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                    {m.pronouns && (
                                      <p className="text-[10px] text-gray-500 font-medium">{m.pronouns}</p>
                                    )}
                                  </div>
                                </div>
                                <p className="text-xs text-gray-700 font-medium pl-1 break-words">{m.text}</p>
                              </div>
                            ))
                          )}
                        </div>

                        {typingNames.length > 0 && (
                          <p className="text-[10px] text-purple-700 font-semibold px-2 pt-1 truncate">
                            {typingNames.length === 1
                              ? `${typingNames[0]} is typing...`
                              : `${typingNames.slice(0, 2).join(", ")} are typing...`}
                          </p>
                        )}

                        {restriction && (
                          <p className="text-[11px] text-red-600 bg-red-50 rounded-xl px-3 py-1.5 mt-1 font-semibold">
                            You are restricted from sending messages.
                          </p>
                        )}

                        <form onSubmit={handleSendMessage} className="relative mt-2 shrink-0">
                          <input
                            type="text"
                            placeholder={
                              restriction
                                ? "Chat restricted"
                                : chatMode !== "open" && !isHost
                                ? "Chat is read-only"
                                : "Send a message"
                            }
                            disabled={isChatDisabled}
                            value={chatMessage}
                            onChange={(e) => {
                              setChatMessage(e.target.value);
                              notifyTyping();
                            }}
                            className="w-full bg-[#FFF9EE] text-xs text-gray-800 border border-[#EADBCE] rounded-2xl pl-4 pr-12 py-3 outline-none focus:border-purple-600 font-medium disabled:opacity-50"
                          />
                          <span
                            className={`absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold ${
                              codePointCount > 200 ? "text-red-600" : "text-gray-400"
                            }`}
                          >
                            {codePointCount}/200
                          </span>
                        </form>
                      </div>
                    )}

                    {/* PARTICIPANTS PANEL */}
                    {activePanel === "people" && (
                      <div className="flex-1 flex flex-col overflow-hidden my-2">
                        {isHost && (
                          <input
                            type="text"
                            placeholder="Search participants..."
                            value={participantSearch}
                            onChange={(e) => setParticipantSearch(e.target.value)}
                            className="w-full bg-white text-xs border border-purple-100 rounded-xl px-3 py-2 mb-2 outline-none focus:border-purple-600"
                          />
                        )}
                        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                          {filteredParticipants.map((user) => {
                            const isUserRestricted =
                              user.isRestricted || restrictedUserIds.has(user.id);
                            return (
                              <div
                                key={user.id}
                                className="flex items-center justify-between text-sm p-2 bg-white rounded-2xl border border-purple-50"
                              >
                                <div className="flex items-center space-x-3 min-w-0">
                                  <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center font-extrabold text-purple-800 text-xs shrink-0">
                                    {user.name[0]}
                                  </div>
                                  <div className="truncate">
                                    <p className="font-bold text-gray-800 text-xs truncate">{user.name}</p>
                                    <p className="text-[10px] text-gray-500">
                                      {user.role} {isUserRestricted ? "• Muted" : ""}
                                    </p>
                                  </div>
                                </div>

                                {isHost && user.id !== currentUser.id && (
                                  <button
                                    onClick={() =>
                                      isUserRestricted
                                        ? unrestrictUser(user.id)
                                        : restrictUser(user.id)
                                    }
                                    className={`text-[10px] font-bold px-2.5 py-1 rounded-lg cursor-pointer transition ${
                                      isUserRestricted
                                        ? "bg-green-100 text-green-800 hover:bg-green-200"
                                        : "bg-red-100 text-red-700 hover:bg-red-200"
                                    }`}
                                  >
                                    {isUserRestricted ? "Unmute" : "Mute"}
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* REACTIONS PANEL */}
                    {activePanel === "react" && (
                      <div className="flex-1 flex items-center justify-center py-4">
                        <div className="grid grid-cols-3 gap-3 text-3xl bg-white p-4 rounded-3xl w-full text-center border border-purple-50">
                          {SUPPORTED_REACTIONS.map((emoji) => (
                            <button
                              key={emoji}
                              onClick={() => sendReaction(emoji)}
                              className="p-2 hover:scale-125 transition transform active:scale-95 cursor-pointer"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* POLL PANEL */}
                    {activePanel === "poll" && (
                      <div className="flex-1 my-2 flex flex-col justify-between overflow-y-auto">
                        {activePoll ? (
                          <div className="space-y-3 flex-1 flex flex-col justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between gap-2">
                                <p className="font-extrabold text-gray-800 text-xs">
                                  {activePoll.question}
                                </p>
                                {activePoll.isClosed && (
                                  <span className="text-[10px] bg-gray-200 text-gray-700 font-bold px-2 py-0.5 rounded-full shrink-0">
                                    Closed
                                  </span>
                                )}
                              </div>

                              {activePoll.options.map((opt) => {
                                const total =
                                  activePoll.totalVotes ??
                                  activePoll.options.reduce((sum, o) => sum + o.votes, 0);
                                const pct = total > 0 ? Math.round((opt.votes / total) * 100) : 0;
                                const showResults =
                                  isHost || activePoll.isClosed || Boolean(activePoll.userVotedOptionId);
                                const isChosen =
                                  activePoll.userVotedOptionId === opt.id || pollSelected === opt.id;

                                return (
                                  <button
                                    key={opt.id}
                                    disabled={showResults}
                                    onClick={() => setPollSelected(opt.id)}
                                    className={`w-full text-left p-2.5 rounded-2xl border text-xs font-semibold transition relative overflow-hidden ${
                                      isChosen
                                        ? "border-purple-600 bg-purple-100 text-purple-900"
                                        : "border-gray-200 bg-white text-gray-800"
                                    } ${!showResults ? "cursor-pointer" : "cursor-default"}`}
                                  >
                                    {showResults && (
                                      <div
                                        className="absolute inset-y-0 left-0 bg-purple-200/50 transition-all"
                                        style={{ width: `${pct}%` }}
                                      />
                                    )}
                                    <div className="relative flex items-center justify-between">
                                      <span>{opt.text}</span>
                                      {showResults && (
                                        <span className="text-[11px] font-extrabold text-purple-900">
                                          {pct}% ({opt.votes})
                                        </span>
                                      )}
                                    </div>
                                  </button>
                                );
                              })}
                            </div>

                            {!isHost && !activePoll.isClosed && !activePoll.userVotedOptionId && (
                              <button
                                onClick={() => pollSelected && votePoll(pollSelected)}
                                disabled={!pollSelected}
                                className="w-full bg-purple-700 text-white font-extrabold text-xs py-2.5 rounded-2xl disabled:opacity-50 mt-2 transition cursor-pointer"
                              >
                                Submit Answer
                              </button>
                            )}

                            {isHost && !activePoll.isClosed && (
                              <button
                                onClick={closePoll}
                                className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs py-2.5 rounded-2xl mt-2 transition cursor-pointer"
                              >
                                Close Poll
                              </button>
                            )}
                          </div>
                        ) : isHost ? (
                          <form onSubmit={handleCreatePoll} className="space-y-3">
                            <h4 className="font-bold text-xs text-purple-950">Create a Poll</h4>
                            <input
                              type="text"
                              placeholder="Poll Question"
                              value={newQuestion}
                              onChange={(e) => setNewQuestion(e.target.value)}
                              className="w-full bg-white text-xs border border-gray-200 rounded-xl p-2.5 outline-none focus:border-purple-600"
                            />
                            {newOptions.map((opt, i) => (
                              <input
                                key={i}
                                type="text"
                                placeholder={`Option ${i + 1}`}
                                value={opt}
                                onChange={(e) => {
                                  const updated = [...newOptions];
                                  updated[i] = e.target.value;
                                  setNewOptions(updated);
                                }}
                                className="w-full bg-white text-xs border border-gray-200 rounded-xl p-2.5 outline-none focus:border-purple-600"
                              />
                            ))}
                            <button
                              type="button"
                              onClick={() => setNewOptions([...newOptions, ""])}
                              className="text-[11px] text-purple-700 font-bold hover:underline cursor-pointer"
                            >
                              + Add Option
                            </button>
                            <button
                              type="submit"
                              className="w-full bg-purple-700 text-white font-extrabold text-xs py-2.5 rounded-2xl transition cursor-pointer mt-2"
                            >
                              Launch Poll
                            </button>
                          </form>
                        ) : (
                          <div className="flex flex-col items-center justify-center flex-1 text-center text-gray-400 text-xs">
                            <p>No active poll at the moment.</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* EXIT MODAL */}
          {showExitModal && (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl space-y-4">
                <h3 className="text-base font-extrabold text-gray-900">Are you sure you want to leave?</h3>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      setShowExitModal(false);
                      leaveSession();
                    }}
                    className="px-4 py-2 border-2 border-purple-700 text-purple-700 text-xs font-bold rounded-2xl cursor-pointer"
                  >
                    Yes, leave
                  </button>
                  <button
                    onClick={() => setShowExitModal(false)}
                    className="px-4 py-2 bg-purple-700 text-white text-xs font-bold rounded-2xl cursor-pointer"
                  >
                    Continue watching
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ENTRY CARD VIEW */
        <div className="w-full flex flex-col items-start">
          <div className="w-full max-w-4xl flex items-center justify-between mb-4">
            <h2 className="text-xl font-extrabold text-[#632200]">
              Live session
            </h2>
            {currentUser.role === "Presenter" && (
              <button
                onClick={() => setShowCreateSessionModal(true)}
                className="bg-[#6F219E] hover:bg-purple-900 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer"
              >
                + Register YouTube Session
              </button>
            )}
          </div>

          <div className="w-full max-w-4xl bg-[#F8F5FB] rounded-3xl p-8 flex flex-col justify-between shadow-md border border-purple-100">
            <div>
              <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
                <div className="flex items-center space-x-2.5">
                  <span className="text-base font-extrabold text-gray-800">
                    {currentSession?.status === "live"
                      ? "🔴 Live now"
                      : currentSession?.status === "scheduled"
                      ? "🗓 Scheduled session"
                      : "Live session"}
                  </span>
                </div>

                <span className="text-xs md:text-sm text-gray-700 bg-[#FFF5E1] px-4 py-1.5 rounded-full font-bold shadow-2xs">
                  ⏱ Every Monday and Thursday
                </span>
              </div>

              <div className="relative w-full h-64 md:h-80 mb-6 rounded-2xl overflow-hidden bg-amber-100 shadow-inner">
                <Image
                  src="/journal-book/logo.svg"
                  alt="Live lesson"
                  fill
                  className="object-cover"
                />
              </div>

              <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3">
                {currentSession?.title || "Live lesson"}
              </h3>
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-8 font-medium">
                Join us every Monday and Thursday for live music lessons, learning, and fun. Tune in and keep growing your musical skills!
              </p>

              {error && (
                <div className="mb-4 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
                  {error}
                </div>
              )}
            </div>

            <div>
              <button
                disabled={isLoadingSession || isJoining || !currentSession}
                onClick={() => currentSession && joinSession(currentSession.id)}
                className="w-full bg-[#6F219E] hover:bg-purple-800 disabled:opacity-50 text-white font-extrabold text-base py-4 px-8 rounded-2xl transition cursor-pointer shadow-md"
              >
                {isLoadingSession
                  ? "Checking session..."
                  : isJoining
                  ? "Joining..."
                  : currentSession
                  ? "Join session"
                  : "No active session right now"}
              </button>
            </div>
          </div>

          {/* HOST REGISTER YOUTUBE SESSION MODAL */}
          {showCreateSessionModal && (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
              <form
                onSubmit={handleCreateSessionSubmit}
                className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4"
              >
                <h3 className="text-lg font-extrabold text-gray-900">
                  Register YouTube Live Session
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      YouTube Video ID
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. dQw4w9WgXcQ"
                      value={newVideoId}
                      onChange={(e) => setNewVideoId(e.target.value)}
                      className="w-full text-xs border border-gray-300 rounded-xl p-2.5 outline-none focus:border-purple-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Lesson Title (optional)
                    </label>
                    <input
                      type="text"
                      placeholder="Monday Live Music Lesson"
                      value={newSessionTitle}
                      onChange={(e) => setNewSessionTitle(e.target.value)}
                      className="w-full text-xs border border-gray-300 rounded-xl p-2.5 outline-none focus:border-purple-600"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateSessionModal(false)}
                    className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-900 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#6F219E] text-white text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Create Session
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}