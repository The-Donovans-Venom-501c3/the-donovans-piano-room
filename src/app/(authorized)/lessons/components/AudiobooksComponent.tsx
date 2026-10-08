"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

// Audio files live in public/audio/audiobooks/ (gitignored — over GitHub's 100MB limit)
// until external hosting is set up; audioFile is null for books with no recording yet.
// TODO: confirm which book the "eMastered" recording is — assumed Book I for now.
// TODO: Book I and Book III descriptions are placeholders until real copy is provided.
const audiobooks = [
  {
    id: "1",
    title: "Book I",
    audioFile: "eMastered_The-Donovans-Piano-Room--Audio-Book-Final-.mp3",
    imgsrc: "/lessons/Audiobooks/Book 1 - Audiobook.svg",
    description:
      "Listen anytime, anywhere from your computer or mobile device with the audio version of Book I.",
  },
  {
    id: "2",
    title: "Book II",
    audioFile: "THE DONOVANS PIANO ROOM BOOK II (Audio).mp3",
    imgsrc: "/lessons/Audiobooks/Book 2 - Audiobook.svg",
    description:
      "Learn anytime, anywhere from your computer or mobile device with our interactive, digital copy of Book II. Learners dive deeper into musical mastery as they explore chords, inversions, complex rhythms, major & minor scales, fingering techniques, intervals, transcribing, writing music, and more!",
  },
  {
    id: "3",
    title: "Book III",
    audioFile: null,
    imgsrc: "/lessons/Audiobooks/Book 3 - Audiobook.svg",
    description:
      "Listen anytime, anywhere from your computer or mobile device with the audio version of Book III.",
  },
];

const SKIP_SECONDS = 15;

function formatTime(totalSeconds: number) {
  if (!Number.isFinite(totalSeconds)) return "0:00";
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60).toString().padStart(2, "0");
  return hours > 0
    ? `${hours}:${minutes.toString().padStart(2, "0")}:${seconds}`
    : `${minutes}:${seconds}`;
}

interface CardProps {
  width?: number;
  height?: number;
  children: React.ReactNode;
}

function SelectedCard({ width = 260, height = 288, children }: CardProps) {
  return (
    <div
      style={{ width: `${width}px` }}
      className="group bg-primary-purple border-2 rounded-3xl flex pb-[10px] border-primary-purple cursor-pointer"
    >
      <div
        style={{ minHeight: `${height}px` }}
        className="w-full rounded-3xl flex flex-col items-center justify-center p-2 bg-secondary-purple"
      >
        {children}
      </div>
    </div>
  );
}

interface AudioPlayerProps {
  src: string;
  title: string;
}

function AudioPlayer({ src, title }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Start playing as soon as the player opens (it only opens from a click, so browsers allow it),
  // and make sure nothing keeps playing after the player closes.
  useEffect(() => {
    const audio = audioRef.current;
    audio?.play().catch((err) => console.error("Audiobook playback error:", err));
    return () => audio?.pause();
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().catch((err) => console.error("Audiobook playback error:", err));
    } else {
      audio.pause();
    }
  };

  const seekTo = (time: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.min(Math.max(time, 0), duration || 0);
    setCurrentTime(audio.currentTime);
  };

  return (
    <div className="flex items-center gap-4 mt-6 bg-white/60 rounded-3xl px-6 py-3">
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />

      <button
        type="button"
        onClick={() => seekTo(currentTime - SKIP_SECONDS)}
        aria-label={`Back ${SKIP_SECONDS} seconds`}
        className="text-primary-purple font-semibold text-sm hover:opacity-70"
      >
        -{SKIP_SECONDS}s
      </button>

      <button
        type="button"
        onClick={togglePlay}
        aria-label={isPlaying ? `Pause ${title}` : `Play ${title}`}
        className="w-12 h-12 flex-shrink-0 rounded-full bg-primary-purple text-white flex items-center justify-center hover:bg-tertiary-purple"
      >
        {isPlaying ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <rect x="5" y="4" width="5" height="16" rx="1" />
            <rect x="14" y="4" width="5" height="16" rx="1" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M7 4.5v15a1 1 0 0 0 1.5.86l12-7.5a1 1 0 0 0 0-1.72l-12-7.5A1 1 0 0 0 7 4.5z" />
          </svg>
        )}
      </button>

      <button
        type="button"
        onClick={() => seekTo(currentTime + SKIP_SECONDS)}
        aria-label={`Forward ${SKIP_SECONDS} seconds`}
        className="text-primary-purple font-semibold text-sm hover:opacity-70"
      >
        +{SKIP_SECONDS}s
      </button>

      <span className="text-primary-gray text-sm tabular-nums w-16 text-right">
        {formatTime(currentTime)}
      </span>
      <input
        type="range"
        min={0}
        max={duration || 0}
        step={1}
        value={currentTime}
        onChange={(e) => seekTo(Number(e.target.value))}
        aria-label={`${title} progress`}
        className="flex-1 accent-primary-purple cursor-pointer"
      />
      <span className="text-primary-gray text-sm tabular-nums w-16">
        {formatTime(duration)}
      </span>
    </div>
  );
}

