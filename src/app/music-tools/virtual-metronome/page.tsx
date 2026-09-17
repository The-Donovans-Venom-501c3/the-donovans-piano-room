"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Metronome from "./components/Metronome";
import TempoSetting from "./components/TempoSetting";

export default function VirtualMetronomePage() {
  const [tempoNum, setTempo] = useState<number>(160);
  const [beatsNum, setBeats] = useState<number>(4);
  const [accentedBeats, setAccentedBeats] = useState<boolean[]>([
    false,
    false,
    false,
    false,
  ]);
  const [animation, setAnimation] = useState<boolean>(false);
  const [soundType, setSoundType] = useState<string>("Grand Piano");
  const [volume, setVolume] = useState<number>(5);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

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
      // Fallback for browser API exceptions
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsExpanded(false);
      }
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
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
        <div className="w-full max-w-[1000px] mx-auto py-10 px-4">
          <div className="relative bg-white rounded-3xl p-8 md:p-12 shadow-xs border border-purple-100/50">
            {/* Mascot */}
            <div
              className="absolute z-30 pointer-events-none select-none"
              style={{
                top: "-50px",
                right: "-100px",
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

            <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16 w-full">
              <Metronome
                beatsNum={beatsNum}
                tempoNum={tempoNum}
                accentedBeats={accentedBeats}
                animation={animation}
                soundType={soundType}
                volume={volume}
              />

              <TempoSetting
                tempoNum={tempoNum}
                setTempo={setTempo}
                beatsNum={beatsNum}
                setBeats={setBeats}
                accentedBeats={accentedBeats}
                setAccentedBeats={setAccentedBeats}
                animation={animation}
                setAnimation={setAnimation}
                soundType={soundType}
                setSoundType={setSoundType}
                volume={volume}
                setVolume={setVolume}
              />
            </div>

            {/* Expand Full Screen Button */}
            <div className="w-full flex justify-center mt-10">
              <button
                type="button"
                onClick={() => toggleFullScreen(true)}
                className="flex items-center gap-2 px-8 py-3 rounded-full border border-purple-300 bg-white text-[#6B109B] font-bold text-base shadow-sm hover:bg-purple-50 transition-all cursor-pointer"
              >
                Expand &#8599;
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* FULL SCREEN / EXPANDED VIEW */
        <div className="w-full h-full flex flex-col justify-between bg-[#5B0D86] p-4 md:p-6">
          {/* Header Bar */}
          <div className="w-full max-w-[1800px] mx-auto px-8 py-4 bg-black/20 backdrop-blur-md flex items-center justify-between border border-white/10 rounded-2xl shrink-0">
            <Image
              src="/navbar/Logo2.svg"
              alt="The Donovan's Piano Room"
              width={240}
              height={55}
              className="h-10 md:h-12 w-auto object-contain"
              priority
            />

            <button
              type="button"
              onClick={() => toggleFullScreen(false)}
              className="text-white bg-white/15 hover:bg-white/25 px-5 py-2.5 rounded-xl text-base font-bold cursor-pointer transition-all flex items-center gap-2 border border-white/20 shadow-md"
            >
              Exit <span>&#8600;</span>
            </button>
          </div>

          {/* Centered Side-by-Side Main Workspace */}
          <div className="w-full flex-1 flex items-center justify-center py-6 overflow-y-auto">
            <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16 max-w-5xl mx-auto w-full px-4">
              <div className="shrink-0 scale-100 md:scale-105">
                <Metronome
                  beatsNum={beatsNum}
                  tempoNum={tempoNum}
                  accentedBeats={accentedBeats}
                  animation={animation}
                  soundType={soundType}
                  volume={volume}
                />
              </div>

              <div className="w-full max-w-[480px] shrink-0">
                <TempoSetting
                  tempoNum={tempoNum}
                  setTempo={setTempo}
                  beatsNum={beatsNum}
                  setBeats={setBeats}
                  accentedBeats={accentedBeats}
                  setAccentedBeats={setAccentedBeats}
                  animation={animation}
                  setAnimation={setAnimation}
                  soundType={soundType}
                  setSoundType={setSoundType}
                  volume={volume}
                  setVolume={setVolume}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}