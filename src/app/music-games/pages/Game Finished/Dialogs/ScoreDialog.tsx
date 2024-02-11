import './Dialogs.scss';
import character from '../../../assets/svg/Score_Character.svg';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  gameFinishedAtom,
  scoreAtom,
  totalQuestionsAtom,
  seconds,
} from '../../../store/atoms';

const scoreState = {
  perfect: {
    heading: 'Amazing!',
    msg1: 'You have successfully finished this game.',
    msg2: 'Keep it up, SuperStar!',
  },
  high: {
    heading: 'Amazing!',
    msg1: 'You have successfully finished this game.',
    msg2: 'Keep practicing to get the highest score!',
  },
  low: {
    heading: 'Thank you for finishing this game.',
    msg1: 'Let’s keep practicing!',
    msg2: 'You might want to review the lessons, then try again next time. Let’s get minimum 80 to pass!',
  },
};

export default function ScoreDialog() {
  const setGameFinished = useSetAtom(gameFinishedAtom);
  const score = useAtomValue(scoreAtom);
  const totalQuestions = useAtomValue(totalQuestionsAtom);
  const timer = useAtomValue(seconds);

  const result = Math.floor((score / totalQuestions) * 100);
  const scoreData =
    scoreState[result == 100 ? 'perfect' : result > 80 ? 'high' : 'low'];

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    // const formattedMinutes = String(minutes).padStart(2, '0');
    // const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    return `${minutes} min ${seconds} sec`;
  };

  return (
    <div className='wrapper'>
      <div className='content score-dialog centralized'>
        <img src={character} alt='cat' className='cat' />
        <div className='centralized'>
          <h1 className='heading'>{scoreData.heading}</h1>
          <p className='message'>{scoreData.msg1}</p>
        </div>
        <section className='score-section centralized'>
          <span className='score'> SCORE: {result}</span>
          <span className='score-message'>{scoreData.msg2}</span>
          <span className='score-message'>
            TIME ELAPSED : {formatTime(timer)}
          </span>
        </section>
        <div className='button-container centralized'>
          <button
            className='primary'
            onClick={() => setGameFinished('end-game')}
          >
            CONTINUE
          </button>
        </div>
      </div>
    </div>
  );
}
