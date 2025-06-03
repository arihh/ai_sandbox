// Game constants and configuration

export const GAME_CONFIG = {
  // Grid size for the dungeon
  GRID_WIDTH: 15,
  GRID_HEIGHT: 20,
  
  // Minimap configuration
  MINIMAP_SIZE: 10,
  
  // Player stats
  INITIAL_HEALTH: 100,
  INITIAL_LEVEL: 1,
  INITIAL_EXPERIENCE: 0,
  
  // Game mechanics
  MAX_ENEMIES_PER_FLOOR: 5,
  EXPERIENCE_PER_LEVEL: 100,
  HEALTH_PER_LEVEL: 20,
  
  // Movement delays (ms)
  MOVE_DELAY: 150,
  ENEMY_MOVE_DELAY: 300,
  
  // Animation durations (ms)
  FADE_DURATION: 300,
  SLIDE_DURATION: 200,
} as const;

export const CELL_TYPES = {
  WALL: 'wall',
  FLOOR: 'floor',
  STAIRS: 'stairs',
} as const;

export const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
} as const;

export const GAME_STATES = {
  MENU: 'menu',
  PLAYING: 'playing',
  PAUSED: 'paused',
  GAME_OVER: 'game_over',
  VICTORY: 'victory',
} as const;

export const ENTITY_TYPES = {
  PLAYER: 'player',
  ENEMY: 'enemy',
  ITEM: 'item',
} as const;

// Color schemes for different themes
export const COLORS = {
  PLAYER: '#48bb78',
  ENEMY: '#e53e3e',
  WALL: '#4a5568',
  FLOOR: '#2d3748',
  STAIRS: '#d69e2e',
  HEALTH: '#e53e3e',
  EXPERIENCE: '#3182ce',
  GOLD: '#d69e2e',
} as const;

// Touch and gesture configuration
export const TOUCH_CONFIG = {
  TAP_THRESHOLD: 10, // pixels
  LONG_PRESS_DURATION: 500, // ms
  SWIPE_THRESHOLD: 50, // pixels
  SWIPE_VELOCITY: 0.3, // pixels per ms
} as const;

// Audio configuration
export const AUDIO_CONFIG = {
  MASTER_VOLUME: 0.7,
  SFX_VOLUME: 0.8,
  MUSIC_VOLUME: 0.5,
} as const;

export type CellType = typeof CELL_TYPES[keyof typeof CELL_TYPES];
export type Direction = typeof DIRECTIONS[keyof typeof DIRECTIONS];
export type GameState = typeof GAME_STATES[keyof typeof GAME_STATES];
export type EntityType = typeof ENTITY_TYPES[keyof typeof ENTITY_TYPES];