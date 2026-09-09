"use client";

import { useState } from "react";
import Slider from "@mui/material/Slider";

interface TempoSettingProps {
  tempoNum: number;
  setTempo: React.Dispatch<React.SetStateAction<number>>;
  beatsNum: number;
  setBeats: React.Dispatch<React.SetStateAction<number>>;
  accentedBeats: boolean[];
  setAccentedBeats: React.Dispatch<React.SetStateAction<boolean[]>>;
  animation: boolean;
  setAnimation: React.Dispatch<React.SetStateAction<boolean>>;
  soundType: string;
  setSoundType: (val: string) => void;
  volume: number;
  setVolume: (val: number) => void;
}

export default function TempoSetting({
  tempoNum,
  setTempo,
  beatsNum,
  setBeats,
  accentedBeats,
  setAccentedBeats,
  animation,
  setAnimation,
  soundType,
  setSoundType,
  volume,
  setVolume,
}: TempoSettingProps) {
  const [isSoundOpen, setIsSoundOpen] = useState(false);
  const [isTimeSigOpen, setIsTimeSigOpen] = useState(false);

  const soundOptions = ["Grand Piano", "Wood Block", "Electronic Click", "Drum"];

  const handleTimeSigSelect = (sig: string) => {
    let beats = 4;
    if (sig === "3/4") beats = 3;
    if (sig === "2/4") beats = 2;
    if (sig === "6/8") beats = 6;
    if (sig === "4/4") beats = 4;

    setBeats(beats);
    setAccentedBeats(new Array(beats).fill(false));
    setIsTimeSigOpen(false);
  };

  const toggleAccent = (index: number) => {
    setAccentedBeats((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  return (
    <div className="bg-[#FCF0D8]/60 p-5 rounded-[24px] border border-[#ED9E4A] border-[0.4px] w-[420px] h-[430px] flex flex-col justify-between relative ml-auto self-start box-border shrink-0">
      {/* Tempo Header */}
      <div className="text-4xl font-black text-[#2D1B4E] tracking-tight leading-none">
        {tempoNum} BPM
      </div>

      {/* BPM Control */}
      <div className="space-y-1">
        <label className="text-base font-black text-[#3B3349]">BPM</label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setTempo((prev) => Math.max(25, prev - 1))}
            className="w-7 h-7 rounded-full bg-[#6B109B] text-white font-extrabold text-base flex items-center justify-center hover:bg-[#520B78] transition-all cursor-pointer shrink-0"
          >
            -
          </button>
          <Slider
            min={25}
            max={200}
            value={tempoNum}
            onChange={(_, val) => setTempo(val as number)}
            sx={{
              color: "#6B109B",
              height: 7,
              "& .MuiSlider-track": {
                backgroundColor: "#6B109B",
                border: "none",
                borderRadius: 4,
              },
              "& .MuiSlider-thumb": {
                width: 30,
                height: 38,
                borderRadius: "12px",
                backgroundColor: "#D6C3FA",
                border: "none",
                boxShadow: "none",
              },
              "& .MuiSlider-rail": {
                backgroundColor: "#EAE0FC",
                opacity: 1,
                borderRadius: 4,
              },
            }}
          />
          <button
            type="button"
            onClick={() => setTempo((prev) => Math.min(200, prev + 1))}
            className="w-7 h-7 rounded-full bg-[#6B109B] text-white font-extrabold text-base flex items-center justify-center hover:bg-[#520B78] transition-all cursor-pointer shrink-0"
          >
            +
          </button>
        </div>
      </div>

      {/* Volume Control */}
      <div className="space-y-1">
        <label className="text-base font-black text-[#3B3349]">Volume</label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setVolume(Math.max(0, volume - 1))}
            className="w-7 h-7 rounded-full bg-[#6B109B] text-white font-extrabold text-base flex items-center justify-center hover:bg-[#520B78] transition-all cursor-pointer shrink-0"
          >
            -
          </button>
          <Slider
            min={0}
            max={10}
            value={volume}
            onChange={(_, val) => setVolume(val as number)}
            sx={{
              color: "#6B109B",
              height: 7,
              "& .MuiSlider-track": {
                backgroundColor: "#6B109B",
                border: "none",
                borderRadius: 4,
              },
              "& .MuiSlider-thumb": {
                width: 30,
                height: 38,
                borderRadius: "12px",
                backgroundColor: "#D6C3FA",
                border: "none",
                boxShadow: "none",
              },
              "& .MuiSlider-rail": {
                backgroundColor: "#EAE0FC",
                opacity: 1,
                borderRadius: 4,
              },
            }}
          />
          <button
            type="button"
            onClick={() => setVolume(Math.min(10, volume + 1))}
            className="w-7 h-7 rounded-full bg-[#6B109B] text-white font-extrabold text-base flex items-center justify-center hover:bg-[#520B78] transition-all cursor-pointer shrink-0"
          >
            +
          </button>
        </div>
      </div>

      {/* Sound Dropdown */}
      <div className="flex items-center justify-between relative z-30">
        <span className="text-base font-black text-[#3B3349]">Sound</span>
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setIsSoundOpen(!isSoundOpen);
              setIsTimeSigOpen(false);
            }}
            className="bg-[#6B109B] text-white px-5 py-2 rounded-2xl text-base font-black flex items-center justify-between gap-4 min-w-[150px] cursor-pointer hover:bg-[#520B78] transition-all"
          >
            <span>{soundType}</span>
            <span className="text-xs">{isSoundOpen ? "▲" : "▼"}</span>
          </button>

          {isSoundOpen && (
            <div className="absolute right-0 top-full mt-1 w-full bg-white border border-[#E2CCF6] rounded-2xl shadow-xl z-50 overflow-hidden divide-y divide-[#F0E6FA]">
              {soundOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    setSoundType(opt);
                    setIsSoundOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-base text-[#2D1B4E] hover:bg-[#F3EBF9] font-black cursor-pointer"
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Time Signature Dropdown */}
      <div className="flex items-center justify-between relative z-20">
        <span className="text-base font-black text-[#3B3349]">Time Signature</span>
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setIsTimeSigOpen(!isTimeSigOpen);
              setIsSoundOpen(false);
            }}
            className="bg-[#6B109B] text-white px-5 py-2 rounded-2xl text-base font-black flex items-center justify-between gap-4 min-w-[110px] cursor-pointer hover:bg-[#520B78] transition-all"
          >
            <span>{beatsNum === 6 ? "6/8" : `${beatsNum}/4`}</span>
            <span className="text-xs">{isTimeSigOpen ? "▲" : "▼"}</span>
          </button>

          {isTimeSigOpen && (
            <div className="absolute right-0 top-full mt-1 w-full bg-white border border-[#E2CCF6] rounded-2xl shadow-xl z-50 overflow-hidden divide-y divide-[#F0E6FA]">
              {["4/4", "3/4", "2/4", "6/8"].map((sig) => (
                <button
                  key={sig}
                  type="button"
                  onClick={() => handleTimeSigSelect(sig)}
                  className="w-full text-center px-4 py-2 text-base text-[#2D1B4E] hover:bg-[#F3EBF9] font-black cursor-pointer"
                >
                  {sig}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Accent Beats Checkboxes */}
      <div className="flex items-center justify-between relative z-10">
        <span className="text-base font-black text-[#3B3349]">Accent Beats</span>
        <div className="flex items-center gap-2">
          {Array.from({ length: beatsNum }, (_, idx) => {
            const isChecked = !!accentedBeats[idx];
            return (
              <button
                key={idx}
                type="button"
                onClick={() => toggleAccent(idx)}
                className={`w-6 h-6 rounded-md flex items-center justify-center border-2 transition-all cursor-pointer ${
                  isChecked
                    ? "bg-[#6B109B] border-[#6B109B] text-white"
                    : "border-[#6B109B] bg-white hover:bg-purple-50"
                }`}
              >
                {isChecked && (
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Play Button */}
      <div className="flex justify-center relative z-10">
        <button
          type="button"
          onClick={() => setAnimation(!animation)}
          className="bg-[#6B109B] hover:bg-[#520B78] text-white px-10 py-2.5 rounded-full font-black text-lg flex items-center gap-2.5 transition-all active:scale-95 cursor-pointer shadow-md"
        >
          {animation ? "Pause ❚❚" : "Play ►"}
        </button>
      </div>
    </div>
  );
}