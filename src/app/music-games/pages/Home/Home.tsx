import React, { useEffect } from 'react';
import { Button } from './button';
import ScaleIdentification from '../../assets/svg/HomeScaleIdentification.svg';
import HoverScaleIdentification from '../../assets/svg/HoverScaleIdentification.svg';
import IntervalIdentification from '../../assets/svg/HomeIntervalIdentification.svg';
import HoverIntervalIdentification from '../../assets/svg/HoverIntervalIdentification.svg';
import ChordIdentification from '../../assets/svg/HomeChordIdentification.svg';
import HoverChordIdentification from '../../assets/svg/HoverChordIdentification.svg';
import VirtualPiano from '../../assets/svg/HomeVirtualPiano.svg';
import HoverVirtualPiano from '../../assets/svg/HoverVirtualPiano.svg';
import yellowGuy from '../../assets/svg/yellowGuy.svg';
import light from '../../assets/svg/HomePageLight.svg';
import bubbles from '../../assets/svg/HomePageBubble.svg';

import { useSetAtom } from 'jotai';
import {
  appStateAtom,
  gameStateAtom,
  loadingStateAtom,
  quizStateAtom,
  scoreAtom,
  livesAtom,
  questionAtom,
} from '../../store/atoms';

export default function Home() {
  const setAppState = useSetAtom(appStateAtom);
  const setGameState = useSetAtom(gameStateAtom);
  const handleClick = (game) => {
    setGameState(game);
    setAppState('welcome');
  };

  // Reset all states to default
  const setLoadingState = useSetAtom(loadingStateAtom);
  const setQuizState = useSetAtom(quizStateAtom);
  const setScoreAtom = useSetAtom(scoreAtom);
  const setLivesAtom = useSetAtom(livesAtom);
  const setQuestion = useSetAtom(questionAtom);

  useEffect(() => {
    setLoadingState('loading');
    setQuizState('quiz');
    setScoreAtom(0);
    setLivesAtom(3);
    setQuestion(1);
  }, []);

  return (
    <div className='background-set'>
      <div className='whole-page-layout'>
        <div className='contentContainer'>
          <img src={light} alt='homePageLight' id='light-background' />
          <img src={bubbles} alt='HomePageBubble' id='homePageBubble' />
          <div className='contentContainer_center'>
            <img src={yellowGuy} alt='little yelow creature' id='yellowGuy' />

            <div className='text'>
              <p id='white-tips'>
                Let's take <span id='orange-tips'> a </span>{' '}
              </p>
              <br></br>
              <p id='orange'>game break!</p>
            </div>
            {/* <h1 className="orange">game break!</h1> */}
            <div className='text-small'>
              <p>Test your skills with engaging games that</p>
              <p>challenge your memory and rhythm recognition</p>
              <p>while having some musical fun.</p>
            </div>
            <p id='home-page-tips'>
              Please switch to Fullscreen mode for best user experience!
            </p>
          </div>
        </div>

        <div className='buttonContainer'>
          <Button
            icon={VirtualPiano}
            hoverIcon={HoverVirtualPiano}
            title='Note identification'
            tips='Identify the Note on the staff'
            hoverColor='#75C973'
            hoverBorderColor='#519750'
            onClick={() => handleClick('note')}
          />
          <Button
            icon={IntervalIdentification}
            hoverIcon={HoverIntervalIdentification}
            title='Key Signature identification'
            tips='Identify the Key Signature on the staff'
            hoverColor='#F6AD69'
            hoverBorderColor='#E98427'
            onClick={() => handleClick('key')}
          />
          <Button
            icon={ChordIdentification}
            hoverIcon={HoverChordIdentification}
            title='Major-Minor identification'
            tips='Identify the Major/Minor on the staff'
            hoverColor='#F8D867'
            hoverBorderColor='#E9BB18'
            onClick={() => handleClick('major-minor')}
          />
          <Button
            icon={ScaleIdentification}
            hoverIcon={HoverScaleIdentification}
            title='Scale identification'
            tips='Identify the Scale on the staff'
            hoverColor='#D8BCFD'
            hoverBorderColor='#C986FA'
            onClick={() => handleClick('scale')}
          />
        </div>
      </div>
    </div>
  );
}
