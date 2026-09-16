"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import ShortPiano from "./components/ShortPiano";
import LongPiano from "./components/LongPiano";
import SwitchComponent from "./components/Switch";
import VolumeSlider from "./components/VolumeSlider";

export default function VirtualPiano() {
  const [isPiano, setIsPiano] = useState(true);
  const [volume, setVolume] = useState<number>(50);
  const [showNotes, setShowNotes] = useState(false);
  const [instrument, setInstrument] = useState("Electric Piano");
  const [isExpanded, setIsExpanded] = useState(false);
  const fullScreenRef = useRef<HTMLDivElement>(null);

  const toggleFullScreen = async (enable: boolean) => {
    setIsExpanded(enable);
    try {
      if (enable) {
        if (fullScreenRef.current?.requestFullscreen) {
          await fullScreenRef.current.requestFullscreen();
        }
      } else {
        if (document.fullscreenElement && document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch {
      // Browser fallback logic
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsExpanded(false);
      }
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  return (
    <div
      ref={fullScreenRef}
      className={`w-full flex flex-col items-center justify-start transition-all ${
        isExpanded
          ? "fixed inset-0 z-[9999] bg-[#5B0D86] h-screen w-screen p-0 overflow-hidden"
          : "px-2 md:px-6 py-4"
      }`}
    >
      {!isExpanded ? (
        /* STANDARD VIEW */
        <div className="w-full max-w-[1400px] mx-auto flex flex-col items-center">
          {/* Top Controls Bar */}
          <div className="relative flex flex-wrap items-center justify-between w-full mb-6 px-4 gap-4">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-gray-700 text-sm md:text-base">
                Show Note Names
              </span>
              <SwitchComponent
                label=""
                checked={showNotes}
                onChange={(e) => setShowNotes(Boolean(e.target.checked))}
              />
            </div>

            <div>
              <select
                value={instrument}
                onChange={(e) => setInstrument(e.target.value)}
                className="bg-[#6B109B] text-white px-5 py-2.5 rounded-2xl font-semibold cursor-pointer outline-none text-sm border-none shadow-sm"
              >
                <option value="Electric Piano">Electric Piano &#9660;</option>
                <option value="Acoustic Piano">Acoustic Piano &#9660;</option>
                <option value="Synth Piano">Synth Piano &#9660;</option>
              </select>
            </div>

            {/* Volume Control & Mascot Container */}
            <div className="relative flex items-center gap-3">
              <span className="font-semibold text-gray-700 text-sm md:text-base">Volume</span>
              <VolumeSlider volume={volume} setVolume={setVolume} />

            {/* MASCOT AVATAR */}
            <div
              className="absolute z-30 pointer-events-none select-none"
              style={{
                top: "10px",
                right: "-80px",
                width: "140px",
                height: "118px",
                transform: "rotate(35.4deg)",
              }}
            >
              <Image
                src="/auth/smilingcharacter.svg"
                alt="Mascot"
                width={140}
                height={118}
                className="w-full h-full object-contain"
                unoptimized
              />
            </div>
            </div>
          </div>

          {/* Main Card Container */}
          <div className="relative w-full bg-[#FAF8F5] rounded-3xl border border-gray-200 p-6 md:p-12 flex flex-col items-center shadow-sm">
            <div className="bg-[#FFE8C5] p-1.5 rounded-2xl flex items-center mb-8 gap-2 border border-[#F3C27E]">
              <button
                type="button"
                className={`px-8 py-3 rounded-xl text-base font-bold transition-all cursor-pointer ${
                  isPiano
                    ? "bg-[#F3C27E] text-gray-900 shadow-sm"
                    : "text-gray-700 hover:text-black"
                }`}
                onClick={() => setIsPiano(true)}
              >
                Short Piano
              </button>
              <button
                type="button"
                className={`px-8 py-3 rounded-xl text-base font-bold transition-all cursor-pointer ${
                  !isPiano
                    ? "bg-[#F3C27E] text-gray-900 shadow-sm"
                    : "text-gray-700 hover:text-black"
                }`}
                onClick={() => setIsPiano(false)}
              >
                Long Piano
              </button>
            </div>

            {/* Piano Keyboard Wrapper */}
            <div className="w-full flex justify-center items-center py-4">
              {isPiano ? (
                <ShortPiano
                  volume={volume}
                  showNotes={showNotes}
                  instrument={instrument}
                />
              ) : (
                <LongPiano
                  volume={volume}
                  showNotes={showNotes}
                  instrument={instrument}
                />
              )}
            </div>

            {/* Expand Button */}
            <button
              type="button"
              onClick={() => toggleFullScreen(true)}
              className="mt-8 flex items-center gap-2 px-8 py-3 rounded-full border border-purple-300 bg-white text-[#6B109B] font-bold text-base shadow-sm hover:bg-purple-50 transition-all cursor-pointer"
            >
              Expand &#8599;
            </button>
          </div>
        </div>
      ) : (
        /* FULL SCREEN OVERLAY VIEW */
        <div className="w-full h-full flex flex-col items-center justify-between bg-[#5B0D86] p-4 md:p-6">
          {/* Prominent Header Controls Bar */}
          <div className="w-full max-w-[1800px] px-8 py-5 bg-black/30 backdrop-blur-lg flex items-center justify-between border border-white/15 rounded-2xl shrink-0 gap-6">
            <div className="flex items-center">
              <Image
                src="/navbar/Logo2.svg"
                alt="The Donovan's Piano Room"
                width={240}
                height={55}
                className="h-10 md:h-12 w-auto object-contain"
                priority
              />
            </div>

            <div className="flex items-center gap-8">
              {/* Dropdown Selector */}
              <select
                value={instrument}
                onChange={(e) => setInstrument(e.target.value)}
                className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-bold cursor-pointer outline-none text-base border border-white/25 transition-all"
              >
                <option value="Electric Piano" className="bg-[#6B109B] text-white">Electric Piano</option>
                <option value="Acoustic Piano" className="bg-[#6B109B] text-white">Acoustic Piano</option>
                <option value="Synth Piano" className="bg-[#6B109B] text-white">Synth Piano</option>
              </select>

              {/* Toggle Note Names */}
              <div className="flex items-center gap-3">
                <span className="text-white font-semibold text-base md:text-lg">Note Names</span>
                <SwitchComponent
                  label=""
                  checked={showNotes}
                  onChange={(e) => setShowNotes(Boolean(e.target.checked))}
                />
              </div>

              {/* Volume Slider */}
              <div className="scale-110 flex items-center">
                <VolumeSlider volume={volume} setVolume={setVolume} lightMode={true} />
              </div>

              {/* Exit Button */}
              <button
                type="button"
                onClick={() => toggleFullScreen(false)}
                className="text-white bg-white/15 hover:bg-white/25 px-5 py-2.5 rounded-xl text-base font-bold cursor-pointer transition-all flex items-center gap-2 border border-white/20 shadow-md"
                aria-label="Exit full screen view"
              >
                Exit <span>&#8600;</span>
              </button>
            </div>
          </div>

          {/* Full-Height Scaled Piano Workspace */}
          <div className="w-full flex-1 flex justify-center items-center py-4 overflow-x-auto">
            {isPiano ? (
              <ShortPiano
                volume={volume}
                showNotes={showNotes}
                instrument={instrument}
                isOverlay
              />
            ) : (
              <LongPiano
                volume={volume}
                showNotes={showNotes}
                instrument={instrument}
                isOverlay
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}