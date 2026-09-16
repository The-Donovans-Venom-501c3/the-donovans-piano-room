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

const octaves = [2, 3, 4];

interface ShortPianoProps {
  volume: number;
  showNotes: boolean;
  instrument: string;
  isOverlay?: boolean;
}

const ShortPiano: React.FC<ShortPianoProps> = ({
  volume,
  showNotes,
  instrument,
  isOverlay = false,
}) => {
  const playNote = (note: string) => {
    playSynthesizedNote(note, instrument, volume);
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

              return (
                <div key={whiteNote} className="relative flex-1 flex flex-col items-center h-full">
                  {/* White Key */}
                  <button
                    type="button"
                    onClick={() => playNote(whiteNote)}
                    className={`w-full border-x border-t border-gray-300 border-b-[8px] border-b-gray-400 rounded-b-xl shadow-md active:bg-gray-100 active:border-b-4 flex flex-col justify-end items-center transition-all cursor-pointer bg-white ${
                      isOverlay
                        ? "h-full pb-8"
                        : "h-full pb-4"
                    }`}
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
                      className={`absolute top-0 z-20 bg-[#111111] rounded-b-lg shadow-xl active:bg-black flex flex-col justify-center items-center text-white transition-all cursor-pointer left-full -translate-x-1/2 ${
                        isOverlay
                          ? "w-[60%] h-[60%]"
                          : "w-[62%] h-[180px]"
                      }`}
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