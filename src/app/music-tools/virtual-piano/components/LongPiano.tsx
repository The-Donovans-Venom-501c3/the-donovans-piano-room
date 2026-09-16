import React from "react";
import { playSynthesizedNote } from "@/utils/soundEngine";

const octaveKeys = [
  { white: "C", black: "Db", blackText1: "C♯", blackText2: "D♭" },
  { white: "D", black: "Eb", blackText1: "D♯", blackText2: "E♭" },
  { white: "E", black: null },
  { white: "F", black: "Gb", blackText1: "F♯", blackText2: "G♭" },
  { white: "G", black: "Ab", blackText1: "G♯", blackText2: "A♭" },
  { white: "A", black: "Bb", blackText1: "A♯", blackText2: "B♭" },
  { white: "B", black: null },
];

const octaves = [2, 3, 4, 5, 6, 7];

interface LongPianoProps {
  volume: number;
  showNotes: boolean;
  instrument: string;
  isOverlay?: boolean;
}

const LongPiano: React.FC<LongPianoProps> = ({
  volume,
  showNotes,
  instrument,
  isOverlay = false,
}) => {
  const playNote = (note: string) => {
    playSynthesizedNote(note, instrument, volume);
  };

  return (
    <div className={`relative flex justify-center items-center select-none w-full max-w-full ${isOverlay ? "h-full" : "py-2"}`}>
      {/* Scroll container for standard mode; large container for expanded mode */}
      <div className={`flex shadow-2xl rounded-2xl overflow-x-auto max-w-full ${
        isOverlay 
          ? "bg-black/30 border border-white/10 p-4 h-[78vh] mx-auto" 
          : "bg-black/10 border border-gray-200 p-2 h-[340px]"
      }`}>
        {octaves.map((octave) => (
          <div key={octave} className="flex relative shrink-0 h-full">
            {octaveKeys.map(({ white, black, blackText1, blackText2 }) => {
              const whiteNote = `${white}${octave}`;
              const blackNote = black ? `${black}${octave}` : null;

              return (
                <div key={whiteNote} className="relative flex flex-col items-center h-full">
                  {/* White Key */}
                  <button
                    type="button"
                    onClick={() => playNote(whiteNote)}
                    className={`border-x border-t border-gray-300 border-b-[8px] border-b-gray-400 rounded-b-xl shadow-md active:bg-gray-100 active:border-b-4 flex flex-col justify-end items-center transition-all cursor-pointer bg-white ${
                      isOverlay
                        ? "w-14 md:w-16 lg:w-20 h-full pb-8"
                        : "w-8 md:w-10 h-full pb-4"
                    }`}
                  >
                    {showNotes && (
                      <span className={`font-extrabold text-purple-950 pointer-events-none mb-1 ${
                        isOverlay ? "text-sm md:text-base mb-2" : "text-[10px]"
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
                      className={`absolute top-0 z-20 bg-[#111111] rounded-b-lg shadow-xl active:bg-black flex flex-col justify-center items-center text-white transition-all cursor-pointer left-full -translate-x-1/2 ${
                        isOverlay
                          ? "w-8 md:w-10 lg:w-12 h-[60%]"
                          : "w-5 md:w-6 h-[180px]"
                      }`}
                    >
                      {showNotes && (
                        <div className="pointer-events-none text-center font-bold leading-snug">
                          <div className={isOverlay ? "text-xs md:text-sm text-white" : "text-[8px] text-white"}>
                            {blackText1}
                          </div>
                          <div className={isOverlay ? "text-[10px] md:text-xs text-gray-300" : "text-[6px] text-gray-300"}>
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

export default LongPiano;