"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { type Lesson } from "./Lesson";

// Helper to convert "MM:SS" or "H:MM:SS" string into total seconds
const timeToSeconds = (timeStr: string): number => {
  if (!timeStr) return 0;
  const parts = timeStr.split(":").map(Number);
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return 0;
};

// Fallback transcript extracted outside component body to maintain static reference
const DEFAULT_TRANSCRIPT = [
  { timestamp: "0:03", text: "Welcome to The Donovan's Piano Room!" },
  { timestamp: "0:15", text: "In this video, we are going to dive into understanding the keyboard." },
  { timestamp: "0:45", text: "Notice how the black keys are arranged in groups of two and three." },
  { timestamp: "1:15", text: "Let's practice placing our fingers on the starting position." },
  { timestamp: "2:00", text: "Take your time with this exercise before moving to the next section." },
];

interface VideoDetailProps {
  lesson: Lesson;
  prevLesson: Lesson | null;
  nextLesson: Lesson | null;
  onBack: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function VideoDetail({
  lesson,
  prevLesson,
  nextLesson,
  onBack,
  onPrev,
  onNext,
}: VideoDetailProps) {
  // Set default to false so transcript opens ONLY on click
  const [showTranscript, setShowTranscript] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const playerRef = useRef<any>(null);
  const activeLineRef = useRef<HTMLDivElement | null>(null);

  const cleanYoutubeId = lesson.youtubeId ? lesson.youtubeId.split("?")[0] : "";

  // ✅ Wrap transcriptData in useMemo to stabilize reference for useEffect
  const transcriptData = useMemo(() => {
    return lesson.transcript && lesson.transcript.length > 0
      ? lesson.transcript
      : DEFAULT_TRANSCRIPT;
  }, [lesson.transcript]);

  // Initialize YouTube IFrame API and track playback time
  useEffect(() => {
    if (!cleanYoutubeId) return;

    // Load API Script if not present
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    const initPlayer = () => {
      playerRef.current = new window.YT.Player(`youtube-player-${cleanYoutubeId}`, {
        videoId: cleanYoutubeId,
        playerVars: {
          autoplay: 1,
          rel: 0,
          modestbranding: 1,
        },
      });
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    // Polling player time every 250ms
    const interval = setInterval(() => {
      if (playerRef.current && typeof playerRef.current.getCurrentTime === "function") {
        setCurrentTime(playerRef.current.getCurrentTime());
      }
    }, 250);

    return () => {
      clearInterval(interval);
      if (playerRef.current && typeof playerRef.current.destroy === "function") {
        playerRef.current.destroy();
      }
    };
  }, [cleanYoutubeId]);

  // Sync current video time with active transcript line & auto-scroll
  useEffect(() => {
    if (!transcriptData.length) return;

    let currentIdx = -1;
    for (let i = 0; i < transcriptData.length; i++) {
      const itemSeconds = timeToSeconds(transcriptData[i].timestamp);
      if (currentTime >= itemSeconds) {
        currentIdx = i;
      } else {
        break;
      }
    }

    if (currentIdx !== activeIndex) {
      setActiveIndex(currentIdx);
      if (activeLineRef.current) {
        activeLineRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [currentTime, transcriptData, activeIndex]);

  // Jump video to time on click
  const handleSeek = (timestamp: string) => {
    const seconds = timeToSeconds(timestamp);
    if (playerRef.current && typeof playerRef.current.seekTo === "function") {
      playerRef.current.seekTo(seconds, true);
    }
  };

  return (
    <div
      className={`w-full mx-auto flex flex-col gap-5 pt-1 transition-all duration-300 ${
        showTranscript ? "max-w-[1180px]" : "max-w-[900px]"
      }`}
    >
      {/* Sub-Header Navigation Row */}
      <div className="w-full flex items-center justify-between text-[#6F219E] px-1">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="hover:underline flex items-center gap-2 cursor-pointer shrink-0 text-base md:text-lg font-bold text-[#6F219E]"
        >
          <span className="text-lg md:text-xl">←</span> All videos
        </button>

        {/* Center Lesson Title Pagination */}
        <div className="flex items-center gap-3 text-[#3F3B3C]">
          <button
            onClick={onPrev}
            disabled={!prevLesson}
            className={`text-[#6F219E] text-2xl font-bold cursor-pointer transition-opacity ${
              !prevLesson ? "opacity-30 cursor-not-allowed" : "hover:opacity-80"
            }`}
          >
            ‹
          </button>

          <span className="font-extrabold text-base md:text-lg text-[#3F3B3C] text-center">
            {lesson.title}
          </span>

          <button
            onClick={onNext}
            disabled={!nextLesson}
            className={`text-[#6F219E] text-2xl font-bold cursor-pointer transition-opacity ${
              !nextLesson ? "opacity-30 cursor-not-allowed" : "hover:opacity-80"
            }`}
          >
            ›
          </button>
        </div>

        {/* Transcript Toggle Button */}
        <button
          onClick={() => setShowTranscript((prev) => !prev)}
          className="flex items-center gap-2 cursor-pointer group shrink-0"
        >
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
              showTranscript
                ? "bg-[#6F219E] text-white"
                : "bg-[#EAE0FB] text-[#6F219E] group-hover:bg-[#6F219E] group-hover:text-white"
            }`}
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="4" y="4" width="16" height="16" rx="2" />
              <line x1="8" y1="8" x2="16" y2="8" />
              <line x1="8" y1="12" x2="16" y2="12" />
              <line x1="8" y1="16" x2="12" y2="16" />
            </svg>
          </div>
          <span className="text-[#6F219E] font-extrabold text-base md:text-lg">
            Transcript
          </span>
        </button>
      </div>

      {/* Main Video & Transcript Container */}
      <div className="flex flex-col lg:flex-row gap-6 w-full items-start justify-center">
        {/* Left Column: Video Container */}
        <div
          className={`transition-all duration-300 w-full ${
            showTranscript ? "lg:w-[64%]" : "lg:w-full"
          }`}
        >
          {/* Framed Video Player Container */}
          <div className="relative w-full aspect-video rounded-[20px] overflow-hidden bg-black shadow-xs border border-[#ECD6FE]/40">
            {cleanYoutubeId ? (
              <div id={`youtube-player-${cleanYoutubeId}`} className="w-full h-full" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white text-base font-medium">
                No video source available
              </div>
            )}
          </div>

          {/* Lesson Info */}
          <div className="mt-4 flex flex-col gap-2 px-1">
            <div className="flex items-center justify-between gap-4">
              <h1 className="text-xl md:text-2xl font-extrabold text-[#3F3B3C]">
                {lesson.title}
              </h1>
              <div className="text-base md:text-lg text-[#7A6E82] font-bold shrink-0">
                {lesson.duration || "12 mins"}
              </div>
            </div>

            {lesson.description && (
              <p className="text-base text-[#7A6E82] font-medium leading-relaxed">
                {lesson.description}
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Figma Styled Transcript Panel */}
        {showTranscript && (
          <div className="w-full lg:w-[360px] xl:w-[380px] bg-[#F7EEFE] border-2 border-white rounded-[24px] p-5 h-[480px] flex flex-col shrink-0 shadow-sm">
            {/* Transcript Drawer Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#6F219E]/10">
              <h3 className="font-bold text-xl text-[#4A1D24]">
                Video transcript
              </h3>
              <button
                onClick={() => setShowTranscript(false)}
                className="text-[#6F219E] hover:opacity-70 text-lg font-bold cursor-pointer transition-opacity"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Transcript List */}
            <div className="flex-1 overflow-y-auto mt-3 pr-2 space-y-3 text-base text-[#3F3B3C] leading-relaxed custom-scrollbar">
              {transcriptData.map((item, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <div
                    key={idx}
                    ref={isActive ? activeLineRef : null}
                    onClick={() => handleSeek(item.timestamp)}
                    className={`flex gap-3 items-start p-2.5 rounded-xl cursor-pointer transition-all ${
                      isActive
                        ? "bg-[#6F219E]/10 border-l-4 border-[#6F219E]"
                        : "hover:bg-white/50"
                    }`}
                  >
                    <span className="shrink-0 min-w-[42px] text-sm md:text-base font-bold text-[#4A1D24]">
                      {item.timestamp}
                    </span>
                    <p className="text-sm md:text-base font-medium text-[#3F3B3C] leading-snug">
                      {item.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Global Declaration for TypeScript
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: any;
  }
}