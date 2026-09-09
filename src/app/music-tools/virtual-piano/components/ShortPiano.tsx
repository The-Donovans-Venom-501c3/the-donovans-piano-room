import React from "react";

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
  isOverlay?: boolean;
}

const ShortPiano: React.FC<ShortPianoProps> = ({ volume, showNotes, isOverlay = false }) => {
  const playNote = (note: string) => {
    const audio = new Audio(`/virtual-piano/notes/${note}.mp3`);
    audio.volume = volume / 100;
    audio.play();
  };

  return (
    <div className="relative flex justify-center items-start select-none w-full max-w-[1000px] px-2 py-4">
      {octaves.map((octave) => (
        <div key={octave} className="flex flex-1 relative">
          {octaveKeys.map(({ white, black, blackText1, blackText2 }) => {
            const whiteNote = `${white}${octave}`;
            const blackNote = black ? `${black}${octave}` : null;

            return (
              <div key={whiteNote} className="relative flex-1 flex flex-col items-center">
                {/* White Key */}
                <button
                  type="button"
                  onClick={() => playNote(whiteNote)}
                  className={`w-full border-x border-t border-gray-200 border-b-8 border-b-gray-300 rounded-b-xl shadow-md active:bg-gray-100 active:border-b-4 flex flex-col justify-end items-center pb-4 transition-all cursor-pointer bg-white ${
                    isOverlay ? "h-[360px]" : "h-[300px] md:h-[340px]"
                  }`}
                >
                  {showNotes && (
                    <span className="text-xs md:text-sm font-bold text-purple-700 pointer-events-none mb-1">
                      {whiteNote}
                    </span>
                  )}
                </button>

                {/* Black Key */}
                {blackNote && (
                  <button
                    type="button"
                    onClick={() => playNote(blackNote)}
                    className={`absolute top-0 z-20 bg-[#2C2C2C] rounded-b-md shadow-lg active:bg-black flex flex-col justify-center items-center text-white transition-all cursor-pointer left-full -translate-x-1/2 ${
                      isOverlay
                        ? "w-[62%] h-[210px]"
                        : "w-[62%] h-[180px] md:h-[200px]"
                    }`}
                  >
                    {showNotes && (
                      <div className="pointer-events-none text-center font-semibold leading-tight">
                        <div className="text-[10px] md:text-[11px] text-white">{blackText1}</div>
                        <div className="text-[8px] md:text-[9px] text-gray-300">{blackText2}</div>
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
  );
};

export default ShortPiano;