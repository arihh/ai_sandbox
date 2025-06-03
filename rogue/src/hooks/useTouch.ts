// React hook for handling touch gestures and mobile input

import { useState, useCallback, useRef, useEffect } from 'react';
import { Position, TouchPoint, SwipeGesture } from '../game/types';
import { TOUCH_CONFIG, DIRECTIONS } from '../utils/constants';

export interface UseTouchReturn {
  handlers: {
    onTouchStart: (event: React.TouchEvent) => void;
    onTouchMove: (event: React.TouchEvent) => void;
    onTouchEnd: (event: React.TouchEvent) => void;
  };
  state: {
    isPressed: boolean;
    currentTouch: TouchPoint | null;
    lastSwipe: SwipeGesture | null;
  };
}

/**
 * Custom hook for handling touch gestures on mobile devices
 * Supports tap, long press, and swipe gestures
 */
export function useTouch(
  onSwipe?: (direction: Position) => void,
  onTap?: (position: Position) => void,
  onLongPress?: (position: Position) => void
): UseTouchReturn {
  const [isPressed, setIsPressed] = useState(false);
  const [currentTouch, setCurrentTouch] = useState<TouchPoint | null>(null);
  const [lastSwipe, setLastSwipe] = useState<SwipeGesture | null>(null);
  
  const touchStartRef = useRef<TouchPoint | null>(null);
  const longPressTimeoutRef = useRef<number | null>(null);

  const clearLongPressTimeout = useCallback(() => {
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
    }
  }, []);

  const getTouchPoint = useCallback((touch: React.Touch): TouchPoint => ({
    x: touch.clientX,
    y: touch.clientY,
    timestamp: Date.now()
  }), []);

  const calculateSwipe = useCallback((start: TouchPoint, end: TouchPoint): SwipeGesture | null => {
    const deltaX = end.x - start.x;
    const deltaY = end.y - start.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const timeDelta = end.timestamp - start.timestamp;
    const velocity = distance / timeDelta;

    // Check if this qualifies as a swipe
    if (distance < TOUCH_CONFIG.SWIPE_THRESHOLD || velocity < TOUCH_CONFIG.SWIPE_VELOCITY) {
      return null;
    }

    // Determine direction
    let direction: 'up' | 'down' | 'left' | 'right';
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      direction = deltaX > 0 ? 'right' : 'left';
    } else {
      direction = deltaY > 0 ? 'down' : 'up';
    }

    return {
      start,
      end,
      direction,
      velocity,
      distance
    };
  }, []);

  const handleTouchStart = useCallback((event: React.TouchEvent) => {
    event.preventDefault();
    
    const touch = event.touches[0];
    if (!touch) return;

    const touchPoint = getTouchPoint(touch);
    touchStartRef.current = touchPoint;
    setCurrentTouch(touchPoint);
    setIsPressed(true);

    // Start long press timer
    clearLongPressTimeout();
    longPressTimeoutRef.current = setTimeout(() => {
      if (onLongPress && touchStartRef.current) {
        onLongPress({ x: touchStartRef.current.x, y: touchStartRef.current.y });
      }
    }, TOUCH_CONFIG.LONG_PRESS_DURATION);
  }, [getTouchPoint, clearLongPressTimeout, onLongPress]);

  const handleTouchMove = useCallback((event: React.TouchEvent) => {
    event.preventDefault();
    
    const touch = event.touches[0];
    if (!touch || !touchStartRef.current) return;

    const touchPoint = getTouchPoint(touch);
    setCurrentTouch(touchPoint);

    // Clear long press if touch moves too much
    const distance = Math.sqrt(
      Math.pow(touchPoint.x - touchStartRef.current.x, 2) +
      Math.pow(touchPoint.y - touchStartRef.current.y, 2)
    );

    if (distance > TOUCH_CONFIG.TAP_THRESHOLD) {
      clearLongPressTimeout();
    }
  }, [getTouchPoint, clearLongPressTimeout]);

  const handleTouchEnd = useCallback((event: React.TouchEvent) => {
    event.preventDefault();
    
    clearLongPressTimeout();
    setIsPressed(false);
    setCurrentTouch(null);

    if (!touchStartRef.current) return;

    const touch = event.changedTouches[0];
    if (!touch) return;

    const endPoint = getTouchPoint(touch);
    const swipe = calculateSwipe(touchStartRef.current, endPoint);

    if (swipe) {
      // Handle swipe gesture
      setLastSwipe(swipe);
      if (onSwipe) {
        const direction = DIRECTIONS[swipe.direction.toUpperCase() as keyof typeof DIRECTIONS];
        onSwipe(direction);
      }
    } else {
      // Handle tap gesture
      const distance = Math.sqrt(
        Math.pow(endPoint.x - touchStartRef.current.x, 2) +
        Math.pow(endPoint.y - touchStartRef.current.y, 2)
      );

      if (distance <= TOUCH_CONFIG.TAP_THRESHOLD && onTap) {
        onTap({ x: endPoint.x, y: endPoint.y });
      }
    }

    touchStartRef.current = null;
  }, [getTouchPoint, calculateSwipe, clearLongPressTimeout, onSwipe, onTap]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearLongPressTimeout();
    };
  }, [clearLongPressTimeout]);

  return {
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd
    },
    state: {
      isPressed,
      currentTouch,
      lastSwipe
    }
  };
}

/**
 * Hook for handling virtual d-pad button presses
 */
export function useVirtualPad(
  onDirectionPress: (direction: Position) => void,
  onActionPress?: (action: string) => void
) {
  const [pressedButton, setPressedButton] = useState<string | null>(null);

  const handleButtonPress = useCallback((direction: Position, buttonId: string) => {
    setPressedButton(buttonId);
    onDirectionPress(direction);
    
    // Auto-release after a short delay for visual feedback
    setTimeout(() => {
      setPressedButton(null);
    }, 150);
  }, [onDirectionPress]);

  const handleActionPress = useCallback((action: string, buttonId: string) => {
    setPressedButton(buttonId);
    if (onActionPress) {
      onActionPress(action);
    }
    
    // Auto-release after a short delay for visual feedback
    setTimeout(() => {
      setPressedButton(null);
    }, 150);
  }, [onActionPress]);

  return {
    pressedButton,
    handleButtonPress,
    handleActionPress
  };
}