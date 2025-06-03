import React from 'react';
import { GameOverScreenProps } from '../../game/types';

/**
 * Game over screen component with final statistics and restart options
 */
export const GameOverScreen: React.FC<GameOverScreenProps> = ({
  score,
  floor,
  turnCount,
  onRestart,
  onMenu
}) => {
  return (
    <div className="game-over-overlay fade-in">
      <div className="game-over-content slide-up">
        <h2 className="game-over-title">Game Over</h2>
        
        <div className="game-over-stats">
          <div className="stat-line">
            <span className="stat-label">Final Score:</span>
            <span className="stat-value text-gold">{score.toLocaleString()}</span>
          </div>
          
          <div className="stat-line">
            <span className="stat-label">Floors Reached:</span>
            <span className="stat-value text-level">{floor}</span>
          </div>
          
          <div className="stat-line">
            <span className="stat-label">Turns Taken:</span>
            <span className="stat-value">{turnCount.toLocaleString()}</span>
          </div>
          
          <div className="stat-line">
            <span className="stat-label">Efficiency:</span>
            <span className="stat-value text-mana">
              {floor > 0 ? Math.round(score / turnCount) : 0} pts/turn
            </span>
          </div>
        </div>

        <div className="game-over-buttons">
          <button 
            className="btn btn-primary"
            onClick={onRestart}
          >
            Play Again
          </button>
          
          <button 
            className="btn btn-secondary"
            onClick={onMenu}
          >
            Main Menu
          </button>
        </div>
      </div>
    </div>
  );
};