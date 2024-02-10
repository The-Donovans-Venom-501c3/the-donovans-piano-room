const chords = ["Major", "Natural", "Harmonic", "Melodic"];

export default function ChordOptions({handleOptionClick}) {
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
