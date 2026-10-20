import React from "react";
import { playSynthesizedNote } from "@/utils/soundEngine";
import { twMerge } from "tailwind-merge";

const octaveKeys = [
  { white: "C", black: "Db", blackText1: "C♯", blackText2: "D♭" },
  { white: "D", black: "Eb", blackText1: "D♯", blackText2: "E♭" },
  { white: "E", black: null },
  { white: "F", black: "Gb", blackText1: "F♯", blackText2: "G♭" },
  { white: "G", black: "Ab", blackText1: "G♯", blackText2: "A♭" },
  { white: "A", black: "Bb", blackText1: "A♯", blackText2: "B♭" },
  { white: "B", black: null },
];

const octaves = [2, 3, 4];

interface ShortPianoProps {
  volume: number;
  showNotes: boolean;
  instrument: string;
  isOverlay?: boolean;
  activeNotes?: Set<string>; // <-- Added for MIDI hardware/file state tracking
  onKeyClick?: (note: string) => void; // <-- Optional callback for UI clicks
}

const ShortPiano: React.FC<ShortPianoProps> = ({
  volume,
  showNotes,
  instrument,
  isOverlay = false,
  activeNotes = new Set(),
  onKeyClick,
}) => {
  const playNote = (note: string) => {
    playSynthesizedNote(note, instrument, volume);
    if (onKeyClick) onKeyClick(note);
  };

  return (
    <div
      className={`relative flex justify-center items-center select-none w-full max-w-full ${
        isOverlay ? "max-w-[1600px] h-full" : "max-w-[1000px] px-2 py-2"
      }`}
    >
      <div className={`flex w-full justify-center shadow-2xl rounded-2xl ${
        isOverlay 
          ? "bg-black/30 border border-white/10 p-4 h-[78vh]" 
          : "bg-black/10 border border-gray-200 p-2 h-[340px]"
      }`}>
        {octaves.map((octave) => (
          <div key={octave} className="flex flex-1 relative h-full">
            {octaveKeys.map(({ white, black, blackText1, blackText2 }) => {
              const whiteNote = `${white}${octave}`;
              const blackNote = black ? `${black}${octave}` : null;

              const isWhiteActive = activeNotes.has(whiteNote);
              const isBlackActive = blackNote ? activeNotes.has(blackNote) : false;

              return (
                <div key={whiteNote} className="relative flex-1 flex flex-col items-center h-full">
                  {/* White Key */}
                  <button
                    type="button"
                    onClick={() => playNote(whiteNote)}
                    className={twMerge(
                      "w-full border-x border-t border-gray-300 border-b-[8px] border-b-gray-400 rounded-b-xl shadow-md flex flex-col justify-end items-center transition-all cursor-pointer bg-white",
                      isOverlay ? "h-full pb-8" : "h-full pb-4",
                      isWhiteActive
                        ? "bg-gray-200 border-b-2 translate-y-1.5 shadow-inner"
                        : "active:bg-gray-100 active:border-b-4 active:translate-y-1"
                    )}
                  >
                    {showNotes && (
                      <span className={`font-extrabold text-purple-950 pointer-events-none mb-1 ${
                        isOverlay ? "text-base md:text-lg mb-2" : "text-xs md:text-sm"
                      }`}>
                        {whiteNote}
                      </span>
                    )}
                  </button>

                  {/* Black Key */}
                  {blackNote && (
                    <button
                      type="button"
                      onClick={() => playNote(blackNote)}
                      className={twMerge(
                        "absolute top-0 z-20 rounded-b-lg shadow-xl flex flex-col justify-center items-center text-white transition-all cursor-pointer left-full -translate-x-1/2",
                        isOverlay ? "w-[60%] h-[60%]" : "w-[62%] h-[180px]",
                        isBlackActive
                          ? "bg-gray-800 shadow-inner translate-y-1"
                          : "bg-[#111111] active:bg-black"
                      )}
                    >
                      {showNotes && (
                        <div className="pointer-events-none text-center font-bold leading-snug">
                          <div className={isOverlay ? "text-xs md:text-sm text-white" : "text-[10px] text-white"}>
                            {blackText1}
                          </div>
                          <div className={isOverlay ? "text-[10px] md:text-xs text-gray-300" : "text-[8px] text-gray-300"}>
                            {blackText2}
                          </div>
                        </div>
                      )}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShortPiano;