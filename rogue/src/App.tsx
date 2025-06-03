import { GameLayout } from './components/Layout/MobileLayout';
import { StatusBar } from './components/UI/StatusBar';
import { VirtualPad } from './components/UI/VirtualPad';
import { GameOverScreen } from './components/UI/GameOverScreen';
import { GameBoard } from './components/Game/GameBoard';
import { useGameState } from './hooks/useGameState';
import { audioManager } from './utils/audioManager';
import { useEffect } from 'react';
import './styles/mobile.css';
import './styles/game.css';

/**
 * Main App component for the mobile roguelike game
 * Manages the overall game state and coordinates UI components
 */
function App() {
  const { gameState, actions, derived } = useGameState();

  // Initialize audio on first user interaction
  useEffect(() => {
    const handleFirstInteraction = () => {
      audioManager.resumeAudioContext();
      document.removeEventListener('touchstart', handleFirstInteraction);
      document.removeEventListener('click', handleFirstInteraction);
    };

    document.addEventListener('touchstart', handleFirstInteraction);
    document.addEventListener('click', handleFirstInteraction);

    return () => {
      document.removeEventListener('touchstart', handleFirstInteraction);
      document.removeEventListener('click', handleFirstInteraction);
    };
  }, []);

  const handleDirectionPress = (direction: { x: number; y: number }) => {
    if (derived.canMove) {
      actions.movePlayerBy(direction);
    }
  };

  const handleActionPress = (action: string) => {
    switch (action) {
      case 'attack':
        // Attack action would be handled here
        console.log('Attack action');
        break;
      case 'menu':
        // Menu action would be handled here
        console.log('Menu action');
        break;
      default:
        break;
    }
  };

  const handleCellClick = (position: { x: number; y: number }) => {
    // Handle cell click interactions
    console.log('Cell clicked:', position);
  };

  return (
    <GameLayout
      statusBar={
        <StatusBar
          player={gameState.player}
          floor={gameState.currentFloor}
          turnCount={gameState.turnCount}
        />
      }
      gameBoard={
        <GameBoard
          dungeon={gameState.dungeon}
          onPlayerMove={handleDirectionPress}
          onCellClick={handleCellClick}
        />
      }
      controls={
        <VirtualPad
          onDirectionPress={handleDirectionPress}
          onActionPress={handleActionPress}
          disabled={!derived.canMove}
        />
      }
      overlay={
        derived.isGameOver && (
          <GameOverScreen
            score={derived.finalScore}
            floor={gameState.currentFloor}
            turnCount={gameState.turnCount}
            onRestart={actions.restartGame}
            onMenu={actions.startNewGame}
          />
        )
      }
    />
  );
}

export default App;
