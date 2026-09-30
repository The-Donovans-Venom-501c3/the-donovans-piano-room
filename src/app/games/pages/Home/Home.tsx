"use client";
import React, { useState, useEffect } from "react";
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

// Imports from types and utils using correct relative paths
import type { GameType, Level, Question } from "../../types";
import { getQuestions } from "../../utils/questions";

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
const welcomeCat = "/games/sadCat.svg";
const cryingCat = "/games/cryingCat.svg";
const successCharacter = "/games/Affirmation_Success_Character.svg";
const blankBanner = "/games/BlankBanner.png";
const mainBanner = "/games/Banner.png";

// Gameplay Control SVGs
const accessibilityIcon = "/games/Accessibility.svg";
const timerIcon = "/games/Timer.svg";
const scoreIcon = "/games/Score.svg";
const pauseIcon = "/games/Pause1.svg";
const restartIcon = "/games/Restart1.svg";
const trebleClefIcon = "/games/MusicSymbol.png";

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

const FULL_NOTE_ROWS: string[][] = [
  ["C", "D", "E", "F", "G", "A", "B"],
  ["C#", "D#", "E#", "F#", "G#", "A#", "B#"],
  ["Cb", "Db", "Eb", "Fb", "Gb", "Ab", "Bb"],
];

export default function Home() {
  const setAppState = useSetAtom(appStateAtom);
  const setGameState = useSetAtom(gameStateAtom);
  const setLevelState = useSetAtom(levelStateAtom);
  const [flowStage, setFlowStage] = useState<GameFlowStage>("dashboard");
  const [selectedGameTitle, setSelectedGameTitle] = useState("Note Identification Game");
  const [selectedGameKey, setSelectedGameKey] = useState<GameType>("note");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [, setSelectedLevel] = useState<DifficultyLevel | null>(null);
  const [activeTab, setActiveTab] = useState<"dashboard" | "report">("dashboard");
  const setLoadingState = useSetAtom(loadingStateAtom);
  const setQuizState = useSetAtom(quizStateAtom);
  const [score, setScore] = useAtom(scoreAtom);
  const [lives, setLives] = useAtom(livesAtom);
  const [questionIndex, setQuestionIndex] = useAtom(questionAtom);

  // Gameplay Control States
  const [volume, setVolume] = useState<number>(80);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerStatus, setAnswerStatus] = useState<"correct" | "wrong" | null>(null);
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

  const handleSelectGame = (gameKey: GameType, title: string) => {
    setGameState(gameKey as unknown as Parameters<typeof setGameState>[0]);
    setSelectedGameTitle(title);
    setSelectedGameKey(gameKey);
    setSelectedAnswer(null);
    setAnswerStatus(null);
    setFlowStage("banner");
  };

  const handleSelectLevel = (level: DifficultyLevel) => {
    if (level === "hard") return;

    // Load dynamic questions from questions.ts utility
    const loadedQuestions = getQuestions(selectedGameKey, level as Level) || [];
    setQuestions(loadedQuestions);

    setLevelState(level);
    setSelectedLevel(level);
    setLoadingState("loading");
    setQuizState("quiz");
    setScore(0);
    setLives(3);
    setQuestionIndex(1);
    setTimerSeconds(0);
    setIsPaused(false);
    setSelectedAnswer(null);
    setAnswerStatus(null);
    setFlowStage("loading_screen");
  };

  const currentQuestion =
    questions.length > 0 ? questions[(questionIndex - 1) % questions.length] : null;

  const handleAnswerSubmit = (selectedOption: string) => {
    if (answerStatus !== null || !currentQuestion) return;

    const expectedAnswer = currentQuestion.correctOption || currentQuestion.answer;
    setSelectedAnswer(selectedOption);

    if (selectedOption === expectedAnswer) {
      setAnswerStatus("correct");
      // fix: score per question is now dynamic (100 / total questions in this round)
      // instead of a hardcoded +25, so a perfect run always totals exactly 100
      // regardless of how many questions the level has (10, 20, 30, etc.)
      const increment = questions.length > 0 ? 100 / questions.length : 0;
      setScore((prev) => Math.min(100, Math.round(prev + increment)));
      setTimeout(() => {
        setSelectedAnswer(null);
        setAnswerStatus(null);
        if (questionIndex >= (questions.length || 8)) {
          setFlowStage("game_finished");
        } else {
          setQuestionIndex((prev) => prev + 1);
        }
      }, 1500);
    } else {
      setAnswerStatus("wrong");
      const nextLives = Math.max(0, lives - 1);
      setLives(nextLives);
    }
  };

  const handleTryAgain = () => {
    setSelectedAnswer(null);
    setAnswerStatus(null);
    if (lives <= 0) {
      setFlowStage("game_finished");
    }
  };

  // Exit Modal Actions
  const triggerExitGame = () => {
    setShowExitModal(true);
  };

  const confirmExitGame = () => {
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
    setQuestionIndex(1);
    setTimerSeconds(0);
    setSelectedAnswer(null);
    setAnswerStatus(null);
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
                  title="Virtual instrument"
                  tips="Play virtual instruments"
                  hoverColor="#ffffff"
                  hoverBorderColor="#ffffff"
                  onClick={() => handleSelectGame("reading", "Virtual Instrument Game")}
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
                  <div className="difficulty-card easy" onClick={() => handleSelectLevel("easy")}>
                    <div className="card-left">
                      <span className="level-title">Easy</span>
                      <span className="high-score-tag">Your Highest Score: 100</span>
                    </div>
                    <div className="card-status-icon">
                      <img src={playedLevelIcon} alt="Played Level" />
                    </div>
                  </div>
                  <div className="difficulty-card medium" onClick={() => handleSelectLevel("medium")}>
                    <div className="card-left">
                      <span className="level-title">Medium</span>
                    </div>
                    <div className="card-status-icon">
                      <img src={goldPadlockIcon} alt="Gold Padlock" />
                    </div>
                  </div>
                  <div className="difficulty-card hard locked">
                    <div className="card-left">
                      <span className="level-title">Hard</span>
                    </div>
                    <div className="card-status-icon">
                      <img src={greyPadlockIcon} alt="Grey Padlock" />
                    </div>
                  </div>
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
              {/* Top Controls */}
              <div className="game-top-bar">
                <div className="volume-control">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="volume-icon">
                    <path
                      d="M11 5L6 9H2V15H6L11 19V5Z"
                      stroke="#8B5CF6"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M15.54 8.46C16.4774 9.39764 17.004 10.6692 17.004 11.995C17.004 13.3208 16.4774 14.5924 15.54 15.53"
                      stroke="#8B5CF6"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
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
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="control-btn-icon">
                        <polyline points="4 14 10 14 10 20" />
                        <polyline points="20 10 14 10 14 4" />
                        <line x1="14" y1="10" x2="21" y2="3" />
                        <line x1="3" y1="21" x2="10" y2="14" />
                      </svg>
                      <span>Minimize</span>
                    </button>
                  ) : (
                    <button className="pill-btn expand-btn" onClick={() => setIsExpanded(true)}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="control-btn-icon">
                        <polyline points="15 3 21 3 21 9" />
                        <polyline points="9 21 3 21 3 15" />
                        <line x1="21" y1="3" x2="14" y2="10" />
                        <line x1="3" y1="21" x2="10" y2="14" />
                      </svg>
                      <span>Expand</span>
                    </button>
                  )}
                  <button className="pill-btn close-btn" onClick={triggerExitGame} title="Close">
                    <span className="close-x">✕</span>
                    <span>Close</span>
                  </button>
                </div>
              </div>

              {/* Game Body */}
              <div className="game-screen-body">
                <div className="game-screen-left">
                  {/* Dynamic SVG / Staff Question Display */}
                  {currentQuestion?.questionImage ? (
                    <div className="question-image-container" style={{ textAlign: "center", margin: "1rem 0" }}>
                      <img
                        src={currentQuestion.questionImage}
                        alt="Question SVG"
                        className="question-svg-image"
                        style={{ maxHeight: "180px", maxWidth: "100%", objectFit: "contain" }}
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

                  {/* Options Matrix & Callout Overlays */}
                  <div className="keyboard-matrix-wrapper">
                    {answerStatus === "wrong" && (
                      <div className="callout-overlay wrong-overlay">
                        <div className="yellow-popover-card">
                          <p className="popover-title">Oops, that&apos;s not the right answer.</p>
                          <p className="popover-sub">Sorry, we need to take one of your lives.</p>
                          <button className="try-again-btn" onClick={handleTryAgain}>
                            TRY AGAIN
                          </button>
                        </div>
                        <img src={welcomeCat} alt="Cat Mascot" className="mascot-img-callout" />
                      </div>
                    )}
                    {answerStatus === "correct" && (
                      <div className="callout-overlay correct-overlay">
                        <div className="green-popover-card">
                          <p className="popover-title">Correct answer, good job!</p>
                        </div>
                        <img src={successCharacter} alt="Success Mascot" className="mascot-img-callout" />
                      </div>
                    )}

                    {/* Display JSON Multiple Choice Options if present, else fallback to full keyboard */}
                    {currentQuestion?.options && currentQuestion.options.length > 0 ? (
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
                    <div className="game-stat">
                      <span className="stat-label">TIMER</span>
                      <div className="stat-value-row">
                        <img src={timerIcon} alt="Timer" className="stat-icon" />
                        <span className="stat-value">{formatTime(timerSeconds)}</span>
                      </div>
                    </div>
                    {/* SCORE Section */}
                    <div className="game-stat">
                      <span className="stat-label">SCORE</span>
                      <div className="stat-value-row">
                        <img src={scoreIcon} alt="Score" className="stat-icon" />
                        <span className="stat-value">{score}/100</span>
                      </div>
                    </div>
                    {/* LIVES Section */}
                    <div className="game-stat lives-block">
                      <span className="stat-label">LIVES ({lives}/3)</span>
                      <div className="lives-quaver-bar">
                        {[0, 1, 2].map((index) => {
                          const isActive = index < lives;
                          return (
                            <span key={index} className={`single-quaver ${isActive ? "active" : "lost"}`}>
                              ♪
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* PAUSE / RESTART Controls */}
                  <div className="game-action-buttons">
                    <button className="action-circle-btn" onClick={() => setIsPaused((prev) => !prev)}>
                      <div className="circle-bg orange">
                        <img src={pauseIcon} alt="Pause" />
                      </div>
                      <span className="action-label">{isPaused ? "RESUME" : "PAUSE"}</span>
                    </button>
                    <button className="action-circle-btn" onClick={triggerRestartGame}>
                      <div className="circle-bg orange">
                        <img src={restartIcon} alt="Restart" />
                      </div>
                      <span className="action-label">RESTART</span>
                    </button>
                  </div>

                  {/* Footer Pagination Navigation */}
                  <div className="question-pagination">
                    <button
                      className="nav-arrow"
                      onClick={() => setQuestionIndex((prev) => Math.max(1, prev - 1))}
                    >
                      ‹
                    </button>
                    <span className="page-text">
                      &lt; {questionIndex} of {questions.length || 8} &gt;
                    </span>
                    <button
                      className="nav-arrow"
                      onClick={() => setQuestionIndex((prev) => Math.min(questions.length || 8, prev + 1))}
                    >
                      ›
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