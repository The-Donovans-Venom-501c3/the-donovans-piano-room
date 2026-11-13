import React, { useEffect } from 'react';
import './Dialogs.scss';
const character = '/games/PlayAgain_Character.svg';
import { useSetAtom } from 'jotai';
import {
  appStateAtom,
  gameFinishedAtom,
  scoreAtom,
  affirmationAtom,
  correctOptionAtom,
  questionAtom,
  livesAtom,
} from '@/store/game-atoms';

export default function PlayAgainDialog() {
  const setAppState = useSetAtom(appStateAtom);
  const setGameFinished = useSetAtom(gameFinishedAtom);
  const setScore = useSetAtom(scoreAtom);
  const setAffirmationAtom = useSetAtom(affirmationAtom);
  const setCorrectOptionAtom = useSetAtom(correctOptionAtom);
  const setQuestionNum = useSetAtom(questionAtom);
  const setLives = useSetAtom(livesAtom);

  const handlePlayAgain = () => {
    setAppState('welcome');
    //reset page
    setGameFinished('score');
    setScore(0);
    setAffirmationAtom('');
    setCorrectOptionAtom('');
    setQuestionNum(1);
    setLives(3);
  };

  const handleSeeOtherGames = () => {
    setAppState('home');
    //reset page
    setGameFinished('score');
    setScore(0);
    setAffirmationAtom('');
    setCorrectOptionAtom('');
    setQuestionNum(1);
    setLives(3);
  };

  return (
    <div className='wrapper'>
      <div className='content play-again centralized'>
        <img src={character} alt='Character' className='character' />
        <div className='quote centralized'>
          <p>
            “Musicians <strong>don&apos;t retire</strong> they stop when there&apos;s no
            more music in them.”
          </p>
          <span>- Louis Armstrong</span>
        </div>
        <div className='button-container centralized'>
          <button onClick={() => handlePlayAgain()} className='primary'>
            PLAY AGAIN
          </button>
          <button onClick={() => handleSeeOtherGames()} className='secondary'>
            SEE OTHER GAMES
          </button>
          <button
            onClick={() => {
              window.location.href =
                'https://thedonovanspianoroom.com/bookshelf/';
            }}
            className='secondary'
          >
            SEE MY LESSONS
          </button>
        </div>
      </div>
    </div>
  );
}
