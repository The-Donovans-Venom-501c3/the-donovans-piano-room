import sharp from '../../../../assets/svg/SharpSymbol.svg';
import bimol from '../../../../assets/svg/BimolSymbol.svg';

const notes = ['C#', 'D', 'E', 'F', 'G', 'A', 'B'];
const notes2 = ['C♭', 'D♭', 'E♭', 'F#', 'G♭', 'A♭', 'B♭'];

export default function KeyOptions({ handleOptionClick }) {
  return (
    <div className='small-btn-wrapper' style={{ marginTop: 50 }}>
      {notes.map((note, index) => (
        <button
          className='option-btn small-btn'
          onClick={() => handleOptionClick(note)}
          key={index}
        >
          {note[0]}
          {note == 'C#' ? <img src={sharp}></img> : null}
        </button>
      ))}

      {notes2.map((note, index) => (
        <button
          className='option-btn small-btn'
          onClick={() => handleOptionClick(note)}
          key={index}
        >
          {note[0]}
          {note == 'F#' ? <img src={sharp}></img> : <img src={bimol}></img>}
        </button>
      ))}
    </div>
  );
}
