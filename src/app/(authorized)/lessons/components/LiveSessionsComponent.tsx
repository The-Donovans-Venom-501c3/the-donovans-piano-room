"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";

interface LiveSessionsComponentProps {
  currentUser?: {
    id: string;
    name: string;
    role: "Presenter" | "Participant";
    pronouns?: string;
  };
  youtubeVideoId?: string;
  youtubeChannelId?: string;
  apiKey?: string;
  searchQuery?: string; // <-- Added searchQuery to interface
}

type SidePanelTab = "people" | "chat" | "react" | "poll" | null;

interface FloatingReaction {
  id: number;
  emoji: string;
  leftPercent: number;
}

interface Message {
  id: number;
  name: string;
  pronouns?: string;
  text: string;
  time: string;
  avatarBg: string;
}

interface Participant {
  id: string;
  name: string;
  role: string;
}

interface Poll {
  question: string;
  options: string[];
}

const STORAGE_KEY = "tdv_live_chat_messages";

export default function LiveSessionsComponent({
  currentUser = { id: "user-1", name: "You", role: "Participant", pronouns: "She / Her / Hers" },
  youtubeVideoId,
  youtubeChannelId = "UCHaJE4kPmB9jqlUbbi-sHXA",
  apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY,
  searchQuery, // <-- Destructured searchQuery prop
}: LiveSessionsComponentProps) {
  const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@TDV501C3";

  const [isLiveOnYouTube, setIsLiveOnYouTube] = useState<boolean>(false);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(youtubeVideoId || null);

  const [isJoined, setIsJoined] = useState(false);
  const [activePanel, setActivePanel] = useState<SidePanelTab>(null);
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [chatMessage, setChatMessage] = useState("");

  // DYNAMIC PARTICIPANTS LIST (Starts with current user only)
  const [participants, setParticipants] = useState<Participant[]>([]);

  // REAL CHAT MESSAGES (Starts completely empty)
  const [messages, setMessages] = useState<Message[]>([]);

  // POLL STATE
  const [activePoll, setActivePoll] = useState<Poll | null>(null);
  const [newQuestion, setNewQuestion] = useState("");
  const [newOptions, setNewOptions] = useState(["", ""]);
  const [pollSelected, setPollSelected] = useState<string | null>(null);
  const [pollSubmitted, setPollSubmitted] = useState(false);

  const [floatingReactions, setFloatingReactions] = useState<FloatingReaction[]>([]);

  // UPDATE PARTICIPANTS WHEN USER JOINS SESSION
  useEffect(() => {
    if (isJoined) {
      setParticipants([
        { id: currentUser.id, name: currentUser.name, role: currentUser.role }
      ]);
    } else {
      setParticipants([]);
    }
  }, [isJoined, currentUser]);

  // CHECK YOUTUBE LIVE STATUS
  const checkYouTubeLiveStatus = useCallback(async () => {
    if (!apiKey) {
      setIsLiveOnYouTube(false);
      return;
    }

    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${youtubeChannelId}&type=video&eventType=live&key=${apiKey}`
      );
      const data = await res.json();

      if (data.items && data.items.length > 0) {
        setActiveVideoId(data.items[0].id.videoId);
        setIsLiveOnYouTube(true);
      } else {
        setIsLiveOnYouTube(false);
      }
    } catch (err) {
      console.error("Error checking YouTube stream:", err);
      setIsLiveOnYouTube(false);
    }
  }, [apiKey, youtubeChannelId]);

  useEffect(() => {
    checkYouTubeLiveStatus();
    const interval = setInterval(checkYouTubeLiveStatus, 20000);
    return () => clearInterval(interval);
  }, [checkYouTubeLiveStatus]);

  const embedUrl = useMemo(() => {
    if (activeVideoId) {
      return `https://www.youtube.com/embed/${activeVideoId}?autoplay=1&enablejsapi=1`;
    }
    return `https://www.youtube.com/embed/live_stream?channel=${youtubeChannelId}&autoplay=1`;
  }, [activeVideoId, youtubeChannelId]);

  const triggerReaction = (emoji: string) => {
    const newId = Date.now() + Math.random();
    const randomLeft = Math.floor(Math.random() * 70) + 15;

    setFloatingReactions((prev) => [
      ...prev,
      { id: newId, emoji, leftPercent: randomLeft },
    ]);

    setTimeout(() => {
      setFloatingReactions((prev) => prev.filter((item) => item.id !== newId));
    }, 2000);
  };

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

    const newMsg: Message = {
      id: Date.now(),
      name: currentUser.name,
      pronouns: currentUser.pronouns,
      text: chatMessage,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      avatarBg: "bg-purple-700",
    };

    setMessages((prev) => [...prev, newMsg]);
    setChatMessage("");
  };

  // PRESENTER CREATES POLL
  const handleCreatePoll = (e: React.FormEvent) => {
    e.preventDefault();
    const validOptions = newOptions.filter((opt) => opt.trim() !== "");
    if (!newQuestion.trim() || validOptions.length < 2) return;

    setActivePoll({
      question: newQuestion,
      options: validOptions,
    });
    setPollSubmitted(false);
    setPollSelected(null);
  };

  return (
    <div className="w-full flex flex-col justify-start items-start">
      {isJoined ? (
        <div className="w-full flex flex-col">
          {/* HEADER WITH PROMINENT BACK BUTTON */}
          <div className="w-full flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsJoined(false)}
                className="inline-flex items-center gap-2 bg-[#6F219E] hover:bg-purple-900 text-white text-sm font-bold px-4 py-2 rounded-xl transition cursor-pointer shadow-sm active:scale-95"
              >
                <span>❮</span> Back
              </button>
              <h2 className="text-xl md:text-2xl font-extrabold text-[#632200]">
                Live session
              </h2>
            </div>

            {isLiveOnYouTube && (
              <div className="flex items-center space-x-2 text-rose-500 font-extrabold text-sm">
                <span className="w-3 h-3 bg-rose-500 rounded-full animate-pulse" />
                <span>Session in progress</span>
              </div>
            )}
          </div>

          <div className="w-full flex flex-col lg:flex-row gap-4 items-end lg:items-stretch h-[calc(100vh-290px)] max-h-[520px] min-h-[420px] relative">
            {/* VIDEO PLAYER CONTAINER */}
            <div className="relative flex-1 w-full bg-black rounded-3xl overflow-hidden shadow-xl h-full">
              <iframe
                src={embedUrl}
                title="Live Stream"
                className="absolute top-0 left-0 w-full h-full object-cover"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />

              {/* OFFLINE BANNER AT BOTTOM LEFT */}
              {!isLiveOnYouTube && (
                <a
                  href={YOUTUBE_CHANNEL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-6 left-6 z-30 bg-[#14181B]/90 hover:bg-[#14181B] text-white px-4 py-2.5 rounded-2xl flex items-center gap-3 backdrop-blur-md transition border border-white/10 shadow-xl group"
                >
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gray-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-gray-500"></span>
                  </span>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-200">
                      Live stream offline
                    </span>
                    <svg className="w-4 h-4 fill-red-500 group-hover:scale-110 transition" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </div>
                </a>
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
                    className={`px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 transition ${
                      activePanel === "people" ? "bg-purple-600 text-white" : "bg-[#41285E]/90 text-white hover:bg-purple-800"
                    }`}
                  >
                    <span>👥</span> People
                  </button>
                  <button
                    onClick={() => handlePanelOpen("chat")}
                    className={`px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 transition ${
                      activePanel === "chat" ? "bg-purple-600 text-white" : "bg-[#41285E]/90 text-white hover:bg-purple-800"
                    }`}
                  >
                    <span>💬</span> Chat
                  </button>
                  <button
                    onClick={() => handlePanelOpen("react")}
                    className={`px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 transition ${
                      activePanel === "react" ? "bg-purple-600 text-white" : "bg-[#41285E]/90 text-white hover:bg-purple-800"
                    }`}
                  >
                    <span>❤️</span> React
                  </button>
                  <button
                    onClick={() => handlePanelOpen("poll")}
                    className={`px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 transition ${
                      activePanel === "poll" ? "bg-purple-600 text-white" : "bg-[#41285E]/90 text-white hover:bg-purple-800"
                    }`}
                  >
                    <span>📊</span> Poll
                  </button>
                  <button
                    onClick={() => setShowExitModal(true)}
                    className="bg-[#E65100] hover:bg-orange-600 text-white p-2 rounded-xl transition text-sm font-bold flex items-center justify-center"
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

                    {/* DYNAMIC CHAT */}
                    {activePanel === "chat" && (
                      <div className="flex-1 flex flex-col justify-between my-1 overflow-hidden">
                        <div className="overflow-y-auto space-y-3 flex-1 pr-1 py-1">
                          {messages.length === 0 ? (
                            <p className="text-center text-xs text-gray-400 my-auto">No messages yet. Say hello!</p>
                          ) : (
                            messages.map((m) => (
                              <div key={m.id} className="bg-white rounded-2xl p-3 shadow-2xs border border-purple-50/80">
                                <div className="flex items-start space-x-2.5 mb-1.5">
                                  <div className={`w-8 h-8 rounded-full ${m.avatarBg} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                                    {m.name[0]}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                      <h4 className="font-extrabold text-xs text-[#3B1700] truncate">{m.name}</h4>
                                      <span className="text-[9px] text-gray-400">{m.time}</span>
                                    </div>
                                    {m.pronouns && <p className="text-[10px] text-gray-500 font-medium">{m.pronouns}</p>}
                                  </div>
                                </div>
                                <p className="text-xs text-gray-700 font-medium pl-1">{m.text}</p>
                              </div>
                            ))
                          )}
                        </div>
                        <form onSubmit={handleSendMessage} className="relative mt-2 shrink-0">
                          <input
                            type="text"
                            placeholder="Send a message"
                            value={chatMessage}
                            onChange={(e) => setChatMessage(e.target.value)}
                            className="w-full bg-[#FFF9EE] text-xs text-gray-800 border border-[#EADBCE] rounded-2xl pl-4 pr-10 py-3 outline-none focus:border-purple-600 font-medium"
                          />
                        </form>
                      </div>
                    )}

                    {/* DYNAMIC PARTICIPANTS */}
                    {activePanel === "people" && (
                      <div className="flex-1 overflow-y-auto my-2 space-y-2 pr-1">
                        {participants.map((user) => (
                          <div key={user.id} className="flex items-center space-x-3 text-sm p-2 bg-white rounded-2xl border border-purple-50">
                            <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center font-extrabold text-purple-800 text-xs">
                              {user.name[0]}
                            </div>
                            <div>
                              <p className="font-bold text-gray-800 text-xs">{user.name}</p>
                              <p className="text-[10px] text-gray-500">{user.role}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* REACTIONS */}
                    {activePanel === "react" && (
                      <div className="flex-1 flex items-center justify-center py-4">
                        <div className="grid grid-cols-3 gap-3 text-3xl bg-white p-4 rounded-3xl w-full text-center border border-purple-50">
                          {["❤️", "👍", "👏", "🎉", "🔥", "😮"].map((emoji, idx) => (
                            <button key={idx} onClick={() => triggerReaction(emoji)} className="p-2 hover:scale-125 transition transform active:scale-95 cursor-pointer">
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* POLL (PRESENTER CREATES / PARTICIPANT ANSWERS) */}
                    {activePanel === "poll" && (
                      <div className="flex-1 my-2 flex flex-col justify-between overflow-y-auto">
                        {currentUser.role === "Presenter" ? (
                          /* PRESENTER FORM TO CREATE POLL */
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
                              className="text-[11px] text-purple-700 font-bold hover:underline"
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
                        ) : activePoll ? (
                          /* PARTICIPANT POLL ANSWER VIEW */
                          !pollSubmitted ? (
                            <div className="space-y-2 flex-1 flex flex-col justify-between">
                              <div className="space-y-2">
                                <p className="font-extrabold text-gray-800 text-xs mb-2">{activePoll.question}</p>
                                {activePoll.options.map((opt, i) => (
                                  <button
                                    key={i}
                                    onClick={() => setPollSelected(opt)}
                                    className={`w-full text-left p-2.5 rounded-2xl border text-xs font-semibold transition ${
                                      pollSelected === opt ? "border-purple-600 bg-purple-100 text-purple-900" : "border-gray-200 bg-white text-gray-800"
                                    }`}
                                  >
                                    {opt}
                                  </button>
                                ))}
                              </div>
                              <button
                                onClick={() => setPollSubmitted(true)}
                                disabled={!pollSelected}
                                className="w-full bg-purple-700 text-white font-extrabold text-xs py-2.5 rounded-2xl disabled:opacity-50 mt-2 transition cursor-pointer"
                              >
                                Submit Answer
                              </button>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center flex-1 text-center">
                              <span className="text-3xl mb-1">✅</span>
                              <p className="font-bold text-gray-800 text-xs">Answer submitted!</p>
                            </div>
                          )
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
                  <button onClick={() => { setShowExitModal(false); setIsJoined(false); }} className="px-4 py-2 border-2 border-purple-700 text-purple-700 text-xs font-bold rounded-2xl">
                    Yes, leave
                  </button>
                  <button onClick={() => setShowExitModal(false)} className="px-4 py-2 bg-purple-700 text-white text-xs font-bold rounded-2xl">
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
          <h2 className="text-xl font-extrabold text-[#632200] mb-4">
            Live session
          </h2>

          <div className="w-full max-w-4xl bg-white rounded-3xl p-8 flex flex-col justify-between shadow-md border border-gray-100">
            <div>
              <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
                <div className="flex items-center space-x-2.5">
                  <span className="w-4 h-4 rounded-full bg-rose-500 animate-pulse" />
                  <span className="text-base font-extrabold text-gray-800">
                    Live session
                  </span>
                </div>

                <span className="text-xs md:text-sm text-gray-700 bg-[#FFF5E1] px-4 py-1.5 rounded-full font-bold shadow-2xs">
                  ⏱ Every Monday and Thursday
                </span>
              </div>

              <div className="relative w-full h-64 md:h-80 mb-6 rounded-2xl overflow-hidden bg-amber-100 shadow-inner">
                <Image
                  src="/journal-book/logo.svg"
                  alt="Lesson 2 - The eighth note"
                  fill
                  className="object-cover"
                />
              </div>

              <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3">
                Lesson 2 - The eighth note
              </h3>
              <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-8 font-medium">
                Donec sed tortor ut justo consectetur venenatis. Curabitur sed enim in diam porta congue.
              </p>
            </div>

            <div>
              <button
                onClick={() => setIsJoined(true)}
                className="w-full bg-[#6F219E] hover:bg-purple-800 text-white font-extrabold text-base py-4 px-8 rounded-2xl transition cursor-pointer shadow-md"
              >
                Join session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}