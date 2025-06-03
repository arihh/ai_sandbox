// Simple dungeon generation algorithm for the roguelike game

import { GAME_CONFIG, CELL_TYPES } from '../utils/constants';
import { Dungeon, Cell, Position, Enemy, Entity } from './types';

/**
 * Generates a random dungeon using a simple cellular automata approach
 * Ensures connectivity and places stairs at the end
 */
export function generateDungeon(floor: number): Dungeon {
  const { GRID_WIDTH, GRID_HEIGHT, MAX_ENEMIES_PER_FLOOR } = GAME_CONFIG;
  
  // Initialize grid with all walls
  const cells: Cell[][] = [];
  for (let y = 0; y < GRID_HEIGHT; y++) {
    cells[y] = [];
    for (let x = 0; x < GRID_WIDTH; x++) {
      cells[y][x] = {
        type: CELL_TYPES.WALL,
        position: { x, y },
        discovered: false,
        visible: false
      };
    }
  }

  // Create a room-based layout
  const rooms = generateRooms(GRID_WIDTH, GRID_HEIGHT);
  
  // Apply rooms to the grid
  rooms.forEach(room => {
    for (let y = room.y; y < room.y + room.height; y++) {
      for (let x = room.x; x < room.x + room.width; x++) {
        if (x >= 0 && x < GRID_WIDTH && y >= 0 && y < GRID_HEIGHT) {
          cells[y][x].type = CELL_TYPES.FLOOR;
        }
      }
    }
  });

  // Connect rooms with corridors
  connectRooms(cells, rooms, GRID_WIDTH, GRID_HEIGHT);

  // Find suitable positions for player start and stairs
  const floorPositions = getFloorPositions(cells);
  const playerStartPosition = floorPositions[0];
  const stairsPosition = floorPositions[floorPositions.length - 1];
  
  // Place stairs
  if (stairsPosition) {
    cells[stairsPosition.y][stairsPosition.x].type = CELL_TYPES.STAIRS;
  }

  // Generate enemies
  const entities: Entity[] = generateEnemies(floorPositions, floor, MAX_ENEMIES_PER_FLOOR);

  // Add player entity to the dungeon
  const playerEntity: Entity = {
    id: 'player',
    type: 'player',
    position: playerStartPosition || { x: 1, y: 1 },
    health: 100,
    maxHealth: 100
  };

  entities.push(playerEntity);

  return {
    width: GRID_WIDTH,
    height: GRID_HEIGHT,
    cells,
    entities,
    playerStartPosition: playerStartPosition || { x: 1, y: 1 },
    stairsPosition: stairsPosition || { x: GRID_WIDTH - 2, y: GRID_HEIGHT - 2 },
    floor
  };
}

