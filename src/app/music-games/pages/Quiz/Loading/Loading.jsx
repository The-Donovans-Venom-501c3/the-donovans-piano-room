import React, { useEffect } from 'react';
import './Loading.scss';
import character from '../../../assets/svg/Character_Loading.svg';
import baseCharacter from '../../../assets/svg/Character_Ellipse.svg';

import { useSetAtom } from 'jotai';
import { loadingStateAtom, quizStateAtom } from '../../../store/atoms';
export default function Loading() {
  const setLoadingState = useSetAtom(loadingStateAtom);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoadingState('quiz');
    }, 5800);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className='loadingContainer'>
      <div className='loading'>
        <div className='characterContainer'>
          <img id='character' src={character} />
          <img id='baseCharacter' src={baseCharacter} />
        </div>

        <section>
          <h1>Get Ready for Awesomeness!</h1>
          <p>For each mission, you will be shown a music note.</p>
          <p>Choose one correct answer from options given.</p>
        </section>
        <section>
          {/* <span>Directing you to the game in a minute...</span> */}
          <span>Switch to Fullscreen mode for the best experience...</span>
          <div className='loader'>
            <div className='circle'>
              <div className='shine'></div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
