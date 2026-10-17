const notes = ["M2", "M3", "P4", "P5", "M6", "M7"];

const notes2 = ["m2", "m3", "m6", "m7"];

const notes3 = ["Octave", "Unison"];
import type { OptionClickHandler } from "../../../../types";
import "./IntervalOptions.scss";

export default function IntervalOptions({ handleOptionClick }: { handleOptionClick: OptionClickHandler }) {
  return (
    <div className="interval-options-container">
      <div className="small-btn-wrapper small-btn-wrapper-6 interval">
        {notes.map((note, index) => (
          <button
            className="option-btn small-btn"
            onClick={() => handleOptionClick(note)}
            key={index}
          >
            {note}
          </button>
        ))}
      </div>

      <div className="small-btn-wrapper small-btn-wrapper-6 interval">
        {notes2.map((note, index) => (
          <button
            className="option-btn small-btn"
            onClick={() => handleOptionClick(note)}
            key={index}
          >
            {note}
          </button>
        ))}
      </div>

      <div className="small-btn-wrapper small-btn-wrapper-6 interval">
        {notes3.map((note, index) => (
          <button
            className="option-btn small-btn"
            onClick={() => handleOptionClick(note)}
            key={index}
          >
            {note}
          </button>
        ))}
      </div>
    </div>
  );
}
