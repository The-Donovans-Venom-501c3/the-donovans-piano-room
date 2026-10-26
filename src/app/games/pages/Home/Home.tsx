"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useSetAtom, useAtom } from "jotai";
import { Button } from "./button";
import Report from "../Report/Report";
import {
  appStateAtom,
  gameStateAtom,
  loadingStateAtom,
  quizStateAtom,
  scoreAtom,
  livesAtom,
  questionAtom,
  levelStateAtom,
} from "@/store/game-atoms";
import {
  completedLevelsAtom,
  highScoresAtom,
  playCountsAtom,
  fastestTimesAtom,
  scoreSummaryAtom
} from "@/utils/stores";

// Imports from types and utils using correct relative paths
import type { GameType, HighScore, Level, Question, LevelKey } from "../../types";
import { getQuestions } from "../../utils/questions";

import ChordOptions from "../../components/QuizSection/Options/ChordOptions/ChordOptions";
import IntervalOptions from "../../components/QuizSection/Options/IntervalOptions/IntervalOptions";
import KeyOptions from "../../components/QuizSection/Options/KeyOptions/KeyOptions";
import LedgerOptions from "../../components/QuizSection/Options/LedgerOptions/LedgerOptions";
import MajorMinorOptions from "../../components/QuizSection/Options/MajorMinorOptions/MajorMinorOptions";
import MathOptions from "../../components/QuizSection/Options/MathOptions/MathOptions";
import NoteOptions from "../../components/QuizSection/Options/NoteOptions/NoteOptions";
import ReadingOptions from "../../components/QuizSection/Options/ReadingOptions/ReadingOptions";
import { Droppable } from "../../components/QuizSection/Options/ReadingOptions/Droppable";
import {
  DndContext,
  pointerWithin,
  rectIntersection,
  type CollisionDetection,
  type DragEndEvent,
} from "@dnd-kit/core";
import ScaleOptions from "../../components/QuizSection/Options/ScaleOptions/ScaleOptions";

import "./Home.scss";

// Correct PNG paths from public/games folder
const NoteIdentification = "/games/NoteIdentification.png";
const ScaleIdentification = "/games/ScaleIdentification.png";
const VirtualInstrument = "/games/VirtualInstrument.png";
const MajorMinor = "/games/MajorMinor.png";
const LedgerLine = "/games/Ledgerline.png";
const KeySignature = "/games/Key Signature.png";
const IntervalIdentification = "/games/Interval identification.png";
const ChordIdentification = "/games/ChordIdentification.png";

// Level Status Icons
const playedLevelIcon = "/games/Played Level.svg";
const goldPadlockIcon = "/games/Gold Padlock.svg";
const greyPadlockIcon = "/games/Grey padlock.svg";

// Background & Character Assets
const yellowMascot = "/games/Character_Loading.svg";
const yellowGuy = "/games/yellowGuy.svg";
const mascotShadow = "/games/Character_Ellipse.svg";
const purpleSpotlightBeam = "/games/HomePageLight.svg";
const musicStand = "/games/Music_stand.svg";
const musicStandDeskview = "/games/Music_Stand_Deskview.png";
const welcomeCat = "/games/Welcome_Character.svg";
const cryingCat = "/games/cryingCat.svg";
const happyCat = "/games/happyCat.svg"
const successCharacter = "/games/Affirmation_Success_Character.svg";
const mainBanner = "/games/Banner.png";

// Gameplay Control SVGs
const accessibilityIcon = "/games/Accessibility.svg";
const volumeIcon = "/games/gameVolume.svg"
const expandIcon = "/games/gameExpand.svg"
const minimizeIcon = "/games/gameMinimize.svg"
const redCloseIcon = "/games/gameRedClose.svg"
const timerIcon = "/games/Timer.svg";
const scoreIcon = "/games/Score.svg";
const pauseIcon = "/games/Pause1.svg";
const resumeIcon = "/games/Resume.svg";
const restartIcon = "/games/Restart1.svg";
const trebleClefIcon = "/games/MusicSymbol.png";
const lifeIcon = "/games/gameLifeFilled.svg"
const missingLifeIcon = "/games/gameLifeStroked.svg"
const prevIcon = "/games/gamePaginationPrevIcon.svg"
const nextIcon = "/games/gamePaginationNextIcon.svg"

// Accessibility Options Images
const fontSizeImg = "/games/Fontsize.png";
const colorImg = "/games/Color.png";
const linksImg = "/games/Links.png";
const speechImg = "/games/Speech.png";

type GameFlowStage =
  | "dashboard"
  | "banner"
  | "welcome"
  | "rockstar_msg"
  | "levels"
  | "loading_screen"
  | "stage_start_1"
  | "stage_start_2"
  | "stage_start_3"
  | "active_game"
  | "game_finished"
  | "reviewing";

type DifficultyLevel = "easy" | "medium" | "hard";

// How long the Correct / Wrong popover shows before it hides itself
const FEEDBACK_MS = 1500;

// How many upcoming question images to fetch ahead of the player
const PRELOAD_AHEAD = 2;

// Music is Reading: a letter lands on the blank under the mouse. If the mouse isn't over one
// (or there's no mouse, as when dragging with the keyboard), it lands on the blank it overlaps most.
const dropOnBlankUnderPointer: CollisionDetection = (args) => {
  const underPointer = pointerWithin(args);
  return underPointer.length > 0 ? underPointer : rectIntersection(args);
};

const FULL_NOTE_ROWS: string[][] = [
  ["C", "D", "E", "F", "G", "A", "B"],
  ["C#", "D#", "E#", "F#", "G#", "A#", "B#"],
  ["Cb", "Db", "Eb", "Fb", "Gb", "Ab", "Bb"],
];

type LevelCardProps = {
  level: DifficultyLevel;
  record?: HighScore;
  unlocked: boolean;
  completed: boolean;
  lockedHint?: string;
  onSelect: (level: DifficultyLevel) => void;
};

