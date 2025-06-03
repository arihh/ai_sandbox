import React from 'react';
import { MiniMapProps } from '../../game/types';
import { CELL_TYPES } from '../../utils/constants';

/**
 * Minimap component showing a condensed view of the dungeon
 * Displays discovered areas, player position, and important elements
 */
export const MiniMap: React.FC<MiniMapProps> = ({ 
  dungeon, 
  playerPosition, 
  visible = true 
}) => {
  if (!visible) return null;

  // Calculate scale factor for the minimap
  const scaleX = Math.max(1, Math.floor(dungeon.width / 10));
  const scaleY = Math.max(1, Math.floor(dungeon.height / 10));
  const cellsPerPixel = Math.max(scaleX, scaleY);

  // Create minimap grid
  const minimapWidth = Math.ceil(dungeon.width / cellsPerPixel);
  const minimapHeight = Math.ceil(dungeon.height / cellsPerPixel);

  const getCellClass = (x: number, y: number): string => {
    const startX = x * cellsPerPixel;
    const startY = y * cellsPerPixel;
    const endX = Math.min(startX + cellsPerPixel, dungeon.width);
    const endY = Math.min(startY + cellsPerPixel, dungeon.height);

    // Check if player is in this minimap cell
    if (
      playerPosition.x >= startX && playerPosition.x < endX &&
      playerPosition.y >= startY && playerPosition.y < endY
    ) {
      return 'minimap-cell player';
    }

    // Check for enemies in this area
    const hasEnemy = dungeon.entities.some(entity => 
      entity.type === 'enemy' &&
      entity.position.x >= startX && entity.position.x < endX &&
      entity.position.y >= startY && entity.position.y < endY
    );

    if (hasEnemy) {
      return 'minimap-cell enemy';
    }

    // Check for stairs
    if (
      dungeon.stairsPosition.x >= startX && dungeon.stairsPosition.x < endX &&
      dungeon.stairsPosition.y >= startY && dungeon.stairsPosition.y < endY
    ) {
      return 'minimap-cell stairs';
    }

    // Determine the predominant cell type in this area
    let wallCount = 0;
    let floorCount = 0;
    let discoveredCount = 0;

    for (let dy = startY; dy < endY; dy++) {
      for (let dx = startX; dx < endX; dx++) {
        if (dx < dungeon.width && dy < dungeon.height) {
          const cell = dungeon.cells[dy][dx];
          
          if (cell.discovered) {
            discoveredCount++;
            if (cell.type === CELL_TYPES.WALL) {
              wallCount++;
            } else {
              floorCount++;
            }
          }
        }
      }
    }

    // Only show discovered areas
    if (discoveredCount === 0) {
      return 'minimap-cell';
    }

    // Return the predominant type
    if (wallCount > floorCount) {
      return 'minimap-cell wall';
    } else {
      return 'minimap-cell floor';
    }
  };

  return (
    <div className="minimap">
      <div 
        className="minimap-grid"
        style={{
          gridTemplateColumns: `repeat(${minimapWidth}, 1fr)`,
          gridTemplateRows: `repeat(${minimapHeight}, 1fr)`
        }}
      >
        {Array.from({ length: minimapHeight }, (_, y) =>
          Array.from({ length: minimapWidth }, (_, x) => (
            <div
              key={`${x}-${y}`}
              className={getCellClass(x, y)}
            />
          ))
        )}
      </div>
    </div>
  );
};