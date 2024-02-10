import React from 'react';
import { useAtomValue, useSetAtom, useAtom } from 'jotai';
import {
  affirmationAtom,
  appStateAtom,
  correctOptionAtom,
  livesAtom,
  overlayAtom,
  questionAtom,
  quizStateAtom,
  scoreAtom,
  totalQuestionsAtom,
} from '../../../store/atoms';
import successCharacter from '../../../assets/svg/Affirmation_Success_Character.svg';
import failCharacter from '../../../assets/svg/Affirmation_Fail_Character.svg';
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

export default function Affirmation() {
  const affirmation = useAtomValue(affirmationAtom);
  const { sentence, buttonText, bgColor, pic } =
    affirmationData[affirmation] || {};

  const [questionNum, setQuestionNum] = useAtom(questionAtom);
  const setQuizState = useSetAtom(quizStateAtom);
  const totalQuestions = useAtomValue(totalQuestionsAtom);
  const setAppState = useSetAtom(appStateAtom);
  const setScore = useSetAtom(scoreAtom);
  const [lives, setLives] = useAtom(livesAtom);
  const setOverlay = useSetAtom(overlayAtom);
  const correctOption = useAtomValue(correctOptionAtom);

  const handleResponseBtn = () => {
    if (affirmation == 'success') {
      setScore((prev) => prev + 1);
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
          <img src={pic} className='beater' />
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
          <img src={pic} className='beater' />
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
          <img src={pic} className='beater' />
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
