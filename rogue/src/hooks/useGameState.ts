// React hook for managing game state

import { useState, useCallback, useEffect } from 'react';
import { GameStateData, Position } from '../game/types';
import { createNewGame, movePlayer, updateVisibility, calculateScore } from '../game/gameLogic';
import { GAME_CONFIG, GAME_STATES } from '../utils/constants';

export interface UseGameStateReturn {
  gameState: GameStateData;
  actions: {
    startNewGame: () => void;
    movePlayerBy: (direction: Position) => void;
    pauseGame: () => void;
    resumeGame: () => void;
    restartGame: () => void;
  };
  derived: {
    canMove: boolean;
    finalScore: number;
    isGameOver: boolean;
    isPlaying: boolean;
  };
}

/**
 * Custom hook for managing the complete game state
 * Handles game initialization, player actions, and state updates
 */
export function useGameState(): UseGameStateReturn {
  const [gameState, setGameState] = useState<GameStateData>(() => createNewGame());

  // Actions
  const startNewGame = useCallback(() => {
    const newGame = createNewGame();
    setGameState(updateVisibility(newGame));
  }, []);

  const movePlayerBy = useCallback((direction: Position) => {
    setGameState(currentState => {
      // Check if movement is allowed
      if (currentState.state !== GAME_STATES.PLAYING) {
        return currentState;
      }

      // Check movement delay to prevent too rapid movement
      const now = Date.now();
      if (now - currentState.lastMoveTime < GAME_CONFIG.MOVE_DELAY) {
        return currentState;
      }

      // Apply movement and update game state
      const newState = movePlayer(currentState, direction);
      return updateVisibility(newState);
    });
  }, []);

  const pauseGame = useCallback(() => {
    setGameState(currentState => ({
      ...currentState,
      state: currentState.state === GAME_STATES.PLAYING ? GAME_STATES.PAUSED : currentState.state
    }));
  }, []);

  const resumeGame = useCallback(() => {
    setGameState(currentState => ({
      ...currentState,
      state: currentState.state === GAME_STATES.PAUSED ? GAME_STATES.PLAYING : currentState.state
    }));
  }, []);

  const restartGame = useCallback(() => {
    startNewGame();
  }, [startNewGame]);

  // Derived values
  const canMove = gameState.state === GAME_STATES.PLAYING;
  const finalScore = calculateScore(gameState);
  const isGameOver = gameState.state === GAME_STATES.GAME_OVER;
  const isPlaying = gameState.state === GAME_STATES.PLAYING;

  // Initialize the game with visibility on first load
  useEffect(() => {
    setGameState(currentState => updateVisibility(currentState));
  }, []);

  return {
    gameState,
    actions: {
      startNewGame,
      movePlayerBy,
      pauseGame,
      resumeGame,
      restartGame
    },
    derived: {
      canMove,
      finalScore,
      isGameOver,
      isPlaying
    }
  };
}