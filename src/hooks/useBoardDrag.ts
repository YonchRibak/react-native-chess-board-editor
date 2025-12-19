import { useState } from 'react';
import { useSharedValue } from 'react-native-reanimated';
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

  const handleDragStart = (row: number, col: number, piece: PieceSymbol) => {
    const square = coordsToSquare({ row, col });
    setDraggingPiece({
      piece,
      sourceSquare: square,
      sourceRow: row,
      sourceCol: col,
    });
    isDragging.value = true;
  };

  const handleDragEnd = (absoluteX: number, absoluteY: number) => {
    if (!draggingPiece) return;

    // Hide floating piece immediately
    isDragging.value = false;

    // Calculate which square the piece was dropped on
    const dropTarget = calculateBoardDropTarget(absoluteX, absoluteY, squareSize);

    if (dropTarget) {
      // Dropped on valid board square
      const targetSquare = coordsToSquare(dropTarget);
      const newFen = movePiece(fen, draggingPiece.sourceSquare, targetSquare);
      onFenChange(newFen);
    } else {
      // Dropped outside board - remove piece
      const newFen = updatePieceAt(fen, draggingPiece.sourceSquare, null);
      onFenChange(newFen);
    }

    // Reset dragging state
    setDraggingPiece(null);
  };

  return {
    draggingPiece,
    translateX,
    translateY,
    isDragging,
    handleDragStart,
    handleDragEnd,
  };
};
