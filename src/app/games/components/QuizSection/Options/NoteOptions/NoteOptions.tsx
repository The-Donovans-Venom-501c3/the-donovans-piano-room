import type { Level, OptionClickHandler } from '../../../../types';

const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

const symbols = [
  {
    name: '',
  },
  {
    name: '#',
  },
  {
    name: '♭',
  },
];

export default function NoteOptions({
  handleOptionClick,
  level,
  wrongOptions = [],
}: {
  handleOptionClick: OptionClickHandler;
  level: Level;
  wrongOptions?: string[];
}) {
  return (
    <div className='small-btn-wrapper'>
      {symbols.map((symbol, index) =>
        notes.map((note, idx) =>
          (level == 'easy' && index > 0) || (level == 'medium' && index > 1) ? (
            <div key={note} className='option-blank'></div>
          ) : (
            <button
              key={idx}
              onClick={() => handleOptionClick(note + symbol.name)}
              className={`option-btn small-btn ${wrongOptions.includes(note + symbol.name) ? 'wrong' : ''}`}
              disabled={wrongOptions.includes(note + symbol.name)}
            >
              <span>{note}</span>
              {index != 0 ? <img src={index === 1 ? '/games/SharpSymbol.svg' : '/games/BimolSymbol.svg'} alt={symbol.name} /> : null}
            </button>
          )
        )
      )}
    </div>
  );
}
