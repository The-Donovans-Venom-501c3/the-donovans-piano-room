import type { OptionClickHandler } from "../../../../types";

const notes = ["C#", "D", "E", "F", "G", "A", "B"];
const notes2 = ["C♭", "D♭", "E♭", "F#", "G♭", "A♭", "B♭"];

export default function KeyOptions({ handleOptionClick }: { handleOptionClick: OptionClickHandler }) {
  return (
    <div className="small-btn-wrapper" style={{ marginTop: 50 }}>
      {notes.map((note, index) => (
        <button
          className="option-btn small-btn"
          onClick={() => handleOptionClick(note)}
          key={index}
        >
          {note[0]}
          {note == "C#" ? <img src="/games/SharpSymbol.svg" alt="Sharp" /> : null}
        </button>
      ))}

      {notes2.map((note, index) => (
        <button
          className="option-btn small-btn"
          onClick={() => handleOptionClick(note)}
          key={index}
        >
          {note[0]}
          {note == "F#" ? <img src="/games/SharpSymbol.svg" alt="Sharp" /> : <img src="/games/BimolSymbol.svg" alt="Flat" />}
        </button>
      ))}
    </div>
  );
}
