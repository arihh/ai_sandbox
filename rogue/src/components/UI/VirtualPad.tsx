import React from 'react';
import { VirtualPadProps } from '../../game/types';
import { DIRECTIONS } from '../../utils/constants';
import { useVirtualPad } from '../../hooks/useTouch';

/**
 * Virtual D-Pad component for mobile touch controls
 * Provides directional movement and action buttons
 */
export const VirtualPad: React.FC<VirtualPadProps> = ({ 
  onDirectionPress, 
  onActionPress,
  disabled = false
}) => {
  const { pressedButton, handleButtonPress, handleActionPress } = useVirtualPad(
    onDirectionPress,
    onActionPress
  );

  const buttonClass = (buttonId: string) => 
    `dpad-button ${pressedButton === buttonId ? 'active' : ''} ${disabled ? 'disabled' : ''}`;

  return (
    <div className="virtual-pad">
      {/* D-Pad for movement */}
      <div className="dpad-container">
        {/* Up button */}
        <button
          className={`${buttonClass('up')} dpad-up`}
          onTouchStart={(e) => {
            e.preventDefault();
            if (!disabled) {
              handleButtonPress(DIRECTIONS.UP, 'up');
            }
          }}
          disabled={disabled}
        >
          <div className="arrow arrow-up" />
        </button>

        {/* Down button */}
        <button
          className={`${buttonClass('down')} dpad-down`}
          onTouchStart={(e) => {
            e.preventDefault();
            if (!disabled) {
              handleButtonPress(DIRECTIONS.DOWN, 'down');
            }
          }}
          disabled={disabled}
        >
          <div className="arrow arrow-down" />
        </button>

        {/* Left button */}
        <button
          className={`${buttonClass('left')} dpad-left`}
          onTouchStart={(e) => {
            e.preventDefault();
            if (!disabled) {
              handleButtonPress(DIRECTIONS.LEFT, 'left');
            }
          }}
          disabled={disabled}
        >
          <div className="arrow arrow-left" />
        </button>

        {/* Right button */}
        <button
          className={`${buttonClass('right')} dpad-right`}
          onTouchStart={(e) => {
            e.preventDefault();
            if (!disabled) {
              handleButtonPress(DIRECTIONS.RIGHT, 'right');
            }
          }}
          disabled={disabled}
        >
          <div className="arrow arrow-right" />
        </button>

        {/* Center button (could be used for wait/skip turn) */}
        <div className="dpad-center" />
      </div>

      {/* Action buttons */}
      <div className="action-buttons">
        {/* Attack/Interact button */}
        <button
          className={`action-btn ${pressedButton === 'action' ? 'active' : ''}`}
          onTouchStart={(e) => {
            e.preventDefault();
            if (!disabled) {
              handleActionPress('attack', 'action');
            }
          }}
          disabled={disabled}
        >
          ⚔️
        </button>

        {/* Inventory/Menu button */}
        <button
          className={`action-btn ${pressedButton === 'menu' ? 'active' : ''}`}
          onTouchStart={(e) => {
            e.preventDefault();
            if (!disabled) {
              handleActionPress('menu', 'menu');
            }
          }}
          disabled={disabled}
        >
          🎒
        </button>
      </div>
    </div>
  );
};