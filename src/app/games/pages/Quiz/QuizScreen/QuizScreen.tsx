import "./QuizScreen.scss";
const music = '/games/Music_stand.svg';
const cat = '/games/Cat.svg';
const x = '/games/X.svg';
const pause = '/games/Pause.svg';
const play = '/games/Icon_Play.svg';
const restart = '/games/Restart.svg';
const questionMark = '/games/QuestionMark.svg';
import GameFeatures from "../../../components/GameFeatures/GameFeatures";
import QuizSection from "../../../components/QuizSection/QuizSection";
import { useAtom, useSetAtom, useAtomValue } from "jotai";
import { useEffect, useRef, useState } from "react";
import {
  overlayAtom,
  quizStateAtom,
  timerOnAtom,
  popupAtom,
  musicStateAtom,
  questionAtom,
  gameStateAtom,
} from "../../../../../store/atoms";

const cheerup_dialogs = [
  "Practice makes Perfect!",
  "Keep Going",
  "You've got this!",
];

const QuizScreen = () => {
  const [quizState, setQuizState] = useAtom(quizStateAtom);
  const [popup, setPopup] = useAtom(popupAtom);
  const setOverlay = useSetAtom(overlayAtom);
  const [timerOn, setTimerOn] = useAtom(timerOnAtom);
  const [musicOn, setMusicOn] = useAtom(musicStateAtom);
  const [currentDialogIndex, setCurrentDialogIndex] = useState<number | null>(null);
  const [showBubble, setShowBubble] = useState(false);
  const [questionNum, setQuestionNum] = useAtom(questionAtom);
  const gameState = useAtomValue(gameStateAtom);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    if (questionNum % 5 === 0) {
      const intervalId = setInterval(() => {
        const newIndex = Math.floor(Math.random() * cheerup_dialogs.length);
        setCurrentDialogIndex(newIndex);
        setShowBubble(true);
        setTimeout(() => setShowBubble(false), 1000);
      }, 2000);
      intervalRef.current = intervalId;
      return () => clearInterval(intervalId);
    } else {
      if (!!intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  }, [questionNum]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleExit = () => {
    setOverlay("exit");
    setQuizState("overlay");
  };

  const handlePause = () => {
    setTimerOn(!timerOn);
    setPopup("pause");
    setQuizState("popup");
    setMusicOn(false);
  };

  const handleRestart = () => {
    setOverlay("restart");
    setQuizState("overlay");
  };

  const handleRuleModal = () => {
    setTimerOn(false);
    setQuizState("rules");
  };

  const gameScreenStyle: React.CSSProperties = {};

  if (gameState === "chord" || gameState === "scale") {
    gameScreenStyle.bottom =
        windowWidth < 1280
        ? "1rem"
        : windowWidth < 1380
        ? "3rem"
        : windowWidth < 1536
        ? "5rem"
        : windowWidth > 1700
        ? "9rem"
        : undefined;
  }

  const gameFeatures: React.CSSProperties = {}
  if(gameState === "chord"){
    gameFeatures.paddingBottom = "45px";

  }
  useEffect(() => {
    if (quizState !== "quiz") {
      setTimerOn(false);
    } else {
      setTimerOn(true);
    }
  }, [quizState, setTimerOn]);

  return (
    <div className="QuizScreenContainer">
      {/* Bubbles animation */}
      <div className="bubble1"></div>
      <div className="bubble2"></div>
      <div className="bubble3"></div>
      <div className="bubble4"></div>
      <div className="bubble5"></div>
      <div className="bubble6"></div>
      <div className="bubble7"></div>
      <div className="bubble8"></div>
      <div className="bubble9"></div>
      <div className="bubble10"></div>
      <div className="bubble11"></div>
      <div className="bubble12"></div>
      <div className="bubble13"></div>
      <div className="bubble14"></div>
      <div className="musicStand">
        <img id="music" src={music} width="100%" height="100%" alt="Music stand" />
      </div>

      <div className="GameScreen" style={gameScreenStyle}>
        <div className="catConatiner">
          {showBubble && (
            <div id="chat_bubble" className="fade-in">
              <h4 id="chat_bubble_text">
                {currentDialogIndex === null ? '' : cheerup_dialogs[currentDialogIndex]}
              </h4>
            </div>
          )}
          <img id="cat" src={cat} alt="Game character" />
        </div>
        <div className="setting">
          <button className="btnIcon" onClick={handleRuleModal}>
            <img className="icon-questionMark" src={questionMark} alt="Rules" />
          </button>

          <button className="btnSetting btnRestart" onClick={handleRestart}>
            <img src={restart} alt="Restart" />
            <span>RESTART</span>
          </button>
          <button className="btnSetting btnPause" onClick={handlePause}>
            <img src={timerOn ? pause : play} alt={timerOn ? 'Pause' : 'Play'} />
            <span>{timerOn ? "PAUSE" : "PLAY"}</span>
          </button>
          <button
            className="
          btnExit"
            onClick={handleExit}
          >
            <img className="icon-x" src={x} alt="x" />
          </button>
        </div>
        <div className="gameMain" style={gameFeatures}>
          <div className="left">
            <GameFeatures />
            <div className="line"></div>
          </div>
          <div className="right">
            <QuizSection />
          </div>
        </div>
      </div>
    </div>
  );
};
export default QuizScreen;