function LevelCard({ level, record, unlocked, completed, lockedHint, onSelect }: LevelCardProps) {
  const title = level.charAt(0).toUpperCase() + level.slice(1);
  const icon = completed
    ? { src: playedLevelIcon, alt: "Completed" }
    : unlocked
      ? { src: goldPadlockIcon, alt: "Unlocked" }
      : { src: greyPadlockIcon, alt: "Locked" };

  return (
    <div
      className={`difficulty-card ${level} ${unlocked ? "" : "locked"} ${completed ? "completed" : ""}`}
      onClick={unlocked ? () => onSelect(level) : undefined}
      aria-disabled={!unlocked}
      title={unlocked ? undefined : lockedHint}
    >
      <div className="card-left">
        <b className="level-title">{title}</b>
        {record && (
          <p className="high-score-tag">
            <span className="high-score-label">Your Highest Score:</span>
            <b className="high-score">{record.score}</b>
          </p>
        )}
      </div>
      <img className="card-status-icon" src={icon.src} alt={icon.alt} />
    </div>
  );
}

export default function Home() {
  const setAppState = useSetAtom(appStateAtom);
  const setGameState = useSetAtom(gameStateAtom);
  const setLevelState = useSetAtom(levelStateAtom);
  const [flowStage, setFlowStage] = useState<GameFlowStage>("dashboard");
  const [selectedGameTitle, setSelectedGameTitle] = useState("Note Identification Game");
  const [selectedGameKey, setSelectedGameKey] = useState<GameType>("note");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<DifficultyLevel | null>(null);
  const [activeTab, setActiveTab] = useState<"dashboard" | "report">("dashboard");
  const setLoadingState = useSetAtom(loadingStateAtom);
  const setQuizState = useSetAtom(quizStateAtom);
  const [score, setScore] = useAtom(scoreAtom);
  const [lives, setLives] = useAtom(livesAtom);
  const [questionIndex, setQuestionIndex] = useAtom(questionAtom);

  const [highScores, setHighScores] = useAtom(highScoresAtom);
  const [completedLevels, setCompletedLevels] = useAtom(completedLevelsAtom);
  const setPlayCounts = useSetAtom(playCountsAtom);
  const setFastestTimes = useSetAtom(fastestTimesAtom);
  const setScoreSummary = useSetAtom(scoreSummaryAtom);

  // Gameplay Control States
  const [volume, setVolume] = useState<number>(80);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerStatus, setAnswerStatus] = useState<"correct" | "wrong" | null>(null);
  // Wrong picks for the current question; they stay red until the right answer is chosen
  const [wrongOptions, setWrongOptions] = useState<string[]>([]);
  // Answers given this run, by question number; answered questions are shown read-only
  // correct is null for the question that ended the game (its wrong picks are kept for Review)
  const [answers, setAnswers] = useState<Record<number, { correct: string | null; wrong: string[] }>>({});
  // Pending popover timer (correct: advance, wrong: hide or game over); cleared whenever the question changes
  const feedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Modal Control States
  const [showExitModal, setShowExitModal] = useState<boolean>(false);
  const [showRestartModal, setShowRestartModal] = useState<boolean>(false);
  // Bumped on every restart so option components with their own state (ScaleOptions' selected note) start fresh
  const [restartCount, setRestartCount] = useState<number>(0);
  const [showAccessibilityModal, setShowAccessibilityModal] = useState<boolean>(false);

  // Accessibility Option States
  const [textSizeStep, setTextSizeStep] = useState<number>(1);
  const [isColorActive, setIsColorActive] = useState<boolean>(false);
  const [isLinksActive, setIsLinksActive] = useState<boolean>(false);
  const [isSpeechActive, setIsSpeechActive] = useState<boolean>(false);

  // Keyboard shortcut Ctrl+U for accessibility modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "u") {
        e.preventDefault();
        setShowAccessibilityModal((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Stage Transitions
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    switch (flowStage) {
      case "banner":
        timer = setTimeout(() => setFlowStage("welcome"), 2500);
        break;
      case "welcome":
        timer = setTimeout(() => setFlowStage("rockstar_msg"), 2000);
        break;
      case "rockstar_msg":
        timer = setTimeout(() => setFlowStage("levels"), 1500);
        break;
      case "loading_screen":
        timer = setTimeout(() => setFlowStage("stage_start_1"), 3300);
        break;
      case "stage_start_1":
        timer = setTimeout(() => setFlowStage("stage_start_2"), 1200);
        break;
      case "stage_start_2":
        timer = setTimeout(() => setFlowStage("stage_start_3"), 1200);
        break;
      case "stage_start_3":
        timer = setTimeout(() => setFlowStage("active_game"), 1200);
        break;
      default:
        break;
    }
    return () => clearTimeout(timer);
  }, [flowStage]);

  // Game Active Timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (
      flowStage === "active_game" &&
      !isPaused &&
      !showExitModal &&
      !showRestartModal &&
      !showAccessibilityModal
    ) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [flowStage, isPaused, showExitModal, showRestartModal, showAccessibilityModal]);

  // Save the play count, score summary, high score, completion and fastest time when a game finishes
  useEffect(() => {
    if (flowStage !== "game_finished" || !selectedLevel) return;

    setPlayCounts((all) => ({
      ...all,
      [selectedGameKey]: (all[selectedGameKey] ?? 0) + 1,
    }));

    setScoreSummary((summary) => ({
      total: summary.total + score,
      count: summary.count + 1,
    }));

    const key: LevelKey = `${selectedGameKey}:${selectedLevel}`;
    const prev = highScores[key];
    const beatsPrevious =
      !prev || score > prev.score || (score === prev.score && timerSeconds < prev.timeSeconds);

    if (beatsPrevious) {
      setHighScores((all) => ({
        ...all,
        [key]: { score, timeSeconds: timerSeconds, date: new Date().toISOString() },
      }));
    }
    // Finishing with lives left completes the level and can set a fastest time; a later
    // game over never undoes either
    if (lives > 0) {
      setCompletedLevels((all) => ({ ...all, [key]: true }));

      setFastestTimes((all) => {
        const prevTime = all[key];
        if (prevTime !== undefined && prevTime <= timerSeconds) return all;
        return { ...all, [key]: timerSeconds };
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flowStage]);

  // Warm the browser cache for the next few questions so their images show without a delay
  useEffect(() => {
    for (let i = 0; i < PRELOAD_AHEAD; i++) {
      // currentQuestion is questions[questionIndex - 1], so the next one is questions[questionIndex]
      const upcoming = questions[questionIndex + i];
      if (!upcoming) break; // past the last question
      if (upcoming.questionImage) {
        const img = new Image();
        img.src = upcoming.questionImage;
      }
    }
  }, [questions, questionIndex]);

  const handleSelectGame = (gameKey: GameType, title: string) => {
    setGameState(gameKey as unknown as Parameters<typeof setGameState>[0]);
    setSelectedGameTitle(title);
    setSelectedGameKey(gameKey);
    setSelectedAnswer(null);
    setAnswerStatus(null);
    setWrongOptions([]);
    setFlowStage("banner");
  };

  const handleSelectLevel = (level: DifficultyLevel) => {
    if (level === "hard" && !isHardUnlocked) return;
    if (level === "medium" && !isMediumUnlocked) return;

    // Load dynamic questions from questions.ts utility
    const loadedQuestions = getQuestions(selectedGameKey, level as Level) || [];
    setQuestions(loadedQuestions);

    setLevelState(level);
    setSelectedLevel(level);
    setLoadingState("loading");
    setQuizState("quiz");
    setScore(0);
    setLives(3);
    goToQuestion(1);
    setAnswers({});
    setTimerSeconds(0);
    setIsPaused(false);
    setFlowStage("loading_screen");
  };

  const currentQuestion =
    questions.length > 0 ? questions[(questionIndex - 1) % questions.length] : null;
  const savedAnswer = answers[questionIndex];
  const isReviewing = flowStage === "reviewing";
  // In Review, questions never answered correctly still show their right answer
  const reviewCorrectAnswer = isReviewing ? currentQuestion?.correctOption || currentQuestion?.answer || null : null;

  // Music is Reading draws its SVG inline, so hovering a blank can highlight the note tagged with the same data-blank
  const [readingSvg, setReadingSvg] = useState<string | null>(null);
  const readingImage = selectedGameKey === "reading" ? currentQuestion?.questionImage : undefined;

  useEffect(() => {
    setReadingSvg(null); // don't show the last question's notes while this one loads
    if (!readingImage) return;

    let cancelled = false; // set when the question changes before this fetch finishes
    fetch(readingImage)
      .then((response) => (response.ok ? response.text() : Promise.reject(response.status)))
      .then((svg) => {
        if (!cancelled) setReadingSvg(svg);
      })
      .catch(() => {
        // Falls back to the <img>: the notes still show, they just don't highlight
      });

    return () => {
      cancelled = true;
    };
  }, [readingImage]);

  // Keep the same { __html } object between renders. This React rebuilds the SVG whenever it gets a new
  // object, even with the same markup, so a fresh one on every timer tick made the hovered note flash.
  const readingSvgMarkup = useMemo(() => (readingSvg ? { __html: readingSvg } : null), [readingSvg]);

  // Music is Reading: the letter dropped into each blank, by the blank's index
  const [blankLetters, setBlankLetters] = useState<Record<number, string>>({});

  // Empty the blanks on every new question and on Restart
  useEffect(() => {
    setBlankLetters({});
  }, [questionIndex, restartCount]);

  // A letter (id "draggable-C") was dropped. If it landed on a blank (id "blank-2"), put it there.
  // Letters aren't used up, so the same one can fill several blanks.
  const handleLetterDrop = ({ active, over }: DragEndEvent) => {
    if (!over || !String(over.id).startsWith("blank-")) return;
    const blank = Number(String(over.id).replace("blank-", ""));
    const letter = String(active.id).replace("draggable-", "");
    setBlankLetters((prev) => ({ ...prev, [blank]: letter }));
  };

  // Music is Reading answers are the missing letters, lowercase and comma-separated, e.g. "a,f,e"
  const readingBlankCount =
    selectedGameKey === "reading" && currentQuestion?.sentence ? currentQuestion.sentence.split("_").length - 1 : 0;
  const readingLetters = Array.from({ length: readingBlankCount }, (_, index) => blankLetters[index]?.toLowerCase());
  // What the Check button submits: null until every blank has a letter
  const readingAnswer =
    readingBlankCount > 0 && readingLetters.every(Boolean) ? readingLetters.join(",") : null;
  const readingCorrectLetters = (currentQuestion?.correctOption ?? "").split(",");
  // The latest wrong answer's letters. A blank is marked wrong while it still holds the wrong letter it had
  // then, so the mark goes away as soon as the player changes it.
  const readingWrongs = savedAnswer?.wrong ?? wrongOptions;
  const lastWrongLetters = readingWrongs.length > 0 ? readingWrongs[readingWrongs.length - 1].split(",") : [];
  const isBlankWrong = (index: number) =>
    !!readingLetters[index] &&
    readingLetters[index] === lastWrongLetters[index] &&
    readingLetters[index] !== readingCorrectLetters[index];

  // TODO: remove once game testing is complete!
  // useEffect(() => {
  //   console.log('questions.length', questions.length)
  //   console.log("currentQuestion", questionIndex, currentQuestion);
  // }, [questionIndex, currentQuestion]);

  const easyRecord = highScores[`${selectedGameKey}:easy`];
  const mediumRecord = highScores[`${selectedGameKey}:medium`];
  const hardRecord = highScores[`${selectedGameKey}:hard`];

  // Medium unlocks once Easy is completed, and Hard unlocks once Easy and Medium are completed
  const isMediumUnlocked = !!completedLevels[`${selectedGameKey}:easy`];
  const isHardUnlocked = isMediumUnlocked && !!completedLevels[`${selectedGameKey}:medium`];
  const isHardCompleted = !!completedLevels[`${selectedGameKey}:hard`];

  const cancelFeedbackTimer = () => {
    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
      feedbackTimeoutRef.current = null;
    }
  };

  // Every question change goes through here so per-question state never carries over
  const goToQuestion = (index: number) => {
    cancelFeedbackTimer();
    setSelectedAnswer(null);
    setAnswerStatus(null);
    setWrongOptions([]);
    setQuestionIndex(index);
  };

  const handleAnswerSubmit = (selectedOption: string) => {
    if (answerStatus !== null || !currentQuestion || savedAnswer || isReviewing) return;

    const expectedAnswer = currentQuestion.correctOption || currentQuestion.answer;
    setSelectedAnswer(selectedOption);

    if (selectedOption === expectedAnswer) {
      setAnswerStatus("correct");
      setAnswers((prev) => ({ ...prev, [questionIndex]: { correct: selectedOption, wrong: wrongOptions } }));
      setWrongOptions([]);
      // Score is the share of questions answered right on the first try, rounded once so a
      // perfect run totals exactly 100 (rounding each answer's points left 30 questions at 90).
      // answers only holds answered questions, and this one isn't in it yet
      const firstTryCount =
        Object.values(answers).filter((answer) => answer.wrong.length === 0).length +
        (wrongOptions.length === 0 ? 1 : 0);
      setScore(questions.length > 0 ? Math.round((firstTryCount / questions.length) * 100) : 0);
      // questionIndex can't be stale here: any navigation cancels this timer first
      feedbackTimeoutRef.current = setTimeout(() => {
        feedbackTimeoutRef.current = null;
        if (questionIndex >= (questions.length || 8)) {
          setFlowStage("game_finished");
        } else {
          goToQuestion(questionIndex + 1);
        }
      }, FEEDBACK_MS);
    } else {
      setAnswerStatus("wrong");
      setWrongOptions((prev) => [...prev, selectedOption]);
      // wrongOptions is still the old list here, so build this question's picks so far
      const wrongSoFar = [...wrongOptions, selectedOption];
      const nextLives = Math.max(0, lives - 1);
      setLives(nextLives);
      // Hide the popover on its own; nextLives because lives is still the old value here
      feedbackTimeoutRef.current = setTimeout(() => {
        feedbackTimeoutRef.current = null;
        setSelectedAnswer(null);
        setAnswerStatus(null);
        if (nextLives <= 0) {
          // Saved here rather than on the click: a saved answer enables Next, which would let the
          // player leave and cancel this game-over timer while the popover is still up
          setAnswers((prev) => ({ ...prev, [questionIndex]: { correct: null, wrong: wrongSoFar } }));
          setFlowStage("game_finished");
        }
      }, FEEDBACK_MS);
    }
  };

  // Review mode: the game screen with every question read-only, starting from the first
  const startReview = () => {
    goToQuestion(1);
    setFlowStage("reviewing");
  };

  const backToResults = () => {
    goToQuestion(1);
    setFlowStage("game_finished");
  };

  // Exit Modal Actions
  const triggerExitGame = () => {
    setShowExitModal(true);
  };

  const confirmExitGame = () => {
    cancelFeedbackTimer();
    setShowExitModal(false);
    setAppState("home");
    setFlowStage("dashboard");
    setIsExpanded(false);
  };

  const keepPlayingExit = () => {
    setShowExitModal(false);
  };

  // Restart Modal Actions
  const triggerRestartGame = () => {
    setShowRestartModal(true);
  };

  const confirmRestartGame = () => {
    setShowRestartModal(false);
    setRestartCount((count) => count + 1);
    setScore(0);
    setLives(3);
    goToQuestion(1);
    setAnswers({});
    setTimerSeconds(0);
    setIsPaused(false);
    setFlowStage("active_game");
  };

  const keepPlayingRestart = () => {
    setShowRestartModal(false);
  };

  const handleResetAccessibility = () => {
    setTextSizeStep(1);
    setIsColorActive(false);
    setIsLinksActive(false);
    setIsSpeechActive(false);
  };

  const formatTime = (totalSeconds: number): string => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const formatNoteLabel = (note: string): string => {
    return note.replace("#", "♯").replace("b", "♭");
  };

  return (
    <div className={`games-home-wrapper ${isExpanded ? "is-fullscreen" : ""}`}>
      {/* DASHBOARD STAGE */}
      {flowStage === "dashboard" && (
        <div className="background-set">
          <img src={purpleSpotlightBeam} alt="Light Beam" className="spotlight-beam" />
          <div className="dashboard-header">
            <h1 className="page-title">Games</h1>
          </div>
          <div className={`tab-switcher-pill ${
            activeTab === "dashboard" ? "dashboard-active" : "report-active"
          }`}>
            <button
              className={`tab ${activeTab === "dashboard" ? "active" : ""}`}
              onClick={() => setActiveTab("dashboard")}
            >
              Games dashboard
            </button>
            <button
              className={`tab ${activeTab === "report" ? "active" : ""}`}
              onClick={() => setActiveTab("report")}
            >
              Games&apos; report
            </button>
          </div>
          {activeTab === "report" && (
            <Report onSelectGame={handleSelectGame} />
          )}
          {activeTab === "dashboard" && (
          <div className="whole-page-layout">
            <div className="hero-section">
              <div className="mascot-wrapper">
                <img src={yellowGuy} alt="Yellow Headphone Mascot" className="mascot-img" />
              </div>
              <h2 className="main-heading font-montserrat">
                Let&apos;s take a<br />game break!
              </h2>
              <p className="sub-description">
                Test your skills with engaging games that challenge your memory and rhythm recognition while having some musical fun.
              </p>
              <p className="action-prompt">Choose a game you want to play!</p>
            </div>
            <div className="right-content-section">
              <div className="buttonContainer">
                <Button
                  icon={NoteIdentification}
                  hoverIcon={NoteIdentification}
                  title="Note identification"
                  tips="Identify the note on the staff"
                  hoverColor="#ffffff"
                  hoverBorderColor="#ffffff"
                  onClick={() => handleSelectGame("note", "Note Identification Game")}
                />
                <Button
                  icon={ChordIdentification}
                  hoverIcon={ChordIdentification}
                  title="Chord identification"
                  tips="Identify the chord on the staff"
                  hoverColor="#ffffff"
                  hoverBorderColor="#ffffff"
                  onClick={() => handleSelectGame("chord", "Chord Identification Game")}
                />
                <Button
                  icon={KeySignature}
                  hoverIcon={KeySignature}
                  title="Key Signature identification"
                  tips="Identify key signatures"
                  hoverColor="#ffffff"
                  hoverBorderColor="#ffffff"
                  onClick={() => handleSelectGame("key", "Key Signature Identification Game")}
                />
                <Button
                  icon={MajorMinor}
                  hoverIcon={MajorMinor}
                  title="Major-minor identification"
                  tips="Identify major/minor chords"
                  hoverColor="#ffffff"
                  hoverBorderColor="#ffffff"
                  onClick={() => handleSelectGame("major-minor", "Major-minor Identification Game")}
                />
                <Button
                  icon={LedgerLine}
                  hoverIcon={LedgerLine}
                  title="Ledger line addition"
                  tips="Identify notes on ledger lines"
                  hoverColor="#ffffff"
                  hoverBorderColor="#ffffff"
                  onClick={() => handleSelectGame("ledger", "Ledger Line Addition Game")}
                />
                <Button
                  icon={VirtualInstrument}
                  hoverIcon={VirtualInstrument}
                  title="Music x Math"
                  tips="Count beats, notes, and rests"
                  hoverColor="#ffffff"
                  hoverBorderColor="#ffffff"
                  onClick={() => handleSelectGame("math", "Music x Math Game")}
                />
                <Button
                  icon={ScaleIdentification}
                  hoverIcon={ScaleIdentification}
                  title="Scale identification"
                  tips="Identify musical scales"
                  hoverColor="#ffffff"
                  hoverBorderColor="#ffffff"
                  onClick={() => handleSelectGame("scale", "Scale Identification Game")}
                />
                <Button
                  icon={IntervalIdentification}
                  hoverIcon={IntervalIdentification}
                  title="Interval identification"
                  tips="Identify pitch intervals"
                  hoverColor="#ffffff"
                  hoverBorderColor="#ffffff"
                  onClick={() => handleSelectGame("interval", "Interval Identification Game")}
                />
                <Button
                  icon={VirtualInstrument}
                  hoverIcon={VirtualInstrument}
                  title="Music is Reading"
                  tips="Find the missing letters"
                  hoverColor="#ffffff"
                  hoverBorderColor="#ffffff"
                  onClick={() => handleSelectGame("reading", "Music is Reading Game")}
                />
              </div>
            </div>
          </div>
          )}
        </div>
      )}

      {/* BANNER STAGE */}
      {flowStage === "banner" && (
        <div className="games-enter-stage">
          <img src={mainBanner} alt="Stage Banner" className="stage-banner-img" />
        </div>
      )}

      {/* LEVEL SELECTION STAGE */}
      {(flowStage === "welcome" || flowStage === "rockstar_msg" || flowStage === "levels") && (
        <div className="stage-view-wrapper">
          <img src={mainBanner} alt="Stage Banner" className="stage-banner-img" />
          <div className="enter-card-container">
            <h1 className="enter-game-title">
              Welcome to the <span className="highlight-game-name">{selectedGameTitle}</span>
            </h1>
            <div className="enter-card-content">
              {(flowStage === "rockstar_msg" || flowStage === "levels") && (
                <div className="mascot-speech-container">
                  <div className="speech-bubble-box">
                    <p className="speech-text">
                      Hey Superstars! Get ready for musical fun. Identify the note on the staff and move to the next level, with less than three mistakes. Learn note basics and become a pro!
                    </p>
                    <p className="speech-action">Choose the level you want to play!</p>
                  </div>
                  <img src={welcomeCat} alt="Piano Cat Mascot" className="welcome-cat-svg" />
                </div>
              )}
              {flowStage === "levels" && (
                <div className="difficulty-cards-container">
                  <LevelCard
                    level="easy"
                    record={easyRecord}
                    unlocked
                    completed={isMediumUnlocked}
                    onSelect={handleSelectLevel}
                  />
                  <LevelCard
                    level="medium"
                    record={mediumRecord}
                    unlocked={isMediumUnlocked}
                    completed={isHardUnlocked}
                    lockedHint="Complete Easy to unlock"
                    onSelect={handleSelectLevel}
                  />
                  <LevelCard
                    level="hard"
                    record={hardRecord}
                    unlocked={isHardUnlocked}
                    completed={isHardCompleted}
                    lockedHint="Complete Medium to unlock"
                    onSelect={handleSelectLevel}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* LOADING SCREEN */}
      {flowStage === "loading_screen" && (
        <div className="stage-view-wrapper">
          <img src={mainBanner} alt="Stage Banner" className="stage-banner-img" />
          <div className="loading-card-container">
            <div className="loading-mascot-wrapper">
              <img src={yellowMascot} alt="Loading Mascot" className="loading-mascot-img" />
              <img src={mascotShadow} alt="" aria-hidden="true" className="loading-mascot-shadow" />
            </div>
            <h1 className="loading-heading">Get Ready for Awesomeness!</h1>
            <p className="loading-subtext">
              For each mission, you will be shown a music note.<br />
              Choose one correct answer from options given.
            </p>
            <p className="loading-status-text">Directing you to the game in a minute...</p>
            <div className="loading-progress-bar-track">
              <div className="loading-progress-bar-fill" />
            </div>
          </div>
        </div>
      )}

      {/* STAGE TRANSITIONS */}
      {flowStage === "stage_start_1" && (
        <div className="games-enter-stage">
          <img src={mainBanner} alt="Stage Banner" className="stage-banner-img" />
        </div>
      )}
      {flowStage === "stage_start_2" && (
        <div className="games-enter-stage">
          <img src={mainBanner} alt="Stage Banner" className="stage-banner-img" />
          <div className="music-stand-overlay">
            <img src={musicStand} alt="Music Stand" className="music-stand-img" />
          </div>
        </div>
      )}
      {flowStage === "stage_start_3" && (
        <div className="games-enter-stage">
          <img src={musicStandDeskview} alt="Music Stand Deskview" className="stage-banner-img" />
        </div>
      )}

      {/* ACTIVE GAMEPLAY STAGE (stays up when the game finishes, to show the result in the card) */}
      {(flowStage === "active_game" || flowStage === "game_finished" || isReviewing) && (
        <div className={`active-game-stage-wrapper ${isExpanded ? "fullscreen-mode" : ""}`}>
          {!isExpanded && (
            <img src={musicStandDeskview} alt="Deskview Background" className="deskview-bg-image" />
          )}
          <div className="deskview-overlay-content">
            <div className="game-screen-card">
              {flowStage === "game_finished" ? (
                // Game Over / Game Complete, shown in place of the game
                <div className="game-finished-content">
                  <img src={welcomeCat} alt="Cat Mascot" className="cat-finished-img" />
                  <div className="finished-details">
                    <h2 className="finished-title">{lives === 0 ? "Game Over!" : "Amazing!"}</h2>
                    <p className="finished-message">
                      {lives === 0
                        ? "You ran out of lives. Better luck next time!"
                        : "You have successfully finished this game."}
                    </p>
                    <p className="finished-score">
                      SCORE: <strong>{score}</strong>
                    </p>
                    {lives > 0 && <p className="finished-encouragement">Keep it up, Superstar!</p>}
                    <div className="finish-actions">
                      <button onClick={confirmExitGame} className="back-btn">
                        Back to Games
                      </button>
                      <button onClick={startReview} className="review-btn">
                        Review Your Questions
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Answer Callout Overlays (pinned to the card's bottom-left corner) */}
                  {answerStatus === "wrong" && (
                    <div className="callout-overlay wrong-overlay">
                      <div className="popover-card">
                        <p className="popover-title">Oops, that&apos;s not the right answer.</p>
                        <p className="popover-sub">Sorry, we need to take one of your lives.</p>
                      </div>
                      <img src={happyCat} alt="Cat Mascot" className="mascot-img-callout" />
                    </div>
                  )}
                  {answerStatus === "correct" && (
                    <div className="callout-overlay correct-overlay">
                      <div className="popover-card">
                        <p className="popover-title">Correct answer, good job!</p>
                      </div>
                      <img src={successCharacter} alt="Success Mascot" className="mascot-img-callout" />
                    </div>
                  )}

                  {/* Top Controls */}
                  <div className="game-top-bar">
                    <div className="volume-control">
                      <img src={volumeIcon} alt="Volume" className="volume-icon" />
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={volume}
                        onChange={(e) => setVolume(Number(e.target.value))}
                        className="volume-slider-input"
                      />
                    </div>
                    <div className="right-controls">
                      <button
                        className="icon-circle-btn"
                        title="Accessibility"
                        onClick={() => setShowAccessibilityModal(true)}
                      >
                        <img src={accessibilityIcon} alt="Accessibility" />
                      </button>
                      {isExpanded ? (
                        <button className="pill-btn minimize-btn" onClick={() => setIsExpanded(false)}>
                          <img src={minimizeIcon} alt="" className="control-btn-icon" />
                          <span>Minimize</span>
                        </button>
                      ) : (
                        <button className="pill-btn expand-btn" onClick={() => setIsExpanded(true)}>
                          <img src={expandIcon} alt="" className="control-btn-icon" />
                          <span>Expand</span>
                        </button>
                      )}
                      <button className="pill-btn close-btn" onClick={triggerExitGame} title="Close">
                        <img src={redCloseIcon} alt="" className="control-btn-icon" />
                        <span>Close</span>
                      </button>
                    </div>
                  </div>

                  {/* Game Body */}
                  <div className="game-screen-body">
                    <div className="game-screen-left">
                      {/* Lets the letters in ReadingOptions be dropped on the sentence's blanks; the id keeps its generated ids stable between server and browser */}
                      <DndContext
                        id="reading-letters"
                        collisionDetection={dropOnBlankUnderPointer}
                        onDragEnd={handleLetterDrop}
                      >
                        {/* Dynamic SVG / Staff Question Display */}
                        {currentQuestion?.questionImage && readingSvgMarkup ? (
                          // Our own SVG from svg-image-server, so it's safe to insert as markup
                          <div
                            className={`question-image-container ${selectedGameKey} ${selectedLevel}`}
                            role="img"
                            aria-label="Treble staff with a note for each missing letter"
                            dangerouslySetInnerHTML={readingSvgMarkup}
                          />
                        ) : currentQuestion?.questionImage ? (
                          <div className={`question-image-container ${selectedGameKey} ${selectedLevel}`}>
                            <img
                              key={currentQuestion.questionImage}
                              src={currentQuestion.questionImage}
                              alt="Question SVG"
                              className="question-svg-image"
                            />
                          </div>
                        ) : (
                          <div className="music-staff-container">
                            <div className="treble-clef-wrapper">
                              <img src={trebleClefIcon} alt="Treble Clef" />
                            </div>
                            <div className="staff-lines">
                              <span className="line" />
                              <span className="line" />
                              <span className="line" />
                              <span className="line" />
                              <span className="line" />
                            </div>
                            {currentQuestion?.notePosition && (
                              <div className={`note-marker position-${currentQuestion.notePosition}`}>
                                <svg width="24" height="18" viewBox="0 0 24 18" fill="none">
                                  <ellipse cx="12" cy="9" rx="10" ry="7" fill="#2B1236" transform="rotate(-15 12 9)" />
                                  <ellipse cx="12" cy="9" rx="5" ry="3" fill="#FFFFFF" transform="rotate(-35 12 9)" />
                                </svg>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Music is Reading: the sentence with a blank for each note on the staff */}
                        {selectedGameKey === "reading" && currentQuestion?.sentence && (
                          <p className="reading-sentence">
                            {currentQuestion.sentence.split("_").map((part, index, parts) => (
                              <React.Fragment key={index}>
                                {part}
                                {index < parts.length - 1 && (
                                  <Droppable
                                    id={`blank-${index}`}
                                    className={`reading-blank${
                                      answerStatus === "correct" ? " correct" : isBlankWrong(index) ? " wrong" : ""
                                    }`}
                                    data-blank={index}
                                  >
                                    {blankLetters[index] ? (
                                      blankLetters[index].toLowerCase()
                                    ) : (
                                      <>
                                        {/* a space keeps the blank's text baseline, so the underline doesn't move once a letter lands */}
                                        <span aria-hidden="true">{" "}</span>
                                        <span className="sr-only">blank</span>
                                      </>
                                    )}
                                  </Droppable>
                                )}
                              </React.Fragment>
                            ))}
                          </p>
                        )}

                        <p className={`question-prompt ${selectedGameKey} ${selectedLevel}`}>
                          {currentQuestion?.title || currentQuestion?.questionText || "What is shown?"}
                        </p>

                        {/* Options Matrix */}
                        <div className="keyboard-matrix-wrapper">
                          {
                            /*
                              Use each game's Options components if present,
                              else use JSON Multiple Choice Options if present,
                              else fallback to full keyboard
                            */
                          }
                          {selectedGameKey === "math" ? (
                            <MathOptions
                              key={`${restartCount}-${questionIndex}`}
                              handleOptionClick={handleAnswerSubmit}
                              wrongOptions={savedAnswer?.wrong ?? wrongOptions}
                              correctOption={savedAnswer?.correct ?? reviewCorrectAnswer ?? (answerStatus === "correct" ? selectedAnswer : null)}
                              locked={isReviewing || !!savedAnswer || answerStatus === "wrong"}
                            />
                          ) : selectedGameKey === "note" ? (
                            <NoteOptions
                              handleOptionClick={handleAnswerSubmit}
                              wrongOptions={savedAnswer?.wrong ?? wrongOptions}
                              correctOption={savedAnswer?.correct ?? reviewCorrectAnswer ?? (answerStatus === "correct" ? selectedAnswer : null)}
                              locked={isReviewing || !!savedAnswer || answerStatus === "wrong"}
                              level={selectedLevel ?? "easy"}
                            />
                          ) : selectedGameKey === "chord" ? (
                            <ChordOptions
                              handleOptionClick={handleAnswerSubmit}
                              wrongOptions={savedAnswer?.wrong ?? wrongOptions}
                              correctOption={savedAnswer?.correct ?? reviewCorrectAnswer ?? (answerStatus === "correct" ? selectedAnswer : null)}
                              locked={isReviewing || !!savedAnswer || answerStatus === "wrong"}
                              level={selectedLevel ?? "easy"}
                            />
                          ) : selectedGameKey === "key" ? (
                            <KeyOptions
                              handleOptionClick={handleAnswerSubmit}
                              wrongOptions={savedAnswer?.wrong ?? wrongOptions}
                              correctOption={savedAnswer?.correct ?? reviewCorrectAnswer ?? (answerStatus === "correct" ? selectedAnswer : null)}
                              locked={isReviewing || !!savedAnswer || answerStatus === "wrong"}
                            />
                          ) : selectedGameKey === "major-minor" ? (
                            <MajorMinorOptions
                              handleOptionClick={handleAnswerSubmit}
                              wrongOptions={savedAnswer?.wrong ?? wrongOptions}
                              correctOption={savedAnswer?.correct ?? reviewCorrectAnswer ?? (answerStatus === "correct" ? selectedAnswer : null)}
                              locked={isReviewing || !!savedAnswer || answerStatus === "wrong"}
                            />
                          ) : selectedGameKey === "ledger" ? (
                            <LedgerOptions
                              handleOptionClick={handleAnswerSubmit}
                              level={selectedLevel ?? "easy"}
                              wrongOptions={savedAnswer?.wrong ?? wrongOptions}
                              correctOption={savedAnswer?.correct ?? reviewCorrectAnswer ?? (answerStatus === "correct" ? selectedAnswer : null)}
                              locked={isReviewing || !!savedAnswer || answerStatus === "wrong"}
                            />
                          ) : selectedGameKey === "scale" ? (
                            <ScaleOptions
                              key={`${restartCount}-${questionIndex}`}
                              handleOptionClick={handleAnswerSubmit}
                              level={selectedLevel ?? "easy"}
                              wrongOptions={savedAnswer?.wrong ?? wrongOptions}
                              correctOption={savedAnswer?.correct ?? reviewCorrectAnswer ?? (answerStatus === "correct" ? selectedAnswer : null)}
                              locked={isReviewing || !!savedAnswer || answerStatus === "wrong"}
                            />
                          ) : selectedGameKey === "interval" ? (
                            <IntervalOptions
                              handleOptionClick={handleAnswerSubmit}
                              wrongOptions={savedAnswer?.wrong ?? wrongOptions}
                              correctOption={savedAnswer?.correct ?? reviewCorrectAnswer ?? (answerStatus === "correct" ? selectedAnswer : null)}
                              locked={isReviewing || !!savedAnswer || answerStatus === "wrong"}
                            />
                          ) : selectedGameKey === "reading" ? (
                            <ReadingOptions
                              key={`${restartCount}-${questionIndex}`}
                              handleOptionClick={handleAnswerSubmit}
                              wrongOptions={savedAnswer?.wrong ?? wrongOptions}
                              correctOption={savedAnswer?.correct ?? reviewCorrectAnswer ?? (answerStatus === "correct" ? selectedAnswer : null)}
                              locked={isReviewing || !!savedAnswer || answerStatus === "wrong"}
                              answer={readingAnswer}
                              hasLetters={Object.keys(blankLetters).length > 0}
                              onClear={() => setBlankLetters({})}
                            />
                          ) : currentQuestion?.options && currentQuestion.options.length > 0 ? (
                            <div
                              className="options-grid"
                              style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(2, 1fr)",
                                gap: "10px",
                                width: "100%",
                              }}
                            >
                              {currentQuestion.options.map((option) => {
                                const isSelected = selectedAnswer === option;
                                let btnClass = "grid-note-btn";
                                if (isSelected) {
                                  btnClass += answerStatus === "correct" ? " correct" : " wrong";
                                }
                                return (
                                  <button
                                    key={option}
                                    className={btnClass}
                                    onClick={() => handleAnswerSubmit(option)}
                                  >
                                    {option}
                                  </button>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="keyboard-grid">
                              {FULL_NOTE_ROWS.map((row) =>
                                row.map((note) => {
                                  const isSelected = selectedAnswer === note;
                                  let btnClass = "grid-note-btn";
                                  if (isSelected) {
                                    btnClass += answerStatus === "correct" ? " correct" : " wrong";
                                  }
                                  return (
                                    <button
                                      key={note}
                                      className={btnClass}
                                      onClick={() => handleAnswerSubmit(note)}
                                    >
                                      {formatNoteLabel(note)}
                                    </button>
                                  );
                                })
                              )}
                            </div>
                          )}
                        </div>
                      </DndContext>
                    </div>

                    {/* Right Side Controls & Stats Panel */}
                    <div className="game-screen-right">
                      <div className="stats-group">
                        {/* TIMER Section */}
                        <div className="game-stat timer-block">
                          <span className="stat-label">Timer</span>
                          <img src={timerIcon} alt="Timer" className="stat-icon" />
                          <span className="stat-value">{formatTime(timerSeconds)}</span>
                        </div>
                        {/* SCORE Section */}
                        <div className="game-stat score-block">
                          <span className="stat-label">Score</span>
                          <img src={scoreIcon} alt="Score" className="stat-icon" />
                          <span className="stat-value">{score}/100</span>
                        </div>
                        {/* LIVES Section */}
                        <div className="game-stat lives-block">
                          <span className="stat-label">
                            Lives
                            <span className="life-count">({lives}/3)</span>
                          </span>
                          <div className="lives-quaver-bar">
                            {[0, 1, 2].map((index) => {
                              const isActive = index < lives;
                              return (
                                <img
                                  key={index}
                                  src={isActive ? lifeIcon : missingLifeIcon}
                                  alt={isActive ? "Life Icon" : "Missing Life Icon"}
                                  className={`life-icon ${isActive ? "active" : "lost"}`}
                                />
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* PAUSE / RESTART Controls */}
                      {isReviewing ? (
                        <div className="game-action-buttons">
                          <button className="review-back-btn" onClick={backToResults}>
                            Back to Results
                          </button>
                        </div>
                      ) : (
                        <div className="game-action-buttons">
                          <button className="action-circle-btn" onClick={() => setIsPaused((prev) => !prev)}>
                            <img
                              src={isPaused ? resumeIcon : pauseIcon}
                              alt={isPaused ? "Resume" : "Pause"}
                              className="action-icon"
                            />
                            <span className="action-label">{isPaused ? "Resume" : "Pause"}</span>
                          </button>
                          <button className="action-circle-btn" onClick={triggerRestartGame}>
                            <img src={restartIcon} alt="Restart" className="action-icon" />
                            <span className="action-label">Restart</span>
                          </button>
                        </div>
                      )}

                      {/* Footer Pagination Navigation */}
                      <div className="question-pagination">
                        {/* Prev: when there's a wrong pick, disable until the right pick has been chosen. This also
                            covers the Wrong popover, so its game-over timer can't be cancelled at 0 lives. */}
                        <button
                          className="nav-arrow"
                          onClick={() => goToQuestion(Math.max(1, questionIndex - 1))}
                          disabled={questionIndex <= 1 || wrongOptions.length > 0}
                        >
                          <img src={prevIcon} alt="Previous Page" className="nav-icon prev" />
                        </button>
                        <span className="page-text">
                          {questionIndex} of {questions.length || 8}
                        </span>
                        {/* Next: only enabled once this question has been answered, or in Review mode */}
                        <button
                          className="nav-arrow"
                          onClick={() => goToQuestion(Math.min(questions.length || 8, questionIndex + 1))}
                          disabled={questionIndex >= (questions.length || 8) || (!isReviewing && !savedAnswer)}
                        >
                          <img src={nextIcon} alt="Next Page" className="nav-icon next" />
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ACCESSIBILITY MODAL */}
      {showAccessibilityModal && (
        <div className="accessibility-modal-backdrop">
          <div className="accessibility-modal-card">
            <div className="accessibility-modal-header">
              <h2 className="accessibility-title">Accessibility Menu (Ctrl+U)</h2>
              <button
                className="close-accessibility-btn"
                onClick={() => setShowAccessibilityModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="accessibility-modal-body">
              <div className="accessibility-options-grid">
                <div
                  className="access-option-card"
                  onClick={() => setTextSizeStep((prev) => (prev % 3) + 1)}
                >
                  <img src={fontSizeImg} alt="Text Size" className="option-icon" />
                  <span className="option-label">Text Size</span>
                  <div className="step-bars-container">
                    <span className={`step-bar ${textSizeStep >= 1 ? "filled" : ""}`} />
                    <span className={`step-bar ${textSizeStep >= 2 ? "filled" : ""}`} />
                    <span className={`step-bar ${textSizeStep >= 3 ? "filled" : ""}`} />
                  </div>
                </div>
                <div
                  className={`access-option-card ${isColorActive ? "active" : ""}`}
                  onClick={() => setIsColorActive((prev) => !prev)}
                >
                  <img src={colorImg} alt="Color" className="option-icon" />
                  <span className="option-label">Color</span>
                </div>
                <div
                  className={`access-option-card ${isLinksActive ? "active" : ""}`}
                  onClick={() => setIsLinksActive((prev) => !prev)}
                >
                  <img src={linksImg} alt="Highlight Links" className="option-icon" />
                  <span className="option-label">Highlight Links</span>
                </div>
                <div
                  className={`access-option-card ${isSpeechActive ? "active" : ""}`}
                  onClick={() => setIsSpeechActive((prev) => !prev)}
                >
                  <img src={speechImg} alt="Text to Speech" className="option-icon" />
                  <span className="option-label">Text to Speech</span>
                </div>
              </div>
              <div className="accessibility-footer">
                <button className="reset-changes-btn" onClick={handleResetAccessibility}>
                  Reset All Changes
                </button>
                <p className="profile-note">*Save your accessibility preferences in your profile</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RESTART CONFIRMATION MODAL */}
      {showRestartModal && (
        <div className="confirmation-modal-backdrop">
          <div className="confirmation-modal-card">
            <button className="close-x-btn" onClick={keepPlayingRestart}>
              ✕
            </button>
            <div className="modal-content">
              <img src={cryingCat} alt="Crying Cat Mascot" className="crying-cat-img" />
              <h2 className="modal-title">Are you sure you want to restart the game?</h2>
              <p className="modal-desc">
                Restarting the game before you finish will reset all your progress.
              </p>
              <div className="modal-actions">
                <button className="outline-action-btn" onClick={confirmRestartGame}>
                  Restart the Game
                </button>
                <button className="primary-action-btn" onClick={keepPlayingRestart}>
                  Keep Playing
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CLOSE / EXIT CONFIRMATION MODAL */}
      {showExitModal && (
        <div className="confirmation-modal-backdrop">
          <div className="confirmation-modal-card">
            <button className="close-x-btn" onClick={keepPlayingExit}>
              ✕
            </button>
            <div className="modal-content">
              <img src={cryingCat} alt="Crying Cat Mascot" className="crying-cat-img" />
              <h2 className="modal-title">Are you sure you want to exit?</h2>
              <p className="modal-desc">
                Exiting the game before you finish will reset all your progress.
              </p>
              <div className="modal-actions">
                <button className="outline-action-btn" onClick={confirmExitGame}>
                  Exit the Game
                </button>
                <button className="primary-action-btn" onClick={keepPlayingExit}>
                  Keep Playing
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}