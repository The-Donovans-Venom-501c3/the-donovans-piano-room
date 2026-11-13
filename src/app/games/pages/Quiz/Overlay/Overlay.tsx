import "./Overlay.scss";
import { useAtomValue, useSetAtom } from "jotai";
import {
  appStateAtom,
  overlayAtom,
  quizStateAtom,
  scoreAtom,
  livesAtom,
  questionAtom,
  resetTimerAtom,
} from "@/store/game-atoms";

const cryingCat = '/games/cryingCat.svg';
const BrokenCat = '/games/BrokenCat.svg';
const sadCat = '/games/sadCat.svg';

const overlay = {
  exit: {
    cat: BrokenCat,
    question: "Are you sure you want to exit?",
    sentence: "Exiting the game before you finish will reset your progress.",
    id_btn: "btn-red",
    white_btn_txt: "KEEP PLAYING",
    colour_btn_txt: "EXIT",
  },
  lives: {
    cat: cryingCat,
    question: "You ran out of lives!",
    sentence: "Let’s review your lessons and try again tomorrow.",
    id_btn: "btn-purple",
    white_btn_txt: "SEE OTHER GAMES",
    colour_btn_txt: "REVIEW LESSONS",
  },
  restart: {
    cat: sadCat,
    question: "Are you sure you want to restart?",
    sentence: "Restarting the game before you finish will reset your progress.",
    id_btn: "btn-orange",
    white_btn_txt: "KEEP PLAYING",
    colour_btn_txt: "RESTART",
  },
};

export default function Overlay() {
  const overlayState = useAtomValue(overlayAtom);
  const setAppState = useSetAtom(appStateAtom);
  const setQuizState = useSetAtom(quizStateAtom);

  const setScoreAtom = useSetAtom(scoreAtom);
  const setLivesAtom = useSetAtom(livesAtom);
  const setQuestion = useSetAtom(questionAtom);
  const setResetTimer = useSetAtom(resetTimerAtom);

  const currentOverlay = overlay[overlayState] || overlay.exit;

  const handleButton1 = () => {
    if (overlayState === "lives") {
      setAppState("home");
    } else {
      setQuizState("quiz");
    }
  };

  const handleButton2 = () => {
    if (overlayState === "lives") {
      window.location.href = "/bookshelf/";
    } else if (overlayState === "exit") {
      setAppState("home");
    } else {
      setScoreAtom(0);
      setLivesAtom(3);
      setQuestion(1);
      setResetTimer((prev) => prev + 1);
      setQuizState("quiz");
    }
  };

  return (
    <div className="overlay-backdrop">
      <div className="overlay-modal">
        <div className="mascot-container">
          <img src={currentOverlay.cat} alt="Game character status" />
        </div>
        <div className="overlay-text">
          <h2>{currentOverlay.question}</h2>
          <p>{currentOverlay.sentence}</p>
        </div>
        <div className="overlay-actions">
          <button className="btn-pill btn-white" onClick={handleButton1}>
            {currentOverlay.white_btn_txt}
          </button>
          <button
            className={`btn-pill ${currentOverlay.id_btn}`}
            onClick={handleButton2}
          >
            {currentOverlay.colour_btn_txt}
          </button>
        </div>
      </div>
    </div>
  );
}