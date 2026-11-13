import type { Level, OptionClickHandler } from "../../../../types";
const notes = ["C", "D", "E", "F", "G", "A", "B"];

const symbols = [
  {
    name: "",
  },
  {
    name: "#",
  },
  {
    name: "♭",
  },
];

export default function LedgerOptions({
  handleOptionClick,
  level,
  wrongOptions = [],
  correctOption = null,
  locked = false
}: {
  handleOptionClick: OptionClickHandler;
  level: Level;
  wrongOptions?: string[];
  // Set from a correct pick until the next question loads
  correctOption?: string | null;
  // Answers aren't accepted right now (question answered or Wrong popover up), so every button is disabled
  locked?: boolean;
}) {
  return (
    <div className="small-btn-wrapper">
      {symbols.map((symbol, index) =>
        notes.map((note, idx) => {
          const option = note + symbol.name;
          return (level == "easy" && index > 0) || (level == "medium" && index > 1) ? (
            <div key={note} className="option-blank"></div>
          ) : (
            <button
              key={idx}
              onClick={() => handleOptionClick(option)}
              className={`option-btn small-btn ${
                wrongOptions.includes(option) ? 'wrong' : option === correctOption ? 'correct' : ''
              }`}
              disabled={locked || wrongOptions.includes(option)}
            >
              {note}
              {index !== 0 ? (index === 1 ? "\u266F" : "\u266D") : null}
            </button>
          );
        })
      )}
    </div>
  );
}
