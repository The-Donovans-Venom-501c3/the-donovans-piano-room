"use client";

import "./QuizSection.scss";
import Options from "./Options/Options";
import Affirmation from "../../pages/Quiz/Affirmation/Affirmation";
import { useEffect, useMemo, useState } from "react";
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
  currentCorrectOptionAtom,
  hasAnsweredWrongAtom,
} from "@/store/game-atoms";
import { getQuestions, normalizeGameKey, normalizeOptionString } from "../../utils/questions";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { Droppable } from "./Options/ReadingOptions/Droppable";
import type { GameType, OptionClickHandler } from "../../types";

const DEFAULT_LIVES = 3;

const QuizSectionReading = () => {
  const level = useAtomValue(levelStateAtom);
  const [questionNum, setQuestionNum] = useAtom(questionAtom);
  const questions = useMemo(() => getQuestions("reading", level), [level]);

  const currQuestion = questions[questionNum - 1] ?? questions[0];

  const setTotalQuestions = useSetAtom(totalQuestionsAtom);
  const totalQuestions = useMemo(() => questions.length, [questions]);
  useEffect(() => setTotalQuestions(totalQuestions), [setTotalQuestions, totalQuestions]);

  const setCorrectOptions = useSetAtom(correctOptionAtom);
  useEffect(() => setCorrectOptions(currQuestion.correctOption), [currQuestion.correctOption, setCorrectOptions]);

  const setQuizState = useSetAtom(quizStateAtom);
  const setAffirmation = useSetAtom(affirmationAtom);

  const setScore = useSetAtom(scoreAtom);
  const setAppState = useSetAtom(appStateAtom);
  const [hasAnsweredWrong, setHasAnsweredWrong] = useAtom(hasAnsweredWrongAtom);
  const setCurrentCorrectOption = useSetAtom(currentCorrectOptionAtom);

  const [lives, setLives] = useAtom(livesAtom); // was: useAtomValue(livesAtom)

  const sentence = (currQuestion.sentence ?? "").replace(" ", "  ");
  const sentenceParts = sentence.split("_");
  const numBlanks = sentenceParts.length - 1;
  const [parents, setParents] = useState(Array(numBlanks).fill(null));
  const [droppedNotes, setDroppedNotes] = useState(Array(numBlanks).fill(null));

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;
    if (!over || typeof over.id !== "string" || !over.id.startsWith("droppable")) {
      return;
    }

    const droppableIndex = parseInt(over.id.replace("droppable-", ""), 10);
    const updatedDroppedNotes = [...droppedNotes];
    updatedDroppedNotes[droppableIndex] = String(active.id).replace("draggable-", "");
    const updatedParents = [...parents];
    updatedParents[droppableIndex] = over.id;
    setParents(updatedParents);
    setDroppedNotes(updatedDroppedNotes);

    if (updatedDroppedNotes.filter((note) => note !== null).length === numBlanks) {
      setCurrentCorrectOption(currQuestion.correctOption);

      const correct =
        normalizeOptionString(updatedDroppedNotes.join(",")) ===
        normalizeOptionString(currQuestion.correctOption);

      if (correct) {
        if (!hasAnsweredWrong) {
          setScore((prevScore) => prevScore + Math.floor((1 / totalQuestions) * 100));
        }
        setHasAnsweredWrong(false);
        if (level !== "hard") {
          setAffirmation("success");
          setQuizState("affirmation");
        } else {
          if (questionNum === totalQuestions) {
            setAppState("game-finished");
            setQuestionNum(1);
          } else {
            setQuestionNum(questionNum + 1);
          }
        }
      } else {
        const remainingLives = lives - 1;
        setLives(remainingLives);
        if (remainingLives > 0) {
          setAffirmation("tryAgain");
          setQuizState("affirmation");
          setHasAnsweredWrong(true);
        } else {
          setAffirmation("fail");
          setQuizState("affirmation");
        }
      }
      setParents(Array(numBlanks).fill(null));
      setDroppedNotes(Array(numBlanks).fill(null));
    }
  };

  return (
    <div className="quizSection">
      <div className="quizNumber">
        <span>{questionNum}</span>
        <span>of</span>
        <span>{totalQuestions}</span>
      </div>
      <div className="noteQuestionnGraph">
        <img src={currQuestion.questionImage} alt="Question" />
      </div>
      <div className="questionText">
        <p>Can you find the missing letters?</p>
        <DndContext onDragEnd={handleDragEnd}>
          <div id="sentence">
            {sentenceParts.map((part, index) => (
              <span key={index}>
                {part}
                {index < sentenceParts.length - 1 && (
                  <Droppable id={`droppable-${index}`}>
                    {parents[index] === `droppable-${index}` ? droppedNotes[index] : "__"}
                  </Droppable>
                )}
              </span>
            ))}
          </div>
          <Options displayText="Can you find the missing letters?" currQuestion={currQuestion} />
        </DndContext>
      </div>

      <Affirmation />
    </div>
  );
};

const QuizSection = () => {
  const rawGame = useAtomValue(gameStateAtom);
  const game = normalizeGameKey(rawGame);

  const setLives = useSetAtom(livesAtom);
  const setScore = useSetAtom(scoreAtom);
  const setQuestionNum = useSetAtom(questionAtom);
  const setHasAnsweredWrong = useSetAtom(hasAnsweredWrongAtom);
  const setQuizState = useSetAtom(quizStateAtom);
  const setAffirmation = useSetAtom(affirmationAtom);
  const setCurrentCorrectOption = useSetAtom(currentCorrectOptionAtom);

  useEffect(() => {
    setLives(DEFAULT_LIVES);
    setScore(0);
    setQuestionNum(1);
    setHasAnsweredWrong(false);
    setQuizState("quiz");
    setAffirmation("");
    setCurrentCorrectOption("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game]);

  if (game === "reading") {
    return <QuizSectionReading />;
  }

  return <QuizSectionStandard game={game} />;
};

const QuizSectionStandard = ({ game: rawGame }: { game: GameType }) => {
  const game = normalizeGameKey(rawGame);
  const level = useAtomValue(levelStateAtom);
  const [questionNum, setQuestionNum] = useAtom(questionAtom);
  const questions = useMemo(() => getQuestions(game, level), [game, level]);

  const currQuestion = questions[questionNum - 1] ?? questions[0];

  const setTotalQuestions = useSetAtom(totalQuestionsAtom);
  const totalQuestions = useMemo(() => questions.length, [questions]);
  useEffect(() => setTotalQuestions(totalQuestions), [setTotalQuestions, totalQuestions]);

  const setCorrectOption = useSetAtom(correctOptionAtom);
  useEffect(() => setCorrectOption(currQuestion.correctOption), [currQuestion.correctOption, setCorrectOption]);

  const setcurrentCorrectOption = useSetAtom(currentCorrectOptionAtom);

  const setQuizState = useSetAtom(quizStateAtom);
  const setAffirmation = useSetAtom(affirmationAtom);
  const setScore = useSetAtom(scoreAtom);
  const setAppState = useSetAtom(appStateAtom);
  const [hasAnsweredWrong, setHasAnsweredWrong] = useAtom(hasAnsweredWrongAtom);

  const [lives, setLives] = useAtom(livesAtom); // was: useAtomValue(livesAtom)

  const handleOptionClick: OptionClickHandler = (option) => {
    setcurrentCorrectOption(currQuestion.correctOption);

    const isCorrect =
      normalizeOptionString(option) === normalizeOptionString(currQuestion.correctOption);

    if (isCorrect) {
      if (!hasAnsweredWrong) {
        setScore((prevScore) => prevScore + Math.floor((1 / totalQuestions) * 100));
      }
      setHasAnsweredWrong(false);
      if (level !== "hard") {
        setAffirmation("success");
        setQuizState("affirmation");
      } else {
        if (questionNum === totalQuestions) {
          setAppState("game-finished");
          setQuestionNum(1);
        } else {
          setQuestionNum(questionNum + 1);
        }
      }
    } else if (option) {
      const remainingLives = lives - 1;
      setLives(remainingLives);
      if (remainingLives > 0) {
        setAffirmation("tryAgain");
        setQuizState("affirmation");
        setHasAnsweredWrong(true);
      } else {
        setAffirmation("fail");
        setQuizState("affirmation");
      }
    }
  };

  const displayTextMap: Record<string, string> = {
  note: "What note is shown?",
  key: "What key signature is shown?",
  "major-minor": "What major/minor is shown?",
  scale: "What scale is shown?",
  interval: "What interval is shown?",
  chord: "What chord is shown?",
  ledger: "What ledger line is shown?",
  reading: "Can you find the missing letters?",
};

  const displayText = displayTextMap[game] ?? "What element is shown?";

  return (
    <div className="quizSection">
      <div className="quizNumber">
        <span>{questionNum}</span>
        <span>of</span>
        <span>{totalQuestions}</span>
      </div>
      <div className="noteQuestionnGraph">
        <img src={currQuestion.questionImage} alt="Question" />
      </div>
      <div className="questionText">
        <p>{displayText}</p>
        <Options handleOptionClick={handleOptionClick} />
      </div>

      <Affirmation />
    </div>
  );
};

export default QuizSection;