import React from 'react';
import './Welcome.module.scss'; // Adjust to your preferred stylesheet setup

export type Level = 'easy' | 'medium' | 'hard';

interface WelcomeStepProps {
  onSelectLevel: (level: Level) => void;
}

const welcomeCat = '/games/Welcome_Character.svg';

export const WelcomeStep: React.FC<WelcomeStepProps> = ({ onSelectLevel }) => {
  return (
    <div className="welcome-container">
      <div className="welcome-card">
        <h2>
          Welcome to the <span>Note Identification Game</span>
        </h2>

        <div className="welcome-body" style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
          {/* Mascot & Speech Section */}
          <div className="mascot-section" style={{ flex: 1 }}>
            <div className="speech-bubble">
              <p className="description">
                Hey Superstars! Get ready for musical fun. Identify the note on the staff and move to the next level with less than three mistakes. Learn note basics and become a pro!
              </p>
              <p className="instruction">
                <strong>Choose the level you want to play!</strong>
              </p>
            </div>
            <img src={welcomeCat} alt="Piano Cat Mascot" className="cat-mascot" style={{ width: '180px', marginTop: '10px' }} />
          </div>

          {/* Level Selection Buttons */}
          <div className="level-buttons-container" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <button
              type="button"
              className="level-btn easy"
              onClick={() => onSelectLevel('easy')}
            >
              Easy
            </button>
            <button
              type="button"
              className="level-btn medium"
              onClick={() => onSelectLevel('medium')}
            >
              Medium
            </button>
            <button
              type="button"
              className="level-btn hard"
              onClick={() => onSelectLevel('hard')}
            >
              Hard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeStep;