import "./QuizSection.scss";
import questionmark from "../../assets/svg/QuestionMark.svg";
import Options from "./Options/Options";
import { useMemo, useState } from "react";
import { useAtomValue, useSetAtom, useAtom } from "jotai";
import {
  affirmationAtom,
  correctOptionAtom,
  gameStateAtom,
  levelStateAtom,
  livesAtom,
  questionAtom,
  quizStateAtom,
  totalQuestionsAtom,
  scoreAtom,
  appStateAtom,
  resetTimerAtom,
} from "../../store/atoms";
import { getQuestions } from "../../utils/questions";

const QuizSection = () => {
  const game = useAtomValue(gameStateAtom);
  const level = useAtomValue(levelStateAtom);
  const resetTimer = useAtomValue(resetTimerAtom);
  const [questionNum, setQuestionNum] = useAtom(questionAtom);

  const questions = useMemo(() => getQuestions(game, level), [resetTimer]);

  const currQuestion = questions[questionNum - 1];

  const setTotalQuestions = useSetAtom(totalQuestionsAtom);
  const totalQuestions = useMemo(() => {
    return questions.length;
  }, [questions]);
  setTotalQuestions(totalQuestions);

  const setCorrectOption = useSetAtom(correctOptionAtom);
  setCorrectOption(currQuestion.correctOption);

  const setQuizState = useSetAtom(quizStateAtom);
  const setAffirmation = useSetAtom(affirmationAtom);
  const setScore = useSetAtom(scoreAtom);
  const setAppState = useSetAtom(appStateAtom);

  const lives = useAtomValue(livesAtom);

  const handleOptionClick = (option) => {
    if (option === currQuestion.correctOption) {
      if (level !== "hard") {
        setAffirmation("success");
        setQuizState("affirmation");
      } else {
        setScore((prev) => prev + 1);
        if (questionNum === totalQuestions) {
          setAppState("game-finished");
          setQuestionNum(1);
        } else {
          setQuestionNum(questionNum + 1);
        }
      }
    } else if (option && lives > 1) {
      setAffirmation("tryAgain");
      setQuizState("affirmation");
    } else {
      setAffirmation("fail");
      setQuizState("affirmation");
      setQuestionNum(1);
    }
  };

  const displayTextIdx = { note: 0, key: 1, "major-minor": 2, scale: 3 };
  const displayTextArr = [
    "What note is shown?",
    "What key signature is shown?",
    "What  major/minor is shown?",
    "What scale is shown?",
  ];

  const displayText = displayTextArr[displayTextIdx[game]];

  return (
    <div className="quizSection">
      <div className="quizNumber">
        <img src={questionmark} />
        <span>{questionNum}</span>
        <span>of</span>
        <span>{totalQuestions}</span>
      </div>
      <div className="noteQuestionnGraph">
        <img src={currQuestion.questionImage} />
      </div>
      <div className="questionText">
        <p>{displayText}</p>
        <Options handleOptionClick={handleOptionClick} />
      </div>
    </div>
  );
};
export default QuizSection;
