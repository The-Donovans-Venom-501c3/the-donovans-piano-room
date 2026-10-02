import type { Level, OptionClickHandler } from '../../../../types';

interface ChordOptionItem {
  label: string;
  value: string;
}

// Ordered C through B for standard musical UI layout
const naturalMajors: ChordOptionItem[] = [
  { label: 'C', value: 'C Major' },
  { label: 'D', value: 'D Major' },
  { label: 'E', value: 'E Major' },
  { label: 'F', value: 'F Major' },
  { label: 'G', value: 'G Major' },
  { label: 'A', value: 'A Major' },
  { label: 'B', value: 'B Major' },
];

const sharpMajors: ChordOptionItem[] = [
  { label: 'C#', value: 'C# Major' },
  { label: 'D#', value: 'D# Major' },
  { label: 'E#', value: 'E# Major' },
  { label: 'F#', value: 'F# Major' },
  { label: 'G#', value: 'G# Major' },
  { label: 'A#', value: 'A# Major' },
  { label: 'B#', value: 'B# Major' },
];

const flatMajors: ChordOptionItem[] = [
  { label: 'C♭', value: 'C♭ Major' },
  { label: 'D♭', value: 'D♭ Major' },
  { label: 'E♭', value: 'E♭ Major' },
  { label: 'F♭', value: 'F♭ Major' },
  { label: 'G♭', value: 'G♭ Major' },
  { label: 'A♭', value: 'A♭ Major' },
  { label: 'B♭', value: 'B♭ Major' },
];

const naturalMinors: ChordOptionItem[] = [
  { label: 'C', value: 'C Minor' },
  { label: 'D', value: 'D Minor' },
  { label: 'E', value: 'E Minor' },
  { label: 'F', value: 'F Minor' },
  { label: 'G', value: 'G Minor' },
  { label: 'A', value: 'A Minor' },
  { label: 'B', value: 'B Minor' },
];

const emptyRow = Array(7).fill('');

export default function ChordOptions({
  handleOptionClick,
  level,
}: {
  handleOptionClick: OptionClickHandler;
  level: Level;
}) {
  const currentLevel = String(level).toLowerCase();

  return (
    <div className="chord-options-container">
      {/* Row 1: Natural Majors */}
      <div className="small-btn-wrapper">
        {naturalMajors.map((item) => (
          <button
            key={item.value}
            className="option-btn small-btn xsmall-font"
            onClick={() => handleOptionClick(item.value)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Rows 2 & 3: Sharps and Flats */}
      {currentLevel === 'medium' || currentLevel === 'hard' ? (
        <>
          <div className="small-btn-wrapper">
            {sharpMajors.map((item) => (
              <button
                key={item.value}
                className="option-btn small-btn xsmall-font"
                onClick={() => handleOptionClick(item.value)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="small-btn-wrapper">
            {flatMajors.map((item) => (
              <button
                key={item.value}
                className="option-btn small-btn xsmall-font"
                onClick={() => handleOptionClick(item.value)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="small-btn-wrapper">
            {emptyRow.map((_, idx) => (
              <div key={`blank-sharp-${idx}`} className="option-blank" />
            ))}
          </div>
          <div className="small-btn-wrapper">
            {emptyRow.map((_, idx) => (
              <div key={`blank-flat-${idx}`} className="option-blank" />
            ))}
          </div>
        </>
      )}

      {/* Row 4: Minors */}
      {currentLevel === 'hard' ? (
        <div className="small-btn-wrapper">
          {naturalMinors.map((item) => (
            <button
              key={item.value}
              className="option-btn small-btn xsmall-font"
              onClick={() => handleOptionClick(item.value)}
            >
              {item.label}m
            </button>
          ))}
        </div>
      ) : (
        <div className="small-btn-wrapper">
          {emptyRow.map((_, idx) => (
            <div key={`blank-minor-${idx}`} className="option-blank" />
          ))}
        </div>
      )}
    </div>
  );
}