import type { Level, OptionClickHandler } from '../../../../types';
import "./ChordOptions.scss";

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
  { label: 'C♯', value: 'C# Major' },
  { label: 'D♯', value: 'D# Major' },
  { label: 'E♯', value: 'E# Major' },
  { label: 'F♯', value: 'F# Major' },
  { label: 'G♯', value: 'G# Major' },
  { label: 'A♯', value: 'A# Major' },
  { label: 'B♯', value: 'B# Major' },
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
  wrongOptions = [],
  correctOption = null,
  locked = false,
}: {
  handleOptionClick: OptionClickHandler;
  level: Level;
  wrongOptions?: string[];
  // Set from a correct pick until the next question loads
  correctOption?: string | null;
  // Answers aren't accepted right now (question answered or Wrong popover up), so every button is disabled
  locked?: boolean;
}) {
  const currentLevel = String(level).toLowerCase();

  // Same states as NoteOptions: wrong picks stay red and disabled, the right answer turns green
  const renderOption = (item: ChordOptionItem, labelSuffix = '') => (
    <button
      key={item.value}
      className={`option-btn small-btn ${
        wrongOptions.includes(item.value) ? 'wrong' : item.value === correctOption ? 'correct' : ''
      }`}
      onClick={() => handleOptionClick(item.value)}
      disabled={locked || wrongOptions.includes(item.value)}
      title={item.value}
    >
      {item.label}
      {labelSuffix}
    </button>
  );

  return (
    <div className="chord-options-container">
      {/* Row 1: Natural Majors */}
      <div className="small-btn-wrapper chord">
        {naturalMajors.map((item) => renderOption(item))}
      </div>

      {/* Rows 2 & 3: Sharps and Flats */}
      {currentLevel === 'medium' || currentLevel === 'hard' ? (
        <>
          <div className="small-btn-wrapper chord">
            {sharpMajors.map((item) => renderOption(item))}
          </div>

          <div className="small-btn-wrapper chord">
            {flatMajors.map((item) => renderOption(item))}
          </div>
        </>
      ) : (
        <>
          <div className="small-btn-wrapper chord">
            {emptyRow.map((_, idx) => (
              <div key={`blank-sharp-${idx}`} className="option-blank" />
            ))}
          </div>
          <div className="small-btn-wrapper chord">
            {emptyRow.map((_, idx) => (
              <div key={`blank-flat-${idx}`} className="option-blank" />
            ))}
          </div>
        </>
      )}

      {/* Row 4: Minors */}
      {currentLevel === 'hard' ? (
        <div className="small-btn-wrapper chord">
          {naturalMinors.map((item) => renderOption(item, 'm'))}
        </div>
      ) : (
        <div className="small-btn-wrapper chord">
          {emptyRow.map((_, idx) => (
            <div key={`blank-minor-${idx}`} className="option-blank" />
          ))}
        </div>
      )}
    </div>
  );
}