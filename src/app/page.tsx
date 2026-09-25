"use client";

import { useState, useEffect, useRef } from "react";
import Button1 from "@/components/atoms/Button1";
import Button2 from "@/components/atoms/Button2";
import Footer2 from "@/components/footers/Footer2";
import Navbar2 from "@/components/navbars/Navbar2";
import Image from "next/image";
import Link from "next/link";
import { useAtomValue } from "jotai";
import { profileAtom } from "@/utils/stores";

// TRACKS array matching exact audio filenames without composer prefixes or extensions
const TRACKS = [
  { title: "Fantasie Impromptu", file: "Fantasie Impromptu.wav" },
  { title: "Gymno", file: "Gymno.wav" },
  { title: "Moonlight Sonata", file: "Moonlight Sonata.wav" },
  { title: "Nocturne Op. 37, No. 2 in G Minor", file: "Nocturne Op. 37, No. 2 in G Minor.wav" },
  { title: "Posthumous Nocturne", file: "Posthumous Nocturne.wav" },
  { title: "Pourle Piano", file: "Pourle Piano.wav" },
  { title: "Prelude in C# minor", file: "Prelude in C# minor.wav" },
  { title: "The Seasons Op. 37a August (Harvest)", file: "The Seasons Op. 37a August (Harvest).wav" },
];

export default function Home() {
  const profile = useAtomValue(profileAtom);
  const isLoggedIn = Boolean(profile?.id);

  const [currentTrack, setCurrentTrack] = useState(TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Pick today's track automatically based on calendar date
  useEffect(() => {
    const today = new Date();
    const dayIndex = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));
    const selectedTrack = TRACKS[dayIndex % TRACKS.length];
    setCurrentTrack(selectedTrack);

    // Safely encode characters (#, spaces) for web loading
    const encodedAudioPath = `/audio/${encodeURIComponent(selectedTrack.file)}`;
    const audio = new Audio(encodedAudioPath);
    audio.volume = 1.0; // Max default HTML volume
    audio.onended = () => setIsPlaying(false);

    audioRef.current = audio;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;

    // Initialize Web Audio API gain boost on first user interaction to bypass browser restrictions
    if (!audioContextRef.current && audioRef.current) {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioCtx();
        const source = ctx.createMediaElementSource(audioRef.current);
        const gainNode = ctx.createGain();

        // Boost gain above standard max (1.8 = 180% volume)
        gainNode.gain.value = 1.8;

        source.connect(gainNode);
        gainNode.connect(ctx.destination);
        audioContextRef.current = ctx;
      } catch (err) {
        console.warn("Web Audio API boost fallback:", err);
      }
    }

    if (audioContextRef.current && audioContextRef.current.state === "suspended") {
      audioContextRef.current.resume();
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.error("Audio playback error:", err);
        });
    }
  };

  return (
    <>
      <Navbar2 />
      <div className="w-full h-[100vh] bg-primary-purple flex items-center justify-center relative">
        <div className="relative z-10 w-[84.7%] h-[70vh] flex items-center justify-between">
          
          {/* Left Text & CTA Section */}
          <div className="w-[40%]">
            <div className="w-[70%]">
              <h1 className="text-white text-2xl sm:text-4xl md:text-3xl lg:text-5xl xl:text-7xl 2xl:text-9xl 4xl:text-9xl font-semibold font-montserrat">
                Ready for your music lesson?
              </h1>
              <p className="text-white text-xs lg:text-base xl:text-xl sm:text-xs mt-[5%]">
                Embark on a fun-filled musical adventure with The Donovan&apos;s Piano Room. Unlock the joy of music with our tailored and enriching music lessons!
              </p>
              <div className="flex flex-col gap-[2vh] mt-[10%]">
                {isLoggedIn ? (
                  <Link href="/dashboard">
                    <Button1 text="Enter The Donovan's Piano Room" />
                  </Link>
                ) : (
                  <>
                    <Link href="/login"><Button1 text="Login" /></Link>
                    <Link href="/signup"><Button2 text="Sign Up" /></Link>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Interactive Map Section */}
          <div className="relative w-[60%] h-[100%]">
            {/* Map Canvas Background */}
            <Image className="w-full h-full object-contain" src="/home/map.svg" fill alt="Map" />
            
            {/* Shop Link */}
            <Link href="/shop">
              <button className="absolute font-mountains font-bold left-[34%] top-[20%] -translate-x-1/2 -translate-y-1/2 xl:text-[28px] sm:max-md:text-[16px] md:max-lg:text-[18px] lg:max-xl:text-[20px] xl:max-2xl:text-[26px] text-green-accent hover:text-gray-200 z-10">
                Shop
              </button>
            </Link>

            {/* About Link */}
            <Link href="/about/why-choose-us">
              <button className="absolute font-mountains font-bold left-[60%] top-[26%] -translate-x-1/2 -translate-y-1/2 xl:text-[28px] sm:max-md:text-[16px] md:max-lg:text-[18px] lg:max-xl:text-[20px] xl:max-2xl:text-[26px] text-green-accent hover:text-gray-200 z-10">
                About
              </button>
            </Link>

            {/* Games Link */}
            <Link href="/games">
              <button className="absolute font-mountains font-bold left-[44%] top-[63%] -translate-x-1/2 -translate-y-1/2 xl:text-[28px] sm:max-md:text-[16px] md:max-lg:text-[18px] lg:max-xl:text-[20px] xl:max-2xl:text-[26px] text-green-accent hover:text-gray-200 z-10">
                Games
              </button>
            </Link>

            {/* Music Player Badge */}
            <button
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause music" : "Play music"}
              className="absolute right-[46%] bottom-[5%] z-20 flex items-center gap-3 bg-[#6C22A6] hover:bg-[#5B1B8E] text-white px-6 py-2.5 rounded-full transition-all duration-200 cursor-pointer border border-[#A855F7]/40 shadow-lg"
            >
              <div className={`relative w-7 h-7 flex-shrink-0 ${isPlaying ? "animate-pulse" : ""}`}>
                <Image
                  src="/home/Music-Symbol.png"
                  alt="Music Symbol"
                  fill
                  className="object-contain mix-blend-screen"
                />
              </div>
              <span className="text-base sm:text-lg font-bold whitespace-nowrap tracking-wide text-white">
                {currentTrack.title}
              </span>
            </button>
          </div>
        </div>

        {/* Decorative Background Icons */}
        <div className="absolute top-[15vh] left-[34vw]">
          <div className="relative w-[5vw] h-[3vw]">
            <Image src="/background-icons/Elipse216DarkPurple.svg" fill alt="" />
          </div>
        </div>
        <div className="absolute top-[25vh] left-[29vw]">
          <div className="relative w-[1.5vw] h-[1.5vw]">
            <Image src="/background-icons/DarkPurpleDot.svg" alt="" fill />
          </div>
        </div>
        <div className="absolute top-0 right-0">
          <div className="relative w-[15vw] h-[22vh]">
            <Image fill src="/background-icons/RightTop1.svg" alt="" />
          </div>
        </div>
        <div className="absolute bottom-0 left-0">
          <div className="relative w-[22vw] h-[25vh]">
            <Image src="/background-icons/LeftBottom.svg" alt="" fill />
          </div>
        </div>

      </div>
      <Footer2 />
    </>
  );
}