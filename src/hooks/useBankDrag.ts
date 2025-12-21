import { useState, useRef } from 'react';
import { useSharedValue, withSpring } from 'react-native-reanimated';
import type { PieceSymbol } from '../types';
import type { DraggingState, ComponentLayout } from '../types/bank';

interface UseBankDragParams {
  floatingPieceSize: number;
  bankLayout: ComponentLayout;
  onPieceDropCoords?: (piece: PieceSymbol, x: number, y: number) => void;
}

/**
 * Hook to manage drag state for pieces in the piece bank
 * Handles drag start, update, and end with floating piece position tracking
 */
export const useBankDrag = ({
  floatingPieceSize,
  bankLayout,
  onPieceDropCoords,
}: UseBankDragParams) => {
  const [dragging, setDragging] = useState<DraggingState | null>(null);
  const draggingRef = useRef<DraggingState | null>(null);
  const cleanupTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(1);

  const handleDragStart = (piece: PieceSymbol, startX: number, startY: number) => {
    // Clear any pending cleanup from previous drag
    if (cleanupTimeoutRef.current) {
      clearTimeout(cleanupTimeoutRef.current);
      cleanupTimeoutRef.current = null;
    }

    // Position floating piece centered on touch point
    // Account for bank position since floating piece is positioned relative to bank
    translateX.value = startX - bankLayout.x - floatingPieceSize / 2;
    translateY.value = startY - bankLayout.y - floatingPieceSize / 2;
    // Animate opacity to 50% and scale to 4x when drag starts
    opacity.value = withSpring(0.5, { damping: 30, stiffness: 100 });
    scale.value = withSpring(4, { damping: 30, stiffness: 100 });

    const draggingData = { piece, startX, startY };
    setDragging(draggingData);
    draggingRef.current = draggingData; // Store in ref for immediate access
  };

  const handleDragUpdate = (absoluteX: number, absoluteY: number) => {
    // Update position centered on touch point
    // Account for bank position since floating piece is positioned relative to bank
    translateX.value = absoluteX - bankLayout.x - floatingPieceSize / 2;
    translateY.value = absoluteY - bankLayout.y - floatingPieceSize / 2;
  };

  const handleDragEnd = (finalX: number, finalY: number) => {
    // Use ref instead of state to avoid race condition
    const currentDragging = draggingRef.current;

    if (!currentDragging) return;

    // Call the drop callback with absolute screen coordinates
    onPieceDropCoords?.(currentDragging.piece, finalX, finalY);

    // Reset dragging state immediately so bank piece is fully visible
    setDragging(null);

    // Animate scale back to 1 and fade out the floating piece
    scale.value = withSpring(1, { damping: 30, stiffness: 100 });
    opacity.value = withSpring(0, { damping: 30, stiffness: 100 });

    // Failsafe: Reset all state after animation duration
    // This ensures cleanup happens even if animation callbacks don't fire
    cleanupTimeoutRef.current = setTimeout(() => {
      setDragging(null);
      draggingRef.current = null;
      opacity.value = 0;
      scale.value = 1;
      cleanupTimeoutRef.current = null;
    }, 300);
  };

  return {
    dragging,
    translateX,
    translateY,
    opacity,
    scale,
    handleDragStart,
    handleDragUpdate,
    handleDragEnd,
  };
};
