import { useState } from 'react';
import { useSharedValue } from 'react-native-reanimated';
import type { PieceSymbol } from '../types';
import type { DraggingState, ComponentLayout } from '../types/bank';

interface UseBankDragParams {
  pieceSize: number;
  bankLayout: ComponentLayout;
  onPieceDropCoords?: (piece: PieceSymbol, x: number, y: number) => void;
}

/**
 * Hook to manage drag state for pieces in the piece bank
 * Handles drag start, update, and end with floating piece position tracking
 */
export const useBankDrag = ({
  pieceSize,
  bankLayout,
  onPieceDropCoords,
}: UseBankDragParams) => {
  const [dragging, setDragging] = useState<DraggingState | null>(null);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);

  const handleDragStart = (piece: PieceSymbol, startX: number, startY: number) => {
    // Position floating piece centered on touch point
    // Account for bank position since floating piece is positioned relative to bank
    const actualPieceSize = pieceSize * 0.8;
    translateX.value = startX - bankLayout.x - actualPieceSize / 2;
    translateY.value = startY - bankLayout.y - actualPieceSize / 2;
    opacity.value = 1;

    setDragging({ piece, startX, startY });
  };

  const handleDragUpdate = (absoluteX: number, absoluteY: number) => {
    // Update position centered on touch point
    // Account for bank position since floating piece is positioned relative to bank
    const actualPieceSize = pieceSize * 0.8;
    translateX.value = absoluteX - bankLayout.x - actualPieceSize / 2;
    translateY.value = absoluteY - bankLayout.y - actualPieceSize / 2;
  };

  const handleDragEnd = (finalX: number, finalY: number) => {
    if (!dragging) return;

    // Hide floating piece immediately
    opacity.value = 0;

    // Call the drop callback with absolute screen coordinates
    onPieceDropCoords?.(dragging.piece, finalX, finalY);

    // Reset dragging state
    setDragging(null);
  };

  return {
    dragging,
    translateX,
    translateY,
    opacity,
    handleDragStart,
    handleDragUpdate,
    handleDragEnd,
  };
};
