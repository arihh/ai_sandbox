import React from 'react';
import { StatusBarProps } from '../../game/types';

/**
 * Status bar component showing player stats and game info
 * Optimized for mobile display with clear, large indicators
 */
export const StatusBar: React.FC<StatusBarProps> = ({ 
  player, 
  floor, 
  turnCount 
}) => {
  const healthPercentage = (player.health / player.maxHealth) * 100;
  const experiencePercentage = (player.experience / player.experienceToNext) * 100;

  return (
    <div className="status-bar">
      {/* Health */}
      <div className="status-group">
        <div className="status-label text-health">HP</div>
        <div className="status-value text-health">
          {player.health}/{player.maxHealth}
        </div>
        <div className="health-bar">
          <div 
            className="health-fill" 
            style={{ width: `${healthPercentage}%` }}
          />
        </div>
      </div>

      {/* Level */}
      <div className="status-group">
        <div className="status-label text-level">LVL</div>
        <div className="status-value text-level">{player.level}</div>
        <div className="experience-bar">
          <div 
            className="experience-fill" 
            style={{ width: `${experiencePercentage}%` }}
          />
        </div>
      </div>

      {/* Gold */}
      <div className="status-group">
        <div className="status-label text-gold">GOLD</div>
        <div className="status-value text-gold">{player.gold}</div>
      </div>

      {/* Floor */}
      <div className="status-group">
        <div className="status-label">FLOOR</div>
        <div className="status-value">{floor}</div>
      </div>

      {/* Turn count (useful for speedrunning) */}
      <div className="status-group">
        <div className="status-label">TURNS</div>
        <div className="status-value">{turnCount}</div>
      </div>
    </div>
  );
};