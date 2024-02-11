import './Welcome.scss';
import cat from '../../assets/svg/Welcome_Character.svg';
import polygon from '../../assets/svg/Welcome_Polygon.svg';
import { appStateAtom, gameStateAtom, levelStateAtom } from '../../store/atoms';
import { useAtomValue, useSetAtom } from 'jotai';

export default function Welcome() {
  const game = useAtomValue(gameStateAtom);
  const setLevel = useSetAtom(levelStateAtom);
  const setAppState = useSetAtom(appStateAtom);

  const handleLevelClick = (level) => {
    setLevel(level);
    setAppState('quiz');
  };

  let gameHeading = '';
  let gameText = '';
  if (game === 'key') {
    gameHeading = 'Key Signature';
    gameText = 'key signature';
  } else {
    gameHeading = game.charAt(0).toUpperCase() + game.slice(1);
    gameText = game;
  }

  return (
    <div className='welcome-container'>
      <div className='welcome'>
        <h1>
          Welcome to the <span>{gameHeading} Identification Game</span>
        </h1>
        <main>
          <div className='intro'>
            <div className='bubble'>
              <div className='chat'>
                <p>
                  Hey Superstars! Get ready for musical fun. Identify the{' '}
                  {gameText} on the staff and move to the next level, with less
                  than three mistakes. Learn {gameText} basics and become a pro!
                </p>
                <p>Choose the level you want to play!</p>
              </div>
              <img src={polygon} />
            </div>
            <img src={cat} className='cat' alt='Crescendo' />
          </div>
          <div className='levels'>
            <button className='easy' onClick={() => handleLevelClick('easy')}>
              <p>Easy</p>
            </button>
            <button
              className='medium'
              onClick={() => handleLevelClick('medium')}
            >
              <p>Medium</p>
            </button>
            <button className='hard' onClick={() => handleLevelClick('hard')}>
              <p>Hard</p>
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
