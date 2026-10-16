const chords = ["Major", "Natural", "Harmonic", "Melodic"];
import type { OptionClickHandler } from "../../../../types";

export default function MajorMinorOptions({
  handleOptionClick,
  wrongOptions = [],
  correctOption = null,
  locked = false
}: {
  handleOptionClick: OptionClickHandler;
  wrongOptions?: string[];
  // Set from a correct pick until the next question loads
  correctOption?: string | null;
  // Answers aren't accepted right now (question answered or Wrong popover up), so every button is disabled
  locked?: boolean;
}) {
  return (
    <div className="large-btn-wrapper major-minor">
      {chords.map((chord, index) => (
        <button
          key={chord}
          className={`option-btn large-btn ${
            wrongOptions.includes(chord) ? 'wrong' : chord === correctOption ? 'correct' : ''
          }`}
          onClick={() => handleOptionClick(chord)}
          disabled={locked || wrongOptions.includes(chord)}
        >
          {chord == "Major" ? chord : chord + " Minor"}
        </button>
      ))}
    </div>
  )
}
