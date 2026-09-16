"use client";

import { useState } from "react";
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

  return (
    <div className="w-full max-w-[1000px] mx-auto py-10 px-4">
      {/* Outer White Main Card */}
      <div className="relative bg-white rounded-3xl p-8 md:p-12 shadow-xs border border-purple-100/50">
        {/* Mascot Face positioned at top-right corner */}
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

        {/* Metronome & Settings Layout */}
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
      </div>
    </div>
  );
}