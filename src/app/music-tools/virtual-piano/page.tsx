'use client';
import React, { useState } from "react";
import Image from "next/image";
import ShortPiano from './components/ShortPiano';
import LongPiano from './components/LongPiano';
import SwitchComponent from "./components/Switch";
import VolumeSlider from "./components/VolumeSlider";

export default function VirtualPiano() {
  const [isPiano, setIsPiano] = useState(true);
  const [volume, setVolume] = useState<number>(50);
  const [showNotes, setShowNotes] = useState(false);
  const [instrument, setInstrument] = useState("Electric Piano");
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center w-full px-2 md:px-6 py-4">
      {!isExpanded ? (
        /* STANDARD VIEW */
        <div className="w-full max-w-[1400px] mx-auto flex flex-col items-center">
          {/* Top Controls Bar */}
          <div className="flex flex-wrap items-center justify-between w-full mb-6 px-4 gap-4">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-gray-700 text-sm md:text-base">Show Note Names</span>
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
                className="bg-[#6B109B] text-white px-5 py-2.5 rounded-full font-semibold cursor-pointer outline-none text-sm"
              >
                <option value="Electric Piano">Electric Piano ▾</option>
                <option value="Acoustic Piano">Acoustic Piano ▾</option>
                <option value="Synth">Synth ▾</option>
              </select>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-3">
              <span className="font-semibold text-gray-700 text-sm md:text-base">Volume</span>
              <VolumeSlider volume={volume} setVolume={setVolume} />
            </div>
          </div>

          {/* Main Card Container */}
          <div className="relative w-full bg-[#FAF8F5] rounded-3xl border border-gray-200 p-6 md:p-12 flex flex-col items-center shadow-sm">
            <div className="bg-[#FFE8C5] p-1.5 rounded-2xl flex items-center mb-8 gap-2 border border-[#F3C27E]">
              <button
                type="button"
                className={`px-8 py-3 rounded-xl text-base font-bold transition-all cursor-pointer ${
                  isPiano ? "bg-[#F3C27E] text-gray-900 shadow-sm" : "text-gray-700 hover:text-black"
                }`}
                onClick={() => setIsPiano(true)}
              >
                Short Piano
              </button>
              <button
                type="button"
                className={`px-8 py-3 rounded-xl text-base font-bold transition-all cursor-pointer ${
                  !isPiano ? "bg-[#F3C27E] text-gray-900 shadow-sm" : "text-gray-700 hover:text-black"
                }`}
                onClick={() => setIsPiano(false)}
              >
                Long Piano
              </button>
            </div>

            {/* Piano Keyboard Wrapper */}
            <div className="w-full flex justify-center items-center py-4">
              {isPiano ? (
                <ShortPiano volume={volume} showNotes={showNotes} />
              ) : (
                <LongPiano volume={volume} showNotes={showNotes} />
              )}
            </div>

            {/* Expand Button */}
            <button 
              type="button"
              onClick={() => setIsExpanded(true)}
              className="mt-8 flex items-center gap-2 px-8 py-3 rounded-full border border-purple-300 bg-white text-[#6B109B] font-bold text-base shadow-sm hover:bg-purple-50 transition-all cursor-pointer"
            >
              Expand ↗
            </button>
          </div>
        </div>
      ) : (
        /* EXPANDED OVERLAY VIEW */
        <div className="w-full max-w-[1600px] bg-[#6B109B] rounded-3xl p-6 md:p-10 shadow-xl flex flex-col items-center relative transition-all">
          
          {/* Header Controls */}
          <div className="w-full flex flex-wrap items-center justify-between pb-6 border-b border-purple-400/30 gap-4">
            
            {/* Title / Logo */}
            <div className="flex items-center">
              <Image
                src="/navbar/Logo2.svg"
                alt="The Donovan's Piano Room"
                width={320}
                height={80}
                className="h-20 md:h-20 w-auto object-contain"
                priority
              />
            </div>

            {/* Instrument Selector */}
            <div className="flex items-center gap-2">
              {["Electric", "Acoustic", "Synth"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setInstrument(`${type} Piano`)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                    instrument.includes(type)
                      ? "bg-amber-400 text-purple-950 shadow-sm"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Toggle Note Names Button */}
            <button
              type="button"
              onClick={() => setShowNotes(!showNotes)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                showNotes 
                  ? "bg-amber-400 text-purple-950" 
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              C# Notes {showNotes ? "ON" : "OFF"}
            </button>

            {/* Volume Control & Collapse Button */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <VolumeSlider volume={volume} setVolume={setVolume} lightMode={true} />
              </div>

              <button 
                type="button"
                onClick={() => setIsExpanded(false)}
                className="text-white hover:text-amber-300 p-1 text-2xl font-bold cursor-pointer transition-transform hover:scale-110"
                aria-label="Collapse piano view"
              >
                ↘
              </button>
            </div>
          </div>

          {/* Expanded Piano Keyboard */}
          <div className="w-full flex justify-center items-center pt-8 pb-4">
            {isPiano ? (
              <ShortPiano volume={volume} showNotes={showNotes} isOverlay />
            ) : (
              <LongPiano volume={volume} showNotes={showNotes} isOverlay />
            )}
          </div>
        </div>
      )}
    </div>
  );
}