interface AudiobooksComponentProps {
  searchQuery?: string;
}

export default function AudiobooksComponent({ searchQuery = "" }: AudiobooksComponentProps) {
  const [selected, setSelected] = useState<number>(1);
  const [listening, setListening] = useState<boolean>(false);

  const q = searchQuery.toLowerCase().trim();
  const filteredAudiobooks = audiobooks.filter((book) =>
    book.title.toLowerCase().includes(q)
  );

  const selectedBook = audiobooks[selected];

  const selectBook = (index: number) => {
    if (index === selected) return;
    setSelected(index);
    setListening(false); // closing the player stops the previous book
  };

  const handleListen = (index: number) => {
    if (!audiobooks[index]?.audioFile) return;
    setSelected(index);
    setListening(true);
  };

  return (
    <>
      <h2 className="text-4xl font-medium text-primary-brown mb-4">Audiobooks</h2>

      {filteredAudiobooks.length === 0 ? (
        <div className="text-center py-12 text-gray-500 font-medium text-lg">
          No audiobooks found matching &quot;{searchQuery}&quot;
        </div>
      ) : (
        <div>
          <div className="flex gap-10 mb-10 items-center flex-wrap">
            {filteredAudiobooks.map((book) => {
              const originalIndex = audiobooks.findIndex((b) => b.id === book.id);
              const isSelected = selected === originalIndex;

              return (
                <div
                  key={book.id}
                  className="relative transition-all duration-300 cursor-pointer"
                  onClick={() => selectBook(originalIndex)}
                  onDoubleClick={() => handleListen(originalIndex)}
                >
                  {isSelected ? (
                    <SelectedCard>
                      <Image
                        className="object-contain w-[240px] h-[266px] transition-all duration-300"
                        src={book.imgsrc}
                        alt={`${book.title} audiobook`}
                        width={240}
                        height={266}
                      />
                    </SelectedCard>
                  ) : (
                    <Image
                      className="object-contain w-[200px] h-[222px] transition-all duration-300"
                      src={book.imgsrc}
                      alt={`${book.title} audiobook`}
                      width={200}
                      height={222}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {selectedBook && (
            <div className="p-10 bg-secondary-purple rounded-lg">
              <div className="flex gap-8 items-center">
                <div className="min-w-[160px]">
                  <Image src="/lessons/Cat.svg" alt="Cat" width={160} height={136} />
                </div>
                <div className="flex-[2]">
                  <h2 className="text-4xl font-medium text-primary-brown">
                    {selectedBook.title}
                  </h2>
                  <p className="text-2xl text-primary-gray leading-[24px]">
                    {selectedBook.description}
                  </p>
                </div>
                <div className="flex-[1]">
                  {selectedBook.audioFile ? (
                    <button
                      className="bg-primary-purple text-white text-xl block mx-auto my-4 px-10 py-3 rounded-3xl"
                      onClick={() => handleListen(selected)}
                    >
                      Listen & practice
                    </button>
                  ) : (
                    <button
                      className="bg-gray-400 text-white text-xl block mx-auto my-4 px-10 py-3 rounded-3xl cursor-not-allowed"
                      disabled
                    >
                      Coming soon
                    </button>
                  )}
                </div>
              </div>

              {listening && selectedBook.audioFile && (
                <AudioPlayer
                  key={selectedBook.id}
                  src={`/audio/audiobooks/${encodeURIComponent(selectedBook.audioFile)}`}
                  title={selectedBook.title}
                />
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}
