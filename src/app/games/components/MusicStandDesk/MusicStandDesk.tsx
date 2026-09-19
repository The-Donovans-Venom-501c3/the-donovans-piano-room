import React, { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { livesAtom, scoreAtom } from '@/store/game-atoms';
import './MusicStandDesk.scss';

// Visual Assets
const sadCat = '/games/sadCat.svg';
const affirmationSuccessCat = '/games/Affirmation_Success_Character.svg';
const volumeIcon = '/games/Volume.svg';
const accessibilityIcon = '/games/Accessibility.svg';
const expandIcon = '/games/Minimize.svg';
const closeIcon = '/games/Close.svg';
const timerIcon = '/games/Timer.svg';
const scoreIcon = '/games/Score.svg';
const livesIcon = '/games/Lives.svg';
const pauseIcon = '/games/Pause1.svg';
const restartIcon = '/games/Restart1.svg';
const trebleClefIcon = '/games/MusicSymbol.png';

interface Option {
  id: string;
  label: string;
}

const optionsList: Option[] = [
  { id: 'C', label: 'C' }, { id: 'D', label: 'D' }, { id: 'E', label: 'E' }, { id: 'F', label: 'F' }, { id: 'G', label: 'G' }, { id: 'A', label: 'A' }, { id: 'B', label: 'B' },
  { id: 'C#', label: 'C#' }, { id: 'D#', label: 'D#' }, { id: 'E#', label: 'E#' }, { id: 'F#', label: 'F#' }, { id: 'G#', label: 'G#' }, { id: 'A#', label: 'A#' }, { id: 'B#', label: 'B#' },
  { id: 'Cb', label: 'C♭' }, { id: 'Db', label: 'D♭' }, { id: 'Eb', label: 'E♭' }, { id: 'Fb', label: 'F♭' }, { id: 'Gb', label: 'G♭' }, { id: 'Ab', label: 'A♭' }, { id: 'Bb', label: 'B♭' },
];

// Options are rendered as a 7-column grid; the first 2 rows are the natural
// and sharp rows so the feedback popover (which covers cols 1-3, rows 1-2)
// lines up with the Figma layout.
const OPTION_ROWS = [optionsList.slice(0, 7), optionsList.slice(7, 14), optionsList.slice(14, 21)];

type NotePosition = '1st-space' | '2nd-line' | '3rd-line' | '3rd-space';

interface MusicStandDeskProps {
  questionTitle?: string;
  correctAnswer?: string;
  notePosition?: NotePosition;
  currentQuestionIndex?: number;
  totalQuestions?: number;
  onSelectOption?: (optionId: string) => void;
  onClose?: () => void;
}

export default function MusicStandDesk({
  questionTitle = 'What note is shown?',
  correctAnswer = 'G',
  notePosition = '2nd-line',
  currentQuestionIndex = 1,
  totalQuestions = 8,
  onSelectOption,
  onClose,
}: MusicStandDeskProps) {
  const [lives, setLives] = useAtom(livesAtom);
  const [score, setScore] = useAtom(scoreAtom);

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answerStatus, setAnswerStatus] = useState<'correct' | 'incorrect' | null>(null);
  const [volume, setVolume] = useState<number>(80);
  const [questionIndex, setQuestionIndex] = useState<number>(currentQuestionIndex);

  // Reset feedback state when question updates
  useEffect(() => {
    setSelectedOption(null);
    setAnswerStatus(null);
  }, [questionTitle]);

  const handleOptionClick = (optionId: string) => {
    if (answerStatus !== null) return;
    setSelectedOption(optionId);

    if (optionId === correctAnswer) {
      setAnswerStatus('correct');
      setScore((prev) => prev + 10);
    } else {
      setAnswerStatus('incorrect');
      setLives((prev) => Math.max(0, prev - 1));
    }

    if (onSelectOption) {
      onSelectOption(optionId);
    }
  };

  const resetFeedback = () => {
    setSelectedOption(null);
    setAnswerStatus(null);
  };

  const handleRestart = () => {
    setScore(0);
    setLives(3);
    setQuestionIndex(1);
    setSelectedOption(null);
    setAnswerStatus(null);
  };

  return (
    <div className="music-stand-desk-container">
      {/* Top Header Actions */}
      <div className="desk-header">
        <div className="volume-control">
          <img src={volumeIcon} alt="Volume" className="volume-svg" />
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="volume-slider-input"
            style={{
              background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${volume}%, #e2d2f1 ${volume}%, #e2d2f1 100%)`,
            }}
          />
        </div>

        <div className="header-actions">
          <button className="icon-circle-btn" title="Accessibility">
            <img src={accessibilityIcon} alt="Accessibility" />
          </button>
          <button className="pill-btn expand">
            <img src={expandIcon} alt="Expand" className="btn-icon" />
            <span>Expand</span>
          </button>
          <button className="pill-btn close" onClick={onClose} title="Close">
            <img src={closeIcon} alt="Close" className="btn-icon" />
            <span>Close</span>
          </button>
        </div>
      </div>

      <div className="desk-gameplay-area">
        {/* Staff & Question Area */}
        <div className="staff-section">
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

            <div className={`note-marker position-${notePosition}`}>
              <svg width="24" height="18" viewBox="0 0 24 18" fill="none">
                <ellipse cx="12" cy="9" rx="10" ry="7" fill="#2B1236" transform="rotate(-15 12 9)" />
                <ellipse cx="12" cy="9" rx="5" ry="3" fill="#FFFFFF" transform="rotate(-35 12 9)" />
              </svg>
            </div>
          </div>
        </div>

        {/* Question + Options Grid */}
        <div className="options-grid-wrapper">
          <p className="question-title">{questionTitle}</p>

          <div className="note-options-grid">
            {/* Wrong Answer Feedback Overlay */}
            {answerStatus === 'incorrect' && (
              <div className="feedback-card wrong">
                <div className="speech-bubble">
                  <p className="feedback-title">Oops, that&apos;s not the right answer.</p>
                  <p className="feedback-sub">Sorry, we need to take one of your lives.</p>
                  <button className="try-again-btn" onClick={resetFeedback}>
                    TRY AGAIN
                  </button>
                </div>
                <img src={sadCat} alt="Sad Cat" className="feedback-mascot" />
              </div>
            )}

            {/* Correct Answer Feedback Overlay */}
            {answerStatus === 'correct' && (
              <div className="feedback-card correct">
                <div className="speech-bubble">
                  <p className="feedback-title">Correct answer, good job!</p>
                </div>
                <img src={affirmationSuccessCat} alt="Success Mascot" className="feedback-mascot" />
              </div>
            )}

            {OPTION_ROWS.map((row, rowIndex) =>
              row.map((opt, colIndex) => {
                // Hide the top-left 3x2 block when showing the wrong-answer popover
                if (answerStatus === 'incorrect' && rowIndex < 2 && colIndex < 3) {
                  return null;
                }

                let buttonStateClass = '';
                if (opt.id === selectedOption) {
                  buttonStateClass = answerStatus === 'correct' ? 'correct-option' : 'wrong-option';
                } else if (answerStatus === 'correct' && opt.id === correctAnswer) {
                  buttonStateClass = 'correct-option';
                }

                return (
                  <button
                    key={opt.id}
                    className={`option-btn ${buttonStateClass}`}
                    style={{ gridRow: rowIndex + 1, gridColumn: colIndex + 1 }}
                    onClick={() => handleOptionClick(opt.id)}
                  >
                    {opt.label}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Sidebar Info (Timer, Score, Lives, Pause/Restart, Pagination) */}
        <div className="game-sidebar">
          <div className="info-stat">
            <img src={timerIcon} alt="Timer" className="stat-icon" />
            <span className="stat-value">00:00</span>
            <span className="stat-label">TIMER</span>
          </div>

          <div className="info-stat">
            <img src={scoreIcon} alt="Score" className="stat-icon" />
            <span className="stat-value">{score}/100</span>
            <span className="stat-label">SCORE</span>
          </div>

          <div className="info-stat lives-block">
            <div className="lives-icons">
              {[1, 2, 3].map((index) => (
                <img
                  key={index}
                  src={livesIcon}
                  alt="Life"
                  className={`note-life ${index <= lives ? 'active' : 'lost'}`}
                />
              ))}
            </div>
            <span className="stat-label">LIVES ({lives}/3)</span>
          </div>

          <div className="sidebar-actions">
            <button className="action-circle-btn" title="Pause">
              <div className="circle-bg">
                <img src={pauseIcon} alt="Pause" />
              </div>
              <span>PAUSE</span>
            </button>
            <button className="action-circle-btn" onClick={handleRestart} title="Restart">
              <div className="circle-bg">
                <img src={restartIcon} alt="Restart" />
              </div>
              <span>RESTART</span>
            </button>
          </div>

          <div className="question-pagination">
            <button
              className="nav-arrow"
              onClick={() => setQuestionIndex((prev) => Math.max(1, prev - 1))}
            >
              ‹
            </button>
            <span>{questionIndex} of {totalQuestions}</span>
            <button
              className="nav-arrow"
              onClick={() => setQuestionIndex((prev) => Math.min(totalQuestions, prev + 1))}
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}