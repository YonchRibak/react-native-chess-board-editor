import { useState } from 'react';
import { useSharedValue, withSpring } from 'react-native-reanimated';
import type { PieceSymbol, Square } from '../types';
import { coordsToSquare, movePiece, updatePieceAt } from '../utils/fen';
import { calculateBoardDropTarget } from '../utils/boardCoordinates';

export interface DraggingPiece {
  piece: PieceSymbol;
  sourceSquare: Square;
  sourceRow: number;
  sourceCol: number;
}

export interface UseBoardDragReturn {
  draggingPiece: DraggingPiece | null;
  translateX: ReturnType<typeof useSharedValue<number>>;
  translateY: ReturnType<typeof useSharedValue<number>>;
  isDragging: ReturnType<typeof useSharedValue<boolean>>;
  scale: ReturnType<typeof useSharedValue<number>>;
  opacity: ReturnType<typeof useSharedValue<number>>;
  handleDragStart: (row: number, col: number, piece: PieceSymbol) => void;
  handleDragEnd: (absoluteX: number, absoluteY: number) => void;
}

/**
 * Custom hook for managing board piece drag state
 * Handles drag start, drag end, and coordinate calculations
 */
export const useBoardDrag = (
  fen: string,
  onFenChange: (newFen: string) => void,
  squareSize: number
): UseBoardDragReturn => {
  const [draggingPiece, setDraggingPiece] = useState<DraggingPiece | null>(null);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const isDragging = useSharedValue(false);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const handleDragStart = (row: number, col: number, piece: PieceSymbol) => {
    const square = coordsToSquare({ row, col });
    setDraggingPiece({
      piece,
      sourceSquare: square,
      sourceRow: row,
      sourceCol: col,
    });
    isDragging.value = true;
    // Animate scale to 4x and opacity to 50% when drag starts
    scale.value = withSpring(4, { damping: 30, stiffness: 100 });
    opacity.value = withSpring(0.5, { damping: 30, stiffness: 100 });
  };

  const handleDragEnd = (absoluteX: number, absoluteY: number) => {
    if (!draggingPiece) return;

    // Store reference to dragging piece for the animation
    const currentDraggingPiece = draggingPiece;

    // Calculate which square the piece was dropped on
    const dropTarget = calculateBoardDropTarget(absoluteX, absoluteY, squareSize);

    if (dropTarget) {
      // Dropped on valid board square
      const targetSquare = coordsToSquare(dropTarget);
      const newFen = movePiece(fen, currentDraggingPiece.sourceSquare, targetSquare);
      onFenChange(newFen);
    } else {
      // Dropped outside board - remove piece
      const newFen = updatePieceAt(fen, currentDraggingPiece.sourceSquare, null);
      onFenChange(newFen);
    }

    // Animate scale back to 1 and fade out the floating piece
    scale.value = withSpring(1, { damping: 30, stiffness: 100 });
    opacity.value = withSpring(0, { damping: 30, stiffness: 100 }, (finished) => {
      'worklet';
      if (finished) {
        // Hide floating piece after animation completes
        isDragging.value = false;
      }
    });

    // Reset dragging state after animation duration
    setTimeout(() => {
      setDraggingPiece(null);
    }, 300);
  };

  return {
    draggingPiece,
    translateX,
    translateY,
    isDragging,
    scale,
    opacity,
    handleDragStart,
    handleDragEnd,
  };
};
