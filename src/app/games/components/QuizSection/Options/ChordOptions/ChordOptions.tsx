import type { Level, OptionClickHandler } from '../../../../types';

const notes = [
  'A Major',
  'B Major',
  'C Major',
  'D Major',
  'E Major',
  'F Major',
  'G Major',
];

const notes2 = [
  'A# Major',
  'B# Major',
  'C# Major',
  'D# Major',
  'E# Major',
  'F# Major',
  'G# Major',
];

const notes3 = [
  'A♭ Major',
  'B♭ Major',
  'C♭ Major',
  'D♭ Major',
  'E♭ Major',
  'F♭ Major',
  'G♭ Major',
];

const notes4 = [
  'A Minor',
  'B Minor',
  'C Minor',
  'D Minor',
  'E Minor',
  'F Minor',
  'G Minor',
];

const emptyNotes = ['', '', '', '', '', '', ''];
// const symbols = [
//   {
//     name: '',
//   },
//   {
//     name: '#',
//     img: sharp,
//   },
//   {
//     name: '♭',
//     img: bimol,
//   },
// ];

export default function ChordOptions({ handleOptionClick, level }: { handleOptionClick: OptionClickHandler; level: Level }) {
  return (
    // <div className='small-btn-wrapper' style={{ gridColumnGap: '4px' }}>
    //   {symbols.map((symbol, index) =>
    //     notes.map((note, idx) =>
    //       (level == 'easy' && index > 0) || (level == 'medium' && index > 1) ? (
    //         <div key={note} className='option-blank'></div>
    //       ) : (
    //         <button
    //           key={idx}
    //           onClick={() => handleOptionClick(note + symbol.name)}
    //           className='option-btn small-btn'
    //         >
    //           <span>{note}</span>
    //           {index != 0 ? <img src={symbol.img} /> : null}
    //         </button>
    //       )
    //     )
    //   )}
    // </div>
    <div>
      <div className='small-btn-wrapper'>
        {notes.map((note, index) => (
          <button
            className='option-btn small-btn xsmall-font'
            onClick={() => handleOptionClick(note)}
            key={index}
          >
            {note}
          </button>
        ))}
      </div>

      {level === 'medium' || level === 'hard' ? (
        <>
          <div className='small-btn-wrapper'>
            {notes2.map((note, index) => (
              <button
                className='option-btn small-btn xsmall-font'
                onClick={() => handleOptionClick(note)}
                key={index}
              >
                {note}
              </button>
            ))}
          </div>

          <div className='small-btn-wrapper'>
            {notes3.map((note, index) => (
              <button
                className='option-btn small-btn xsmall-font'
                onClick={() => handleOptionClick(note)}
                key={index}
              >
                {note}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className='small-btn-wrapper'>
          {emptyNotes.map((note, index) => {
            return (
              <div key={index} className='option-blank'>
                {note}
              </div>
            );
          })}
        </div>
      )}

      {level === 'hard' ? (
        <div className='small-btn-wrapper'>
          {notes4.map((note, index) => (
            <button
              className='option-btn small-btn xsmall-font'
              onClick={() => handleOptionClick(note)}
              key={index}
            >
              {note}
            </button>
          ))}
        </div>
      ) : (
        <div className='small-btn-wrapper'>
          {emptyNotes.map((note, index) => {
            return (
              <div key={index} className='option-blank'>
                {note}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
