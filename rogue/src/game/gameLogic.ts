// Game state management and core game logic

import { GAME_CONFIG, GAME_STATES, CELL_TYPES } from '../utils/constants';
import { GameStateData, Player, Position, Enemy, Entity } from './types';
import { generateDungeon } from './dungeonGenerator';
import { audioManager } from '../utils/audioManager';

/**
 * Initialize a new game state
 */
export function createNewGame(): GameStateData {
  const dungeon = generateDungeon(1);
  
  const player: Player = {
    id: 'player',
    type: 'player',
    position: { ...dungeon.playerStartPosition },
    health: GAME_CONFIG.INITIAL_HEALTH,
    maxHealth: GAME_CONFIG.INITIAL_HEALTH,
    level: GAME_CONFIG.INITIAL_LEVEL,
    experience: GAME_CONFIG.INITIAL_EXPERIENCE,
    experienceToNext: GAME_CONFIG.EXPERIENCE_PER_LEVEL,
    gold: 0,
    inventory: [],
    attack: 10,
    defense: 5
  };

  return {
    state: GAME_STATES.PLAYING,
    player,
    dungeon,
    currentFloor: 1,
    gameStartTime: Date.now(),
    lastMoveTime: Date.now(),
    score: 0,
    turnCount: 0
  };
}

/**
 * Check if a position is valid (within bounds and not a wall)
 */
export function isValidPosition(
  position: Position, 
  dungeon: GameStateData['dungeon']
): boolean {
  const { x, y } = position;
  
  if (x < 0 || x >= dungeon.width || y < 0 || y >= dungeon.height) {
    return false;
  }
  
  return dungeon.cells[y][x].type !== CELL_TYPES.WALL;
}

/**
 * Get entity at a specific position
 */
export function getEntityAtPosition(
  position: Position,
  entities: Entity[]
): Entity | null {
  return entities.find(entity => 
    entity.position.x === position.x && entity.position.y === position.y
  ) || null;
}

/**
 * Move player and handle interactions
 */
export function movePlayer(
  gameState: GameStateData,
  direction: Position
): GameStateData {
  const newPosition = {
    x: gameState.player.position.x + direction.x,
    y: gameState.player.position.y + direction.y
  };

  // Check if the new position is valid
  if (!isValidPosition(newPosition, gameState.dungeon)) {
    return gameState; // Invalid move, return unchanged state
  }

  // Check for entity at target position
  const targetEntity = getEntityAtPosition(newPosition, gameState.dungeon.entities);
  
  let newGameState = { ...gameState };

  if (targetEntity && targetEntity.type === 'enemy') {
    // Combat with enemy
    newGameState = handleCombat(newGameState, targetEntity as Enemy);
  } else {
    // Normal movement
    newGameState.player = {
      ...newGameState.player,
      position: newPosition
    };
    
    // Play move sound
    audioManager.playMove();
    
    // Check if player reached stairs
    if (
      newPosition.x === gameState.dungeon.stairsPosition.x &&
      newPosition.y === gameState.dungeon.stairsPosition.y
    ) {
      newGameState = advanceToNextFloor(newGameState);
      audioManager.playStairs();
    }
  }

  // Update turn count and last move time
  newGameState.turnCount += 1;
  newGameState.lastMoveTime = Date.now();

  // Move enemies after player moves
  newGameState = moveEnemies(newGameState);

  return newGameState;
}

/**
 * Handle combat between player and enemy
 */
function handleCombat(gameState: GameStateData, enemy: Enemy): GameStateData {
  let newGameState = { ...gameState };

  // Player attacks enemy
  const playerDamage = Math.max(1, gameState.player.attack! - (enemy.defense || 0));
  enemy.health -= playerDamage;

  // Play attack sound
  audioManager.playAttack();

  if (enemy.health <= 0) {
    // Enemy defeated
    audioManager.playEnemyHit();
    newGameState = defeatEnemy(newGameState, enemy);
  } else {
    // Enemy attacks back
    const enemyDamage = Math.max(1, enemy.attack! - (gameState.player.defense || 0));
    newGameState.player = {
      ...newGameState.player,
      health: Math.max(0, newGameState.player.health - enemyDamage)
    };

    // Check if player died
    if (newGameState.player.health <= 0) {
      newGameState.state = GAME_STATES.GAME_OVER;
      audioManager.playGameOver();
    }
  }

  return newGameState;
}

/**
 * Handle enemy defeat - give rewards and remove enemy
 */
function defeatEnemy(gameState: GameStateData, enemy: Enemy): GameStateData {
  let newGameState = { ...gameState };

  // Remove enemy from entities
  newGameState.dungeon = {
    ...newGameState.dungeon,
    entities: newGameState.dungeon.entities.filter(e => e.id !== enemy.id)
  };

  // Give rewards
  const newExperience = newGameState.player.experience + enemy.experienceReward;
  const newGold = newGameState.player.gold + enemy.goldReward;
  
  newGameState.player = {
    ...newGameState.player,
    position: enemy.position, // Move to enemy's position
    experience: newExperience,
    gold: newGold
  };

  // Update score
  newGameState.score += enemy.experienceReward * 10 + enemy.goldReward;

  // Check for level up
  if (newExperience >= newGameState.player.experienceToNext) {
    newGameState = levelUpPlayer(newGameState);
    audioManager.playLevelUp();
  }

  // Play pickup sound
  audioManager.playPickup();

  return newGameState;
}

