const notes = ["M2", "M3", "P4", "P5", "M6", "M7"];

const notes2 = ["m2", "m3", "m6", "m7"];

const notes3 = ["Octave", "Unison"];
import type { OptionClickHandler } from "../../../../types";
import "./IntervalOptions.scss";

export default function IntervalOptions({
  handleOptionClick,
  wrongOptions = [],
  correctOption = null,
  locked = false,
}: {
  handleOptionClick: OptionClickHandler;
  wrongOptions?: string[];
  // Set from a correct pick until the next question loads
  correctOption?: string | null;
  // Answers aren't accepted right now (question answered or Wrong popover up), so every button is disabled
  locked?: boolean;
}) {
  // Same states as NoteOptions: wrong picks stay red and disabled, the right answer turns green
  const renderOption = (note: string, index: number) => (
    <button
      className={`option-btn small-btn ${
        wrongOptions.includes(note) ? "wrong" : note === correctOption ? "correct" : ""
      }`}
      onClick={() => handleOptionClick(note)}
      disabled={locked || wrongOptions.includes(note)}
      key={index}
    >
      {note}
    </button>
  );
  return (
    <div className="interval-options-container">
      <div className="small-btn-wrapper small-btn-wrapper-6 interval">
        {notes.map(renderOption)}
      </div>

      <div className="small-btn-wrapper small-btn-wrapper-6 interval">
        {notes2.map(renderOption)}
      </div>

      <div className="small-btn-wrapper small-btn-wrapper-6 interval">
        {notes3.map(renderOption)}
      </div>
    </div>
  );
}
