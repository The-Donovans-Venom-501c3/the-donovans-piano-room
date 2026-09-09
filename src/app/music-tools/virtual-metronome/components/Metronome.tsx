"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface MetronomeProps {
  beatsNum: number;
  tempoNum: number;
  accentedBeats: boolean[];
  animation: boolean;
  soundType: string;
  volume: number;
}

export default function Metronome({
  beatsNum,
  tempoNum,
  accentedBeats,
  animation,
  soundType,
  volume,
}: MetronomeProps) {
  const [animatedIndex, setAnimatedIndex] = useState<number>(0);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playSynthBeep = (isAccented: boolean, vol: number) => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        )();
      }

      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.frequency.setValueAtTime(isAccented ? 1050 : 750, ctx.currentTime);
      osc.type = "sine";

      const gainLevel = (vol / 10) * 0.5;
      gain.gain.setValueAtTime(gainLevel, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // AudioContext fallback
    }
  };

  useEffect(() => {
    if (!animation) {
      setAnimatedIndex(0);
      return;
    }

    let currentIndex = 0;

    const soundMap: Record<string, [string, string]> = {
      "Grand Piano": ["/sounds/Piano.wav", "/sounds/PianoEmp.wav"],
      "Wood Block": ["/sounds/Bongo.wav", "/sounds/BongoEmp.wav"],
      "Electronic Click": ["/sounds/Click.wav", "/sounds/ClickEmp.wav"],
      Drum: ["/sounds/Tambourine.wav", "/sounds/TambourineEmp.wav"],
    };

    const activePaths = soundMap[soundType] || soundMap["Grand Piano"];

    const audioNormal = new Audio(activePaths[0]);
    const audioAccented = new Audio(activePaths[1]);

    const playBeat = (index: number) => {
      setAnimatedIndex(index);
      const isAccented = !!accentedBeats[index];
      const targetAudio = isAccented ? audioAccented : audioNormal;

      if (volume > 0) {
        targetAudio.volume = volume / 10;
        targetAudio.currentTime = 0;

        targetAudio.play().catch(() => {
          playSynthBeep(isAccented, volume);
        });
      }
    };

    playBeat(0);
    currentIndex = 1 % beatsNum;

    const intervalTime = (60 / tempoNum) * 1000;
    const interval = setInterval(() => {
      playBeat(currentIndex);
      currentIndex = (currentIndex + 1) % beatsNum;
    }, intervalTime);

    return () => clearInterval(interval);
  }, [animation, beatsNum, tempoNum, accentedBeats, volume, soundType]);

  function getTempoMarking(tempo: number): string {
    if (tempo < 40) return "Grave";
    if (tempo < 60) return "Largo / Lento";
    if (tempo < 66) return "Larghetto";
    if (tempo < 76) return "Adagio";
    if (tempo < 108) return "Andante";
    if (tempo < 120) return "Moderato";
    if (tempo < 156) return "Allegro";
    if (tempo < 176) return "Vivace";
    if (tempo < 200) return "Presto";
    return "Prestissimo";
  }

  const beatIntervalSeconds = 60 / tempoNum;

  return (
    <div className="flex flex-col items-center justify-center relative w-[345.79px] h-[467px]">
      {/* Outer Metronome Body Container */}
      <div className="relative w-[345.79px] h-[410px] flex flex-col items-center overflow-visible">
        
        {/* Outer Body SVG Frame */}
        <svg
          className="absolute inset-0 w-full h-full drop-shadow-sm"
          viewBox="0 0 300 410"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 55 12 C 55 5, 60 0, 68 0 L 232 0 C 240 0, 245 5, 245 12 L 293 392 C 295 401, 289 408, 280 408 L 20 408 C 11 408, 5 401, 7 392 Z"
            fill="#DA9F00"
          />
        </svg>

        {/* Purple Inner Display Cutout */}
        <div className="relative mt-8 w-[220px] h-[215px] z-10 flex justify-center items-center overflow-hidden rounded-xl">
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 220 215"
            fill="none"
          >
            <path
              d="M 38 0 L 182 0 C 188 0, 191 3, 192 8 L 216 205 C 217 210, 213 215, 207 215 L 13 215 C 7 215, 3 210, 4 205 L 28 8 C 29 3, 32 0, 38 0 Z"
              fill="#5B1398"
            />
          </svg>

          {/* Centered Vertical Scale Bar */}
          <div className="relative h-full w-10 bg-[#EEF3EB] flex flex-col justify-between py-6 z-10">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="relative w-full flex justify-between items-center">
                <div className="w-3 h-[3px] bg-[#FF7A00] -ml-3" />
                <div className="w-3 h-[3px] bg-[#FF7A00] -mr-3" />
              </div>
            ))}
          </div>

          {/* Centered Pendulum Layer */}
          <div className="absolute inset-0 z-20 flex justify-center items-end pb-3 pointer-events-none">
            <motion.div
              className="relative flex flex-col items-center justify-end"
              style={{
                transformOrigin: "bottom center",
              }}
              initial={{ rotate: -28 }}
              animate={{
                rotate: animation ? (animatedIndex % 2 === 0 ? -28 : 28) : -28,
              }}
              transition={{
                duration: beatIntervalSeconds,
                ease: "easeInOut",
              }}
            >
              {/* Pendulum Rod */}
              <div className="w-7 h-[270px] bg-[#BF94E4] rounded-sm shadow-md relative flex justify-center">
                {/* Sliding Weight */}
                <div className="absolute top-[50px] w-12 h-10 bg-[#E0F2E9] shadow-md flex items-center justify-center">
                  <div className="w-6 h-6 border-b-2 border-r-2 border-gray-300 transform rotate-45 -mt-1" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* BPM Card */}
        <div className="bg-white px-8 py-2 rounded-2xl text-center shadow-lg z-30 min-w-[170px] mt-2">
          <div className="text-3xl font-black text-[#2D1B4E] leading-tight">
            {tempoNum}
          </div>
          <div className="text-xs font-bold text-[#6B109B]">
            {getTempoMarking(tempoNum)}
          </div>
        </div>

        {/* Mascot Face */}
        <div className="flex flex-col items-center justify-center space-y-2.5 z-30 mt-8 mb-4">
          <div className="flex space-x-3 items-center">
            {/* Left Eye */}
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center relative shadow-xs">
              <div className="w-5 h-6 bg-black rounded-full absolute top-[7px] right-[7px]">
                <div className="w-2 h-2.5 bg-white rounded-full absolute top-1 right-1" />
                <div className="w-1 h-1 bg-white rounded-full absolute bottom-1.5 left-1" />
              </div>
            </div>
            {/* Right Eye */}
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center relative shadow-xs">
              <div className="w-5 h-6 bg-black rounded-full absolute top-[7px] left-[7px]">
                <div className="w-2 h-2.5 bg-white rounded-full absolute top-1 right-1" />
                <div className="w-1 h-1 bg-white rounded-full absolute bottom-1.5 left-1" />
              </div>
            </div>
          </div>
          {/* Mouth */}
          <svg className="w-[22px] h-[8px]" viewBox="0 0 22 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M 2 2 Q 11 8 20 2" stroke="black" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* Outer Feet */}
      <div className="w-[300px] flex justify-between px-8 -mt-1.5 z-0">
        <div className="w-14 h-4 bg-[#B2830E] rounded-b-lg" />
        <div className="w-14 h-4 bg-[#B2830E] rounded-b-lg" />
      </div>

      {/* Beat Indicator Pill Bar */}
      <div className="mt-5 flex items-center justify-between bg-[#D8BCFD] px-[20px] py-[14px] rounded-[18px] w-[301px] gap-[17px]">
        <div className="flex items-center gap-2.5 flex-1">
          {Array.from({ length: beatsNum }, (_, index) => {
            const isCurrent = animation && index === animatedIndex;
            const isAccented = !!accentedBeats[index];

            return (
              <div
                key={index}
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                  isAccented
                    ? "border-2 border-[#DA9F00]"
                    : "border-0"
                }`}
              >
                <div
                  className={`w-5 h-5  rounded-full transition-all duration-150 ${
                    isCurrent
                      ? "bg-[#6B109B] scale-100"
                      : "bg-white"
                  }`}
                />
              </div>
            );
          })}
        </div>

        <div className="w-6 h-6 rounded-full bg-transparent text-[#6B109B] font-black text-xs flex items-center justify-center">
          {animatedIndex + 1}
        </div>
      </div>
    </div>
  );
}