// Type definitions for the roguelike game

import { CellType, EntityType, GameState } from '../utils/constants';

// Basic position interface
export interface Position {
  x: number;
  y: number;
}

// Dungeon cell interface
export interface Cell {
  type: CellType;
  position: Position;
  discovered?: boolean;
  visible?: boolean;
}

// Base entity interface
export interface Entity {
  id: string;
  type: EntityType;
  position: Position;
  health: number;
  maxHealth: number;
  attack?: number;
  defense?: number;
}

// Player specific interface
export interface Player extends Entity {
  type: 'player';
  level: number;
  experience: number;
  experienceToNext: number;
  gold: number;
  inventory: Item[];
}

// Enemy specific interface
export interface Enemy extends Entity {
  type: 'enemy';
  name: string;
  experienceReward: number;
  goldReward: number;
  aiType: 'passive' | 'aggressive' | 'guard';
}

// Item interface
export interface Item {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'consumable' | 'treasure';
  description: string;
  value: number;
  effects?: ItemEffect[];
}

// Item effect interface
export interface ItemEffect {
  type: 'heal' | 'attack' | 'defense' | 'experience';
  value: number;
  duration?: number; // for temporary effects
}

// Dungeon interface
export interface Dungeon {
  width: number;
  height: number;
  cells: Cell[][];
  entities: Entity[];
  playerStartPosition: Position;
  stairsPosition: Position;
  floor: number;
}

// Game state interface
export interface GameStateData {
  state: GameState;
  player: Player;
  dungeon: Dungeon;
  currentFloor: number;
  gameStartTime: number;
  lastMoveTime: number;
  score: number;
  turnCount: number;
}

// Touch and gesture interfaces
export interface TouchPoint {
  x: number;
  y: number;
  timestamp: number;
}

export interface SwipeGesture {
  start: TouchPoint;
  end: TouchPoint;
  direction: 'up' | 'down' | 'left' | 'right';
  velocity: number;
  distance: number;
}

// UI state interfaces
export interface UIState {
  showMinimap: boolean;
  showInventory: boolean;
  selectedItem?: Item;
  notifications: Notification[];
}

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  duration: number;
  timestamp: number;
}

// Audio interfaces
export interface AudioState {
  masterVolume: number;
  sfxVolume: number;
  musicVolume: number;
  muted: boolean;
}

// Component prop interfaces
export interface GameBoardProps {
  dungeon: Dungeon;
  onPlayerMove: (direction: Position) => void;
  onCellClick?: (position: Position) => void;
}

export interface VirtualPadProps {
  onDirectionPress: (direction: Position) => void;
  onActionPress: (action: string) => void;
  disabled?: boolean;
}

export interface StatusBarProps {
  player: Player;
  floor: number;
  turnCount: number;
}

export interface MiniMapProps {
  dungeon: Dungeon;
  playerPosition: Position;
  visible?: boolean;
}

export interface GameOverScreenProps {
  score: number;
  floor: number;
  turnCount: number;
  onRestart: () => void;
  onMenu: () => void;
}

// Utility type for component refs
export interface GameComponentRefs {
  gameBoard?: HTMLDivElement;
  virtualPad?: HTMLDivElement;
  statusBar?: HTMLDivElement;
}

// Animation and transition types
export type AnimationType = 'fade' | 'slide' | 'bounce' | 'scale';

export interface AnimationConfig {
  type: AnimationType;
  duration: number;
  delay?: number;
  easing?: string;
}

// Error types
export class GameError extends Error {
  constructor(
    message: string,
    public code: string,
    public context?: unknown
  ) {
    super(message);
    this.name = 'GameError';
  }
}

export type GameErrorType = 
  | 'INVALID_MOVE'
  | 'ENTITY_NOT_FOUND'
  | 'DUNGEON_GENERATION_FAILED'
  | 'SAVE_LOAD_ERROR'
  | 'AUDIO_ERROR';