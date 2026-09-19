import './Popup.scss';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  popupAtom,
  quizStateAtom,
  timerOnAtom,
  musicStateAtom,
} from '../../../../../store/atoms';
import { useEffect } from 'react';

const start = '/games/Start.svg';
const pause = '/games/Pause.svg';

const popupData = {
  play: {
    class: 'start',
    state: 'resumed',
    sentence: 'Enjoy and have fun!',
    pic: start,
  },
  pause: {
    class: 'pause',
    state: 'paused',
    sentence: 'Click anywhere to resume',
    pic: pause,
  },
};

export default function Popup() {
  const setQuizState = useSetAtom(quizStateAtom);
  const setPopupState = useSetAtom(popupAtom);
  const popupValue = useAtomValue(popupAtom);

  const currentPopup = popupData[popupValue] || popupData.pause;

  const handleResume = () => {
    setPopupState('play');
    setTimeout(() => {
      setQuizState('quiz');
    }, 300);
  };

  useEffect(() => {
    if (popupValue === 'play') {
      const timeout = setTimeout(() => {
        setQuizState('quiz');
      }, 0);

      return () => clearTimeout(timeout);
    }
  }, [popupValue, setQuizState]);

  return (
    <div className='popup-backdrop' onClick={handleResume}>
      <div className='popup-card'>
        <div className={`status-icon ${currentPopup.class}`}>
          <img src={currentPopup.pic} alt="Game status" />
        </div>
        <div className='popup-text'>
          <h3>Game is {currentPopup.state}</h3>
          <p>{currentPopup.sentence}</p>
        </div>
      </div>
    </div>
  );
}