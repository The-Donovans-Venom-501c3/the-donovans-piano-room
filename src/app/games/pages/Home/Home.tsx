import React, { useEffect } from 'react';
import { Button } from './button';
const ScaleIdentification = '/games/HomeScaleIdentification.svg';
const HoverScaleIdentification = '/games/HoverScaleIdentification.svg';
const IntervalIdentification = '/games/HomeIntervalIdentification.svg';
const HoverIntervalIdentification = '/games/HoverIntervalIdentification.svg';
const ChordIdentification = '/games/HomeChordIdentification.svg';
const HoverChordIdentification = '/games/HoverChordIdentification.svg';
const VirtualPiano = '/games/HomeVirtualPiano.svg';
const HoverVirtualPiano = '/games/HoverVirtualPiano.svg';
const yellowGuy = '/games/yellowGuy.svg';
const light = '/games/HomePageLight.svg';

import { useSetAtom } from 'jotai';
import {
  appStateAtom,
  gameStateAtom,
  loadingStateAtom,
  quizStateAtom,
  scoreAtom,
  livesAtom,
  questionAtom,
} from '../../../../store/atoms';

export default function Home() {
  const setAppState = useSetAtom(appStateAtom);
  const setGameState = useSetAtom(gameStateAtom);
  const handleClick = (game: import('../../types').GameType) => {
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
  }, [setLivesAtom, setLoadingState, setQuestion, setQuizState, setScoreAtom]);

  return (
    <div className='background-set'>
      <div className='whole-page-layout'>
        <div className='contentContainer'>
          <img src={light} alt='homePageLight' id='light-background' />
          {/* <img src={bubbles} alt='HomePageBubble' id='homePageBubble' /> */}

          {/* Bubbles animation */}
          <div className='bubble1'></div>
          <div className='bubble2'></div>
          <div className='bubble3'></div>
          <div className='bubble4'></div>
          <div className='bubble5'></div>
          <div className='bubble6'></div>
          <div className='bubble7'></div>
          <div className='bubble8'></div>
          <div className='bubble9'></div>
          <div className='bubble10'></div>
          <div className='bubble11'></div>
          <div className='bubble12'></div>
          <div className='bubble13'></div>
          <div className='bubble14'></div>
          <div className='contentContainer_center'>
            <img src={yellowGuy} alt='little yelow creature' id='yellowGuy' />

            <div className='text'>
              <p id='white-tips'>
                Let&apos;s take <span id='orange-tips'> a </span>{' '}
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

        <div></div>
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
          <Button
            icon={IntervalIdentification}
            hoverIcon={HoverIntervalIdentification}
            title='Interval identification'
            tips='Identify the interval on the staff'
            hoverColor='#F6AD69'
            hoverBorderColor='#E98427'
            onClick={() => handleClick('interval')}
          />
          <Button
            icon={ScaleIdentification}
            hoverIcon={HoverScaleIdentification}
            title='Chord identification'
            tips='Identify the Scale on the staff'
            hoverColor='#D8BCFD'
            hoverBorderColor='#C986FA'
            onClick={() => handleClick('chord')}
          />
          <Button
            icon={VirtualPiano}
            hoverIcon={HoverVirtualPiano}
            title='Ledger Line Addition'
            tips='Identify the ledger line on the staff'
            hoverColor='#75C973'
            hoverBorderColor='#519750'
            onClick={() => handleClick('ledger')}
          />
          <Button
            icon={VirtualPiano}
            hoverIcon={HoverVirtualPiano}
            title='Music is Reading'
            tips='Identify the missing letters on the staff'
            hoverColor='#F6AD69'
            hoverBorderColor='#E98427'
            onClick={() => handleClick('reading')}
          />
        </div>
      </div>
    </div>
  );
}
