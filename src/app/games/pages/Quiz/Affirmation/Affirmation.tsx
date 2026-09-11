import React from 'react';
import { useAtomValue, useSetAtom, useAtom } from 'jotai';
import {
  affirmationAtom,
  appStateAtom,
  livesAtom,
  overlayAtom,
  questionAtom,
  quizStateAtom,
  scoreAtom,
  totalQuestionsAtom,
  currentCorrectOptionAtom,
} from '../../../../../store/atoms';
const successCharacter = '/games/Affirmation_Success_Character.svg';
const failCharacter = '/games/sadCat.svg';
import './Affirmation.scss';

const affirmationData = {
  success: {
    sentence: 'Correct. Good job!',
    buttonText: 'CONTINUE',
    bgColor: '#CDE6CC',
    pic: successCharacter,
  },
  tryAgain: {
    sentence:
      "Oops, that's not the right answer. Sorry, we need to take one of your lives.",
    buttonText: 'TRY AGAIN',
    bgColor: '#F6E892',
    pic: failCharacter,
  },
  fail: {
    sentence: 'The correct answer is ',
    buttonText: 'CONTINUE',
    bgColor: '#FED2AA',
    pic: failCharacter,
  },
};

// Calculate how many points the user get per corrected question

export default function Affirmation() {
  const affirmation = useAtomValue(affirmationAtom);
  const { sentence, buttonText, bgColor, pic } =
    affirmationData[affirmation as keyof typeof affirmationData] || affirmationData.fail;

  const [questionNum, setQuestionNum] = useAtom(questionAtom);
  const setQuizState = useSetAtom(quizStateAtom);
  const totalQuestions = useAtomValue(totalQuestionsAtom);
  const setAppState = useSetAtom(appStateAtom);
  const [score, setScore] = useAtom(scoreAtom);
  const [lives, setLives] = useAtom(livesAtom);
  const setOverlay = useSetAtom(overlayAtom);
  const correctOption = useAtomValue(currentCorrectOptionAtom);

  const handleResponseBtn = () => {
    if (affirmation == 'success') {
      if (questionNum === totalQuestions) {
        setAppState('game-finished');
      } else {
        setQuestionNum(questionNum + 1);
        setQuizState('quiz');
      }
    } else if (affirmation == 'fail') {
      setOverlay('lives');
      setQuizState('overlay');
    } else {
      setLives(lives - 1);
      setQuizState('quiz');
    }
  };

  return (
    <div>
      {affirmation === 'tryAgain' ? (
        <div className='container'>
          <div className='overlay'></div>
          <img src={pic} className='beater' alt='Game character' />
          <div
            className='background-rectangle'
            style={{ backgroundColor: bgColor }}
          >
            <section className='tip-try-again'>{sentence}</section>
            <button
              className='ButtonResponse'
              id='ButtonResponse'
              onClick={handleResponseBtn}
            >
              {buttonText}
            </button>
          </div>
        </div>
      ) : affirmation === 'success' ? (
        <div className='container'>
          <div className='overlay'></div>
          <img src={pic} className='beater' alt='Game character' />
          <div
            className='background-rectangle'
            style={{ backgroundColor: bgColor }}
          >
            <section className='tip'>{sentence}</section>
            <button
              className='ButtonResponse'
              id='ButtonResponse'
              onClick={handleResponseBtn}
            >
              {buttonText}
            </button>
          </div>
        </div>
      ) : affirmation === 'fail' ? (
        <div className='container'>
          <div className='overlay'></div>
          <img src={pic} className='beater' alt='Game character' />
          <div
            className='background-rectangle'
            style={{ backgroundColor: bgColor }}
          >
            <section className='tip'>
              {sentence}
              <span>{correctOption}</span>
            </section>
            <button
              className='ButtonResponse'
              id='ButtonResponse'
              onClick={handleResponseBtn}
            >
              {buttonText}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
