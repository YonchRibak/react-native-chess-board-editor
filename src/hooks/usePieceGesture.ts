import { useSharedValue } from 'react-native-reanimated';
import { Gesture } from 'react-native-gesture-handler';
import { runOnJS, withSpring, SharedValue } from 'react-native-reanimated';
import type { PieceSymbol } from '../types';

export interface UsePieceGestureParams {
  piece: PieceSymbol | null;
  row: number;
  col: number;
  squareSize: number;
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
      translateX.value = initialX - squareSize / 2;
      translateY.value = initialY - squareSize / 2;

      runOnJS(onDragStart)(row, col, piece);
    })
    .onUpdate((event) => {
      if (!piece) return;
      // Center the floating piece on the touch point
      translateX.value = startX.value + event.translationX - squareSize / 2;
      translateY.value = startY.value + event.translationY - squareSize / 2;
    })
    .onEnd((event) => {
      if (!piece) return;
      const finalX = startX.value + event.translationX;
      const finalY = startY.value + event.translationY;

      runOnJS(onDragEnd)(finalX, finalY);

      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    });

  return panGesture;
};
