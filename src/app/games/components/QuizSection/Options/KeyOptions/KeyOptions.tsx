import type { OptionClickHandler } from "../../../../types";

const notes = ["C#", "D", "E", "F", "G", "A", "B"];
const notes2 = ["C♭", "D♭", "E♭", "F#", "G♭", "A♭", "B♭"];

export default function KeyOptions({
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
  const renderOption = (note: string) => (
    <button
      key={note}
      className={`option-btn small-btn ${
        wrongOptions.includes(note) ? "wrong" : note === correctOption ? "correct" : ""
      }`}
      onClick={() => handleOptionClick(note)}
      disabled={locked || wrongOptions.includes(note)}
    >
      {note[0]}
      {note[1] === "#" ? "\u266F" : note[1] === "♭" ? "\u266D" : null}
    </button>
  );

  return (
    <div className="small-btn-wrapper key">
      {notes.map(renderOption)}
      {notes2.map(renderOption)}
    </div>
  );
}
