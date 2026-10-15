"use client";
import React, { useState, useEffect, useRef } from "react";
import { useSetAtom, useAtom } from "jotai";
import { Button } from "./button";
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
import { completedLevelsAtom, highScoresAtom } from "@/utils/stores";

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
const purpleSpotlightBeam = "/games/HomePageLight.svg";
const musicStand = "/games/Music_stand.svg";
const musicStandDeskview = "/games/Music_Stand_Deskview.png";
const welcomeCat = "/games/Welcome_Character.svg";
const cryingCat = "/games/cryingCat.svg";
const happyCat = "/games/happyCat.svg"
const successCharacter = "/games/Affirmation_Success_Character.svg";
const blankBanner = "/games/BlankBanner.png";
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
  | "game_finished";

type DifficultyLevel = "easy" | "medium" | "hard";

// How long the Correct / Wrong popover shows before it hides itself
const FEEDBACK_MS = 1500;

// How many upcoming question images to fetch ahead of the player
const PRELOAD_AHEAD = 2;

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

  // Gameplay Control States
  const [volume, setVolume] = useState<number>(80);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerStatus, setAnswerStatus] = useState<"correct" | "wrong" | null>(null);
  // Wrong picks for the current question; they stay red until the right answer is chosen
  const [wrongOptions, setWrongOptions] = useState<string[]>([]);
  // Answers given this run, by question number; answered questions are shown read-only
  const [answers, setAnswers] = useState<Record<number, { correct: string; wrong: string[] }>>({});
  // Pending popover timer (correct: advance, wrong: hide or game over); cleared whenever the question changes
  const feedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Modal Control States
  const [showExitModal, setShowExitModal] = useState<boolean>(false);
  const [showRestartModal, setShowRestartModal] = useState<boolean>(false);
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
        timer = setTimeout(() => setFlowStage("stage_start_1"), 2500);
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

  // Save a high score when a game finishes
  useEffect(() => {
    if (flowStage !== "game_finished" || !selectedLevel) return;

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
    // Finishing with lives left completes the level; a later game over never undoes it
    if (lives > 0) {
      setCompletedLevels((all) => ({ ...all, [key]: true }));
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
    if (answerStatus !== null || !currentQuestion || savedAnswer) return;

    const expectedAnswer = currentQuestion.correctOption || currentQuestion.answer;
    setSelectedAnswer(selectedOption);

    if (selectedOption === expectedAnswer) {
      setAnswerStatus("correct");
      setAnswers((prev) => ({ ...prev, [questionIndex]: { correct: selectedOption, wrong: wrongOptions } }));
      setWrongOptions([]);
      // fix: score per question is now dynamic (100 / total questions in this round)
      // instead of a hardcoded +25, so a perfect run always totals exactly 100
      // regardless of how many questions the level has (10, 20, 30, etc.)
      const increment = questions.length > 0 ? 100 / questions.length : 0;
      setScore((prev) => Math.min(100, Math.round(prev + increment)));
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
      const nextLives = Math.max(0, lives - 1);
      setLives(nextLives);
      // Hide the popover on its own; nextLives because lives is still the old value here
      feedbackTimeoutRef.current = setTimeout(() => {
        feedbackTimeoutRef.current = null;
        setSelectedAnswer(null);
        setAnswerStatus(null);
        if (nextLives <= 0) {
          setFlowStage("game_finished");
        }
      }, FEEDBACK_MS);
    }
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
          <div className="whole-page-layout">
            <div className="hero-section">
              <div className="mascot-wrapper">
                <img src={yellowMascot} alt="Yellow Headphone Mascot" className="mascot-img" />
              </div>
              <h2 className="main-heading">
                Let&apos;s take a<br />game break!
              </h2>
              <p className="sub-description">
                Test your skills with engaging games that challenge your memory and rhythm recognition while having some musical fun.
              </p>
              <p className="action-prompt">Choose a game you want to play!</p>
            </div>
            <div className="right-content-section">
              <div className="tab-switcher-pill">
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
          <img src={blankBanner} alt="Stage Background" className="blank-banner-bg" />
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
          <img src={blankBanner} alt="Stage Background" className="blank-banner-bg" />
          <div className="loading-card-container">
            <div className="loading-mascot-wrapper">
              <img src={yellowMascot} alt="Loading Mascot" className="loading-mascot-img" />
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

      {/* ACTIVE GAMEPLAY STAGE */}
      {flowStage === "active_game" && (
        <div className={`active-game-stage-wrapper ${isExpanded ? "fullscreen-mode" : ""}`}>
          {!isExpanded && (
            <img src={musicStandDeskview} alt="Deskview Background" className="deskview-bg-image" />
          )}
          <div className="deskview-overlay-content">
            <div className="game-screen-card">
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
                  {/* Dynamic SVG / Staff Question Display */}
                  {currentQuestion?.questionImage ? (
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

                  <p className="question-prompt">
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
                        handleOptionClick={handleAnswerSubmit}
                      />
                    ) : selectedGameKey === "note" ? (
                      <NoteOptions
                        handleOptionClick={handleAnswerSubmit}
                        wrongOptions={savedAnswer?.wrong ?? wrongOptions}
                        correctOption={savedAnswer?.correct ?? (answerStatus === "correct" ? selectedAnswer : null)}
                        locked={!!savedAnswer || answerStatus === "wrong"}
                        level={selectedLevel ?? "easy"}
                      />
                    ) : selectedGameKey === "chord" ? (
                      <ChordOptions
                        handleOptionClick={handleAnswerSubmit}
                        level={selectedLevel ?? "easy"}
                      />
                    ) : selectedGameKey === "key" ? (
                      <KeyOptions
                        handleOptionClick={handleAnswerSubmit}
                      />
                    ) : selectedGameKey === "major-minor" ? (
                      <MajorMinorOptions
                        handleOptionClick={handleAnswerSubmit}
                      />
                    ) : selectedGameKey === "ledger" ? (
                      <LedgerOptions
                        handleOptionClick={handleAnswerSubmit}
                        level={selectedLevel ?? "easy"}
                      />
                    ) : selectedGameKey === "scale" ? (
                      <ScaleOptions
                        handleOptionClick={handleAnswerSubmit}
                        level={selectedLevel ?? "easy"}
                      />
                    ) : selectedGameKey === "interval" ? (
                      <IntervalOptions
                        handleOptionClick={handleAnswerSubmit}
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

                  {/* Footer Pagination Navigation */}
                  <div className="question-pagination">
                    {/* Prev: blocked while the Wrong popover is up, so its game-over timer can't be cancelled at 0 lives */}
                    <button
                      className="nav-arrow"
                      onClick={() => goToQuestion(Math.max(1, questionIndex - 1))}
                      disabled={questionIndex <= 1 || answerStatus === "wrong"}
                    >
                      <img src={prevIcon} alt="Previous Page" className="nav-icon prev" />
                    </button>
                    <span className="page-text">
                      {questionIndex} of {questions.length || 8}
                    </span>
                    {/* Next: only once this question has been answered */}
                    <button
                      className="nav-arrow"
                      onClick={() => goToQuestion(Math.min(questions.length || 8, questionIndex + 1))}
                      disabled={questionIndex >= (questions.length || 8) || !savedAnswer}
                    >
                      <img src={nextIcon} alt="Next Page" className="nav-icon next" />
                    </button>
                  </div>
                </div>
              </div>
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

      {/* GAME FINISHED STAGE */}
      {flowStage === "game_finished" && (
        <div className="stage-view-wrapper">
          <img src={blankBanner} alt="Stage Background" className="blank-banner-bg" />
          <div className="game-over-card">
            <img src={welcomeCat} alt="Cat Mascot" className="cat-finished-img" />
            <h2>{lives === 0 ? "Game Over!" : "Amazing!"}</h2>
            <p>
              {lives === 0
                ? "You ran out of lives. Better luck next time!"
                : "You have successfully finished this game."}
            </p>
            <h3>SCORE: {score}</h3>
            <div className="finish-actions">
              <button onClick={confirmExitGame} className="back-btn">
                Back to Games
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}