interface Room {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Generate a set of rooms that don't overlap
 */
function generateRooms(gridWidth: number, gridHeight: number): Room[] {
  const rooms: Room[] = [];
  const maxRooms = 6 + Math.floor(Math.random() * 4); // 6-9 rooms
  const maxAttempts = 50;

  for (let i = 0; i < maxRooms; i++) {
    let attempts = 0;
    let room: Room;

    do {
      const width = 3 + Math.floor(Math.random() * 6); // 3-8 width
      const height = 3 + Math.floor(Math.random() * 6); // 3-8 height
      const x = 1 + Math.floor(Math.random() * (gridWidth - width - 2));
      const y = 1 + Math.floor(Math.random() * (gridHeight - height - 2));

      room = { x, y, width, height };
      attempts++;
    } while (attempts < maxAttempts && roomsOverlap(room, rooms));

    if (attempts < maxAttempts) {
      rooms.push(room);
    }
  }

  return rooms;
}

/**
 * Check if a room overlaps with existing rooms
 */
function roomsOverlap(newRoom: Room, existingRooms: Room[]): boolean {
  return existingRooms.some(room => 
    newRoom.x < room.x + room.width + 1 &&
    newRoom.x + newRoom.width + 1 > room.x &&
    newRoom.y < room.y + room.height + 1 &&
    newRoom.y + newRoom.height + 1 > room.y
  );
}

/**
 * Connect rooms with corridors
 */
function connectRooms(cells: Cell[][], rooms: Room[], gridWidth: number, gridHeight: number): void {
  for (let i = 0; i < rooms.length - 1; i++) {
    const roomA = rooms[i];
    const roomB = rooms[i + 1];

    // Get center points of each room
    const centerA = {
      x: Math.floor(roomA.x + roomA.width / 2),
      y: Math.floor(roomA.y + roomA.height / 2)
    };
    const centerB = {
      x: Math.floor(roomB.x + roomB.width / 2),
      y: Math.floor(roomB.y + roomB.height / 2)
    };

    // Create L-shaped corridor
    if (Math.random() < 0.5) {
      // Horizontal first, then vertical
      createHorizontalCorridor(cells, centerA.x, centerB.x, centerA.y, gridWidth, gridHeight);
      createVerticalCorridor(cells, centerB.x, centerA.y, centerB.y, gridWidth, gridHeight);
    } else {
      // Vertical first, then horizontal
      createVerticalCorridor(cells, centerA.x, centerA.y, centerB.y, gridWidth, gridHeight);
      createHorizontalCorridor(cells, centerA.x, centerB.x, centerB.y, gridWidth, gridHeight);
    }
  }
}

/**
 * Create a horizontal corridor between two x coordinates
 */
function createHorizontalCorridor(
  cells: Cell[][], 
  x1: number, 
  x2: number, 
  y: number, 
  gridWidth: number, 
  gridHeight: number
): void {
  const startX = Math.min(x1, x2);
  const endX = Math.max(x1, x2);
  
  for (let x = startX; x <= endX; x++) {
    if (x >= 0 && x < gridWidth && y >= 0 && y < gridHeight) {
      cells[y][x].type = CELL_TYPES.FLOOR;
    }
  }
}

/**
 * Create a vertical corridor between two y coordinates
 */
function createVerticalCorridor(
  cells: Cell[][], 
  x: number, 
  y1: number, 
  y2: number, 
  gridWidth: number, 
  gridHeight: number
): void {
  const startY = Math.min(y1, y2);
  const endY = Math.max(y1, y2);
  
  for (let y = startY; y <= endY; y++) {
    if (x >= 0 && x < gridWidth && y >= 0 && y < gridHeight) {
      cells[y][x].type = CELL_TYPES.FLOOR;
    }
  }
}

/**
 * Get all floor positions from the dungeon
 */
function getFloorPositions(cells: Cell[][]): Position[] {
  const positions: Position[] = [];
  
  for (let y = 0; y < cells.length; y++) {
    for (let x = 0; x < cells[y].length; x++) {
      if (cells[y][x].type === CELL_TYPES.FLOOR) {
        positions.push({ x, y });
      }
    }
  }
  
  return positions;
}

/**
 * Generate enemies for the current floor
 */
function generateEnemies(floorPositions: Position[], floor: number, maxEnemies: number): Enemy[] {
  const enemies: Enemy[] = [];
  const numEnemies = Math.min(
    Math.floor(1 + floor * 0.5 + Math.random() * 3),
    maxEnemies,
    floorPositions.length - 2 // Reserve space for player and stairs
  );

  // Enemy types with different stats based on floor
  const enemyTypes = [
    { name: 'Goblin', emoji: '🦀', health: 20, attack: 5, experience: 10, gold: 5 },
    { name: 'Orc', emoji: '🦊', health: 40, attack: 8, experience: 20, gold: 10 },
    { name: 'Troll', emoji: '🐲', health: 80, attack: 12, experience: 40, gold: 20 },
  ];

  for (let i = 0; i < numEnemies; i++) {
    // Skip first and last positions (reserved for player and stairs)
    const positionIndex = 1 + Math.floor(Math.random() * (floorPositions.length - 2));
    const position = floorPositions[positionIndex];
    
    // Choose enemy type based on floor
    const enemyTypeIndex = Math.min(
      Math.floor(floor / 3) + Math.floor(Math.random() * 2),
      enemyTypes.length - 1
    );
    const enemyType = enemyTypes[enemyTypeIndex];

    // Scale stats with floor
    const floorMultiplier = 1 + (floor - 1) * 0.2;

    const enemy: Enemy = {
      id: `enemy_${i}_${Date.now()}`,
      type: 'enemy',
      position: { ...position },
      name: enemyType.name,
      emoji: enemyType.emoji,
      health: Math.floor(enemyType.health * floorMultiplier),
      maxHealth: Math.floor(enemyType.health * floorMultiplier),
      attack: Math.floor(enemyType.attack * floorMultiplier),
      defense: Math.floor(2 * floorMultiplier),
      experienceReward: Math.floor(enemyType.experience * floorMultiplier),
      goldReward: Math.floor(enemyType.gold * floorMultiplier),
      aiType: Math.random() < 0.7 ? 'aggressive' : 'passive'
    };

    enemies.push(enemy);
    
    // Remove this position from available positions
    floorPositions.splice(positionIndex, 1);
  }

  return enemies;
}