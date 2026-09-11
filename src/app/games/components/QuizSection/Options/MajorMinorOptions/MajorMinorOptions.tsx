const chords = ["Major", "Natural", "Harmonic", "Melodic"];
import type { OptionClickHandler } from "../../../../types";

export default function MajorMinorOptions({ handleOptionClick }: { handleOptionClick: OptionClickHandler }) {
  return (
    <div className="large-btn-wrapper" style={{marginTop:30}}>
      {chords.map((chord, index) => (
        <button style={{height:85}} className="option-btn large-btn" key={index} onClick={() => handleOptionClick(chord)}>
          {chord == "Major" ? chord : chord + " Minor"}
        </button>
      ))}
    </div>
  )
}
