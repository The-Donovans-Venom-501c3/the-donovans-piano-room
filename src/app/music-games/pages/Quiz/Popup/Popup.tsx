import './Popup.scss';
import start from '../../../assets/svg/Start.svg';
import pause from '../../../assets/svg/Pause.svg';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  popupAtom,
  quizStateAtom,
  timerOnAtom,
  musicStateAtom,
} from '../../../store/atoms';
import { useEffect } from 'react';

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
    sentence: 'Click the Play button to resume the game',
    pic: pause,
  },
};

export default function Popup() {
  const setQuizState = useSetAtom(quizStateAtom);
  const setMusicOn = useSetAtom(musicStateAtom);
  const timerOn = useAtomValue(timerOnAtom);
  const popupState = useSetAtom(popupAtom);
  const popupValue = useAtomValue(popupAtom);

  const play = () => {
    popupState('play');
    setTimeout(() => {
      setQuizState('quiz');
      // setMusicOn(true);
    }, 1500);
  };
  useEffect(() => {
    if (popupState == 'play') {
      const timeout = setTimeout(() => {
        setQuizState('quiz');
      }, 0);

      return () => clearTimeout(timeout);
    }
  }, [timerOn]);

  return (
    <div className='toast' onClick={play}>
      <div className='toastContainer'>
        <div className={popupData[popupValue].class}>
          <img src={popupData[popupValue].pic} />
        </div>
        <div className='textDialog'>
          <span>Game is {popupData[popupValue].state}</span>
          <span>{popupData[popupValue].sentence}</span>
        </div>
      </div>
    </div>
  );
}
