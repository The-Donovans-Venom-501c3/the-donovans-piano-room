import React, { useEffect } from 'react';
import './Loading.scss';
const character = '/games/Character_Loading.svg';
const baseCharacter = '/games/Character_Ellipse.svg';

import { useSetAtom } from 'jotai';
import { loadingStateAtom } from '../../../../../store/atoms';
export default function Loading() {
  const setLoadingState = useSetAtom(loadingStateAtom);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoadingState('loaded');
    }, 5800);

    return () => clearTimeout(timeout);
  }, [setLoadingState]);

  return (
    <div className='loadingContainer'>
      <div className='loading'>
        <div className='characterContainer'>
          <img id='character' src={character} alt='Loading character' />
          <img id='baseCharacter' src={baseCharacter} alt='Loading background' />
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