/**
 * Level up the player
 */
function levelUpPlayer(gameState: GameStateData): GameStateData {
  const newLevel = gameState.player.level + 1;
  const healthIncrease = GAME_CONFIG.HEALTH_PER_LEVEL;
  
  return {
    ...gameState,
    player: {
      ...gameState.player,
      level: newLevel,
      experience: gameState.player.experience - gameState.player.experienceToNext,
      experienceToNext: GAME_CONFIG.EXPERIENCE_PER_LEVEL + (newLevel - 1) * 20,
      maxHealth: gameState.player.maxHealth + healthIncrease,
      health: gameState.player.health + healthIncrease,
      attack: gameState.player.attack! + 2,
      defense: gameState.player.defense! + 1
    }
  };
}

/**
 * Advance to the next floor
 */
function advanceToNextFloor(gameState: GameStateData): GameStateData {
  const nextFloor = gameState.currentFloor + 1;
  const newDungeon = generateDungeon(nextFloor);
  
  return {
    ...gameState,
    dungeon: newDungeon,
    currentFloor: nextFloor,
    player: {
      ...gameState.player,
      position: { ...newDungeon.playerStartPosition }
    },
    score: gameState.score + nextFloor * 100 // Bonus for reaching new floor
  };
}

/**
 * Simple AI for enemy movement
 */
function moveEnemies(gameState: GameStateData): GameStateData {
  const newGameState = { ...gameState };
  const enemies = newGameState.dungeon.entities.filter(e => e.type === 'enemy') as Enemy[];
  
  enemies.forEach(enemy => {
    if (enemy.aiType === 'passive') return; // Passive enemies don't move
    
    // Simple AI: move towards player if in range
    const distanceToPlayer = Math.abs(enemy.position.x - gameState.player.position.x) +
                             Math.abs(enemy.position.y - gameState.player.position.y);
    
    if (distanceToPlayer <= 5) { // Aggro range
      const possibleMoves: Array<{ x: number; y: number }> = [
        { x: 0, y: -1 }, // Up
        { x: 0, y: 1 },  // Down
        { x: -1, y: 0 }, // Left
        { x: 1, y: 0 }   // Right
      ];
      
      // Find move that gets closest to player
      let bestMove: { x: number; y: number } | null = null;
      let bestDistance = distanceToPlayer;
      
      possibleMoves.forEach(move => {
        const newPos = {
          x: enemy.position.x + move.x,
          y: enemy.position.y + move.y
        };
        
        if (isValidPosition(newPos, gameState.dungeon)) {
          const targetEntity = getEntityAtPosition(newPos, gameState.dungeon.entities);
          
          // Don't move into other entities (except player for combat)
          if (!targetEntity || targetEntity.type === 'player') {
            const newDistance = Math.abs(newPos.x - gameState.player.position.x) +
                               Math.abs(newPos.y - gameState.player.position.y);
            
            if (newDistance < bestDistance) {
              bestDistance = newDistance;
              bestMove = { x: move.x, y: move.y };
            }
          }
        }
      });
      
      // Apply the best move
      if (bestMove) {
        const move = bestMove as { x: number; y: number };
        const newX = enemy.position.x + move.x;
        const newY = enemy.position.y + move.y;
        enemy.position = { x: newX, y: newY };
      }
    }
  });
  
  return newGameState;
}

/**
 * Calculate player's score based on various factors
 */
export function calculateScore(gameState: GameStateData): number {
  const timeBonus = Math.max(0, 10000 - (Date.now() - gameState.gameStartTime) / 1000);
  const floorBonus = gameState.currentFloor * 1000;
  const levelBonus = gameState.player.level * 500;
  const goldBonus = gameState.player.gold * 10;
  
  return Math.floor(gameState.score + timeBonus + floorBonus + levelBonus + goldBonus);
}

/**
 * Update visibility for fog of war effect
 */
export function updateVisibility(gameState: GameStateData, viewRadius: number = 3): GameStateData {
  const newGameState = { ...gameState };
  const playerPos = gameState.player.position;
  
  // Reset all visibility
  for (let y = 0; y < newGameState.dungeon.height; y++) {
    for (let x = 0; x < newGameState.dungeon.width; x++) {
      newGameState.dungeon.cells[y][x] = {
        ...newGameState.dungeon.cells[y][x],
        visible: false
      };
    }
  }
  
  // Set visible cells within view radius
  for (let dy = -viewRadius; dy <= viewRadius; dy++) {
    for (let dx = -viewRadius; dx <= viewRadius; dx++) {
      const x = playerPos.x + dx;
      const y = playerPos.y + dy;
      
      if (x >= 0 && x < newGameState.dungeon.width && 
          y >= 0 && y < newGameState.dungeon.height) {
        
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance <= viewRadius) {
          newGameState.dungeon.cells[y][x] = {
            ...newGameState.dungeon.cells[y][x],
            visible: true,
            discovered: true
          };
        }
      }
    }
  }
  
  return newGameState;
}