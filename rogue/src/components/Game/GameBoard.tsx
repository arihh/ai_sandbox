import React from 'react';
import { GameBoardProps } from '../../game/types';
import { useTouch } from '../../hooks/useTouch';
import { MiniMap } from '../UI/MiniMap';

/**
 * Main game board component displaying the dungeon, player, and entities
 * Handles touch gestures for movement and interactions
 */
export const GameBoard: React.FC<GameBoardProps> = ({ 
  dungeon, 
  onPlayerMove,
  onCellClick 
}) => {
  const { handlers } = useTouch(
    onPlayerMove, // Handle swipe gestures for movement
    onCellClick  // Handle tap gestures for cell interaction
  );

  // Find player position from dungeon entities or use center if not found
  const playerPosition = dungeon.entities.find(e => e.type === 'player')?.position || 
                        { x: Math.floor(dungeon.width / 2), y: Math.floor(dungeon.height / 2) };

  const getCellClass = (x: number, y: number): string => {
    const cell = dungeon.cells[y][x];
    let className = `cell ${cell.type}`;
    
    if (!cell.discovered) {
      className += ' undiscovered';
    } else if (!cell.visible) {
      className += ' fog';
    }
    
    return className;
  };

  const renderEntity = (x: number, y: number) => {
    const entity = dungeon.entities.find(e => 
      e.position.x === x && e.position.y === y
    );
    
    if (!entity) return null;

    // Only render entities in visible or discovered areas
    const cell = dungeon.cells[y][x];
    if (!cell.visible && entity.type === 'enemy') return null;

    return (
      <div
        key={entity.id}
        className={`${entity.type} ${entity.type === 'player' ? 'pulse' : ''}`}
        style={{
          position: 'absolute',
          left: '1px',
          top: '1px',
          pointerEvents: 'none'
        }}
      />
    );
  };

  return (
    <div className="game-board" {...handlers}>
      <div className="dungeon-container">
        <div 
          className="dungeon-grid"
          style={{
            gridTemplateColumns: `repeat(${dungeon.width}, 20px)`,
            gridTemplateRows: `repeat(${dungeon.height}, 20px)`
          }}
        >
          {dungeon.cells.map((row, y) =>
            row.map((_, x) => (
              <div
                key={`${x}-${y}`}
                className={getCellClass(x, y)}
                data-x={x}
                data-y={y}
              >
                {renderEntity(x, y)}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Minimap overlay */}
      <MiniMap 
        dungeon={dungeon}
        playerPosition={playerPosition}
        visible={true}
      />
    </div>
  );
};