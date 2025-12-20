import { useSharedValue } from 'react-native-reanimated';
import { Gesture } from 'react-native-gesture-handler';
import { runOnJS, SharedValue } from 'react-native-reanimated';
import type { PieceSymbol } from '../types';

export interface UsePieceGestureParams {
  piece: PieceSymbol | null;
  row: number;
  col: number;
  squareSize: number;
  pieceSize: number;
  onDragStart: (row: number, col: number, piece: PieceSymbol) => void;
  onDragEnd: (x: number, y: number) => void;
  translateX: SharedValue<number>;
  translateY: SharedValue<number>;
}

/**
 * Custom hook for creating pan gesture for draggable pieces
 * Encapsulates all gesture handling logic
 */
export const usePieceGesture = ({
  piece,
  row,
  col,
  squareSize,
  pieceSize,
  onDragStart,
  onDragEnd,
  translateX,
  translateY,
}: UsePieceGestureParams) => {
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .enabled(!!piece) // Only enable gesture if piece exists
    .onStart(() => {
      if (!piece) return;
      // Calculate the piece's actual position on the board (center of square)
      const initialX = col * squareSize + squareSize / 2;
      const initialY = row * squareSize + squareSize / 2;

      startX.value = initialX;
      startY.value = initialY;
      // Center floating piece on the touch point using actual piece size
      translateX.value = initialX - pieceSize / 2;
      translateY.value = initialY - pieceSize / 2;

      runOnJS(onDragStart)(row, col, piece);
    })
    .onUpdate((event) => {
      if (!piece) return;
      // Center the floating piece on the touch point using actual piece size
      translateX.value = startX.value + event.translationX - pieceSize / 2;
      translateY.value = startY.value + event.translationY - pieceSize / 2;
    })
    .onEnd((event) => {
      if (!piece) return;
      const finalX = startX.value + event.translationX;
      const finalY = startY.value + event.translationY;

      runOnJS(onDragEnd)(finalX, finalY);

      // Don't reset position - let the floating piece fade out at its current location
      // The useBoardDrag hook handles the fade-out animation
    });

  return panGesture;
};
