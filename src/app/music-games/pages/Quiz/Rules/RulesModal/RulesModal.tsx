import "./RulesModal.scss";
import x from "../../../../assets/svg/X.svg";
import { useSetAtom, useAtomValue } from "jotai";
import {
  quizStateAtom,
  gameStateAtom,
  timerOnAtom,
} from "../../../../store/atoms";

const rulesData = {
  note: {
    Introduction:
      "Hey Superstars! Get ready for musical fun. Identify the note on the staff and move to the next level, with fewer than three mistakes. Learn note basics and become a pro!",
    Explanation: [
      "Hey there, Musicstars! Ready to dive into some musical fun? Playing this game is a breeze! Your mission, should you choose to accept it, is to figure out which musical note is being displayed on the staff. 🎵",
      "Don't fret - you've got three lives to make your way through to the next level. 🕺🏼💃🏼",
      "As you groove along with the game, you'll pick up the basics of musical notes and become a pro at identifying them. 🎶",
      "For the medium and Hard Levels, you'll have less time to answer questions. For MEDIUM you'll have 10 seconds to answer your questions, for HARD, you have only 5 seconds to answer! ",
    ],
  },
  scale: {
    Introduction:
      "Wanna Play? Let's have some musical fun. Identify the Scale on the staff by recognizing the sharps and flats of the scale. Move to the next level, with fewer than three mistakes. Maximize your knowledge of scales and become a pro!",
    Explanation: [
      "Identify the Scale on the staff by recognizing the sharps and flats of the scale.",
      "Don't fret - you've got three lives to make your way through to the next level. 🕺🏼💃🏼",
      "As you groove along with the game, you'll pick up more experience with scales and their key signatures, you will become a pro at identifying them!",
      "For the medium and Hard Levels, you'll have less time to answer questions. For MEDIUM you'll have 10 seconds to answer your questions, for HARD, you have only 5 seconds to answer!",
    ],
  },
  key: {
    Introduction:
      "Party time!! Shall we partake in a musical game? Identify the Key signature by counting the Sharps or Flats. Move to the next level, with fewer than three mistakes. Learn Key signatures and become a pro!",
    Explanation: [
      "Identify the Key signature by counting the Sharps or Flats.",
      "The core task is to recognize and identify the key signature displayed. The player is prompted to count the number of sharps or flats present in the key signature. In music notation, key signatures are symbols that indicate the key of a piece and the alterations to be made to certain notes.",
      "Don't fret - you've got three lives to make your way through to the next level. 🕺🏼💃🏼",
      "As you groove along with the game, you'll pick up more experience with scales and their key signatures, you will become a pro at identifying them!",
      "For the medium and Hard Levels, you'll have less time to answer questions. For MEDIUM you'll have 10 seconds to answer your questions, for HARD, you have only 5 seconds to answer! ",
    ],
  },
  "major-minor": {
    Introduction:
      "Hey Superstars! Get ready for musical fun. Identify the whether the scale on the staff is Major, natural, harmonic, or melodic minor to move to the next level, with fewer than three mistakes. Learn Scale quality and become a pro!",

    Explanation: [
      "Are you able to decipher whether a scale is major or minor- natural, melodic, or harmonic? Use the key signature as well as well as any additional accidentals to determine your answer.  Move to the next level, with fewer than three mistakes. Maximize your knowledge of scales and become a pro!",
      "Don't fret - you've got three lives to make your way through to the next level. 🕺🏼💃🏼",
      "As you groove along with the game, you'll pick up more experience with scales and their key signatures, you will become a pro at identifying them!",
      "For the medium and Hard Levels, you'll have less time to answer questions. For MEDIUM you'll have 10 seconds to answer your questions, for HARD, you have only 5 seconds to answer! ",
    ],
  },
  interval: {
    Introduction:
      "Let the GAMES BEGIN! Identify the TRIAD on the staff by recognizing the distance between the notes and the intervals. Move to the next level, with fewer than three mistakes. Maximize your knowledge of scales and become a pro!",

    Explanation: [
      "WOAHHHH? ITS SHOW TIME. Identify the interval on the staff by recognizing the distance between two notes. Move to the next level, with fewer than three mistakes. Maximize your knowledge of scales and become a pro!",
    ],
  },
};

const RulesModal = () => {
  const game = useAtomValue(gameStateAtom);
  const setTimerOn = useSetAtom(timerOnAtom);
  const setQuizState = useSetAtom(quizStateAtom);

  const ruleTitle = game.charAt(0).toUpperCase() + game.slice(1);

  const renderExplanation = rulesData[game].Explanation.map(
    (paragraph, index) => {
      return (
        <li key={index} className="rules-paragraph">
          {paragraph}
        </li>
      );
    }
  );
  const handleCloseModal = () => {
    setTimerOn(true);
    setQuizState("quiz");
  };

  return (
    <div>
      <div className="rules-overlay"></div>
      <div className="rules-container">
        <button className="btn-exit" onClick={handleCloseModal}>
          <img src={x} alt="Close Icon" className="x-icon" />
        </button>
        <h2 className="rules-title">{ruleTitle} Rule</h2>

        <section className="rules-section">
          <h3 className="rules-header">Introduction:</h3>
          <p className="rules-paragraph">{rulesData[game].Introduction}</p>
        </section>

        <section>
          <h3 className="rules-header">Explanation:</h3>

          {renderExplanation}
        </section>
      </div>
    </div>
  );
};

export default RulesModal;
