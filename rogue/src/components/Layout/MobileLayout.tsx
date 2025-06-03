import React from 'react';
import '../../styles/mobile.css';
import '../../styles/game.css';

interface MobileLayoutProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Main layout component optimized for mobile portrait orientation
 * Provides the basic structure for the roguelike game UI
 */
export const MobileLayout: React.FC<MobileLayoutProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`game-container safe-area no-zoom ${className}`}>
      {children}
    </div>
  );
};

interface GameLayoutProps {
  statusBar: React.ReactNode;
  gameBoard: React.ReactNode;
  controls: React.ReactNode;
  overlay?: React.ReactNode;
}

/**
 * Complete game layout with header, main game area, and controls
 */
export const GameLayout: React.FC<GameLayoutProps> = ({
  statusBar,
  gameBoard,
  controls,
  overlay
}) => {
  return (
    <MobileLayout>
      {/* Status bar at the top */}
      <header className="game-header">
        {statusBar}
      </header>

      {/* Main game area */}
      <main className="game-main">
        {gameBoard}
      </main>

      {/* Virtual controls at the bottom */}
      <footer className="game-footer">
        {controls}
      </footer>

      {/* Overlay for modals, game over screen, etc. */}
      {overlay && (
        <div className="game-overlay">
          {overlay}
        </div>
      )}
    </MobileLayout>
  );
};