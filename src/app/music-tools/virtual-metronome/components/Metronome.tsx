"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState, useCallback } from "react";

interface MetronomeProps {
  beatsNum: number;
  tempoNum: number;
  accentedBeats: boolean[];
  animation: boolean;
  soundType: string;
  volume: number;
}

interface ScheduledBeat {
  time: number;
  beatIndex: number;
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
  const audioBuffersRef = useRef<{ normal: AudioBuffer | null; accented: AudioBuffer | null }>({
    normal: null,
    accented: null,
  });

  // Track active audio nodes to guarantee an immediate hard stop on pause
  const activeSourcesRef = useRef<AudioBufferSourceNode[]>([]);
  
  // High-precision queue matching audio timestamp to beat index
  const beatQueueRef = useRef<ScheduledBeat[]>([]);

  const nextBeatTimeRef = useRef<number>(0);
  const currentBeatRef = useRef<number>(0);
  const timerIdRef = useRef<number | null>(null);
  const rafIdRef = useRef<number | null>(null);

  // Initialize or retrieve active AudioContext
  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtxRef.current = new AudioCtxClass();
    }
    return audioCtxRef.current;
  }, []);

  // Pre-load audio samples into memory
  useEffect(() => {
    const soundMap: Record<string, [string, string]> = {
      "Grand Piano": ["/sounds/Piano.wav", "/sounds/PianoEmp.wav"],
      "Wood Block": ["/sounds/Bongo.wav", "/sounds/BongoEmp.wav"],
      "Electronic Click": ["/sounds/Click.wav", "/sounds/ClickEmp.wav"],
      Drum: ["/sounds/Tambourine.wav", "/sounds/TambourineEmp.wav"],
    };

    const paths = soundMap[soundType] || soundMap["Grand Piano"];

    const loadBuffer = async (url: string) => {
      try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const ctx = getAudioContext();
        return await ctx.decodeAudioData(arrayBuffer);
      } catch {
        return null;
      }
    };

    let isMounted = true;
    Promise.all([loadBuffer(paths[0]), loadBuffer(paths[1])]).then(([normal, accented]) => {
      if (isMounted) {
        audioBuffersRef.current = { normal, accented };
      }
    });

    return () => {
      isMounted = false;
    };
  }, [soundType, getAudioContext]);

  // Immediate hard-stop cleanup function
  const clearAllScheduledAudioAndVisuals = () => {
    // 1. Cancel next scheduler loop & RAF loop
    if (timerIdRef.current !== null) {
      window.clearTimeout(timerIdRef.current);
      timerIdRef.current = null;
    }
    if (rafIdRef.current !== null) {
      window.cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }

    // 2. Clear scheduled beat queue
    beatQueueRef.current = [];

    // 3. Hard stop and disconnect all scheduled Web Audio sources instantly
    activeSourcesRef.current.forEach((source) => {
      try {
        source.stop(0);
        source.disconnect();
      } catch {
        // Source already ended
      }
    });
    activeSourcesRef.current = [];
  };

  // Play audio sample on hardware clock with active source registration
  const playBeatSound = useCallback(
    (isAccented: boolean, time: number) => {
      if (volume === 0) return;
      const ctx = getAudioContext();
      const buffer = isAccented
        ? audioBuffersRef.current.accented
        : audioBuffersRef.current.normal;

      if (buffer) {
        const source = ctx.createBufferSource();
        const gain = ctx.createGain();
        gain.gain.value = volume / 10;
        source.buffer = buffer;
        source.connect(gain);
        gain.connect(ctx.destination);

        source.start(time);
        activeSourcesRef.current.push(source);

        source.onended = () => {
          activeSourcesRef.current = activeSourcesRef.current.filter((s) => s !== source);
        };
      } else {
        // Fallback synthesizer
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.frequency.setValueAtTime(isAccented ? 1050 : 750, time);
        osc.type = "sine";

        const gainLevel = (volume / 10) * 0.5;
        gain.gain.setValueAtTime(gainLevel, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(time);
        osc.stop(time + 0.05);
      }
    },
    [volume, getAudioContext]
  );

  // Master Synchronized Loop
  useEffect(() => {
    if (!animation) {
      clearAllScheduledAudioAndVisuals();
      setAnimatedIndex(0);
      currentBeatRef.current = 0;
      return;
    }

    let isRunning = true;
    const ctx = getAudioContext();

    const startScheduler = async () => {
      // Ensure AudioContext is fully running before calculating start time (fixes start hesitation)
      if (ctx.state === "suspended") {
        await ctx.resume();
      }

      if (!isRunning) return;

      nextBeatTimeRef.current = ctx.currentTime + 0.05;
      currentBeatRef.current = 0;

      const lookahead = 20; // ms check frequency
      const scheduleAheadTime = 0.1; // seconds

      const scheduler = () => {
        while (nextBeatTimeRef.current < ctx.currentTime + scheduleAheadTime) {
          const beatIndex = currentBeatRef.current;
          const isAccented = !!accentedBeats[beatIndex];

          // 1. Schedule Audio
          playBeatSound(isAccented, nextBeatTimeRef.current);

          // 2. Queue Beat timestamp for requestAnimationFrame visual sync
          beatQueueRef.current.push({
            time: nextBeatTimeRef.current,
            beatIndex,
          });

          // 3. Increment Beat Counter
          const secondsPerBeat = 60 / tempoNum;
          nextBeatTimeRef.current += secondsPerBeat;
          currentBeatRef.current = (currentBeatRef.current + 1) % beatsNum;
        }

        timerIdRef.current = window.setTimeout(scheduler, lookahead);
      };

      // Hardware-driven visual animation sync loop
      const updateVisuals = () => {
        const currentTime = ctx.currentTime;

        while (
          beatQueueRef.current.length > 0 &&
          beatQueueRef.current[0].time <= currentTime
        ) {
          const currentBeat = beatQueueRef.current.shift();
          if (currentBeat) {
            setAnimatedIndex(currentBeat.beatIndex);
          }
        }

        if (isRunning) {
          rafIdRef.current = window.requestAnimationFrame(updateVisuals);
        }
      };

      scheduler();
      rafIdRef.current = window.requestAnimationFrame(updateVisuals);
    };

    startScheduler();

    return () => {
      isRunning = false;
      clearAllScheduledAudioAndVisuals();
    };
  }, [
    animation,
    beatsNum,
    tempoNum,
    accentedBeats,
    volume,
    getAudioContext,
    playBeatSound,
  ]);

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
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 220 215" fill="none">
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
              style={{ transformOrigin: "bottom center" }}
              initial={{ rotate: -28 }}
              animate={{
                // Beat 1 (animatedIndex = 0) -> Swing RIGHT (+28 deg)
                // Beat 2 (animatedIndex = 1) -> Swing LEFT (-28 deg)
                rotate: animation ? (animatedIndex % 2 === 0 ? 28 : -28) : -28,
              }}
              transition={{
                duration: beatIntervalSeconds * 0.9,
                ease: [0.25, 0.1, 0.25, 1.0], // Natural cubic-bezier mechanical pendulum curve
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
          <div className="text-3xl font-black text-[#2D1B4E] leading-tight">{tempoNum}</div>
          <div className="text-xs font-bold text-[#6B109B]">{getTempoMarking(tempoNum)}</div>
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

      {/* Perfectly Centered Beat Indicator Pill Bar */}
      <div className="mt-5 flex items-center justify-center bg-[#D8BCFD] px-5 py-3.5 rounded-[18px] w-[301px] relative">
        <div className="flex items-center justify-center gap-3 w-full">
          {Array.from({ length: beatsNum }, (_, index) => {
            const isCurrent = animation && index === animatedIndex;
            const isAccented = !!accentedBeats[index];

            return (
              <div
                key={index}
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                  isAccented ? "border-2 border-[#DA9F00]" : "border-0"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full transition-all duration-100 ${
                    isCurrent ? "bg-[#6B109B] scale-110 shadow-sm" : "bg-white opacity-80"
                  }`}
                />
              </div>
            );
          })}
        </div>

        <div className="absolute right-4 w-6 h-6 rounded-full bg-transparent text-[#6B109B] font-black text-xs flex items-center justify-center">
          {animatedIndex + 1}
        </div>
      </div>
    </div>
  );
}