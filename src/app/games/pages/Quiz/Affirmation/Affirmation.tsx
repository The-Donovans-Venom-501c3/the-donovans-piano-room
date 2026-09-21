"use client";

import React from "react";
import { useAtomValue, useSetAtom, useAtom } from "jotai";
import {
  affirmationAtom,
  appStateAtom,
  livesAtom,
  overlayAtom,
  questionAtom,
  quizStateAtom,
  totalQuestionsAtom,
  currentCorrectOptionAtom,
} from "@/store/game-atoms";
import "./Affirmation.scss";

const successCharacter = "/games/Affirmation_Success_Character.svg";
const failCharacter = "/games/sadCat.svg";

const affirmationData = {
  success: {
    sentence: "Correct. Good job!",
    buttonText: "CONTINUE",
    bgColor: "#CDE6CC",
    pic: successCharacter,
  },
  tryAgain: {
    sentence: "Oops, that's not the right answer. Sorry, we need to take one of your lives.",
    buttonText: "TRY AGAIN",
    bgColor: "#F6E892",
    pic: failCharacter,
  },
  fail: {
    sentence: "The correct answer is ",
    buttonText: "CONTINUE",
    bgColor: "#FED2AA",
    pic: failCharacter,
  },
};

export default function Affirmation() {
  const quizState = useAtomValue(quizStateAtom);
  const affirmation = useAtomValue(affirmationAtom);
  const { sentence, buttonText, bgColor, pic } =
    affirmationData[affirmation as keyof typeof affirmationData] || affirmationData.fail;

  const [questionNum, setQuestionNum] = useAtom(questionAtom);
  const setQuizState = useSetAtom(quizStateAtom);
  const totalQuestions = useAtomValue(totalQuestionsAtom);
  const setAppState = useSetAtom(appStateAtom);
  const [lives, setLives] = useAtom(livesAtom);
  const setOverlay = useSetAtom(overlayAtom);
  const correctOption = useAtomValue(currentCorrectOptionAtom);

  if (quizState !== "affirmation") return null;

  const handleResponseBtn = () => {
    if (affirmation === "success") {
      if (questionNum === totalQuestions) {
        setAppState("game-finished");
      } else {
        setQuestionNum(questionNum + 1);
        setQuizState("quiz");
      }
    } else if (affirmation === "fail") {
      setOverlay("lives");
      setQuizState("overlay");
    } else {
      setLives(lives - 1);
      setQuizState("quiz");
    }
  };

  return (
    <div className="mascotCalloutContainer">
      <div className="mascotWrapper">
        <img src={pic} className="mascotImg" alt="Game character state" />
      </div>
      <div className="calloutBox" style={{ backgroundColor: bgColor }}>
        <p className="calloutText">
          {sentence}
          {affirmation === "fail" && <span>{correctOption}</span>}
        </p>
        <button className="responseBtn" onClick={handleResponseBtn}>
          {buttonText}
        </button>
      </div>
    </div>
  );
}