import { Gesture } from 'react-native-gesture-handler';
import { runOnJS, useSharedValue } from 'react-native-reanimated';
import type { PieceSymbol } from '../types';

interface UseBankPieceGestureParams {
  piece: PieceSymbol;
  onDragStart: (piece: PieceSymbol, x: number, y: number) => void;
  onDragUpdate: (x: number, y: number) => void;
  onDragEnd: (x: number, y: number) => void;
}

/**
 * Hook to create pan gesture configuration for draggable bank pieces
 * Encapsulates gesture logic for pieces in the piece bank
 */
export const useBankPieceGesture = ({
  piece,
  onDragStart,
  onDragUpdate,
  onDragEnd,
}: UseBankPieceGestureParams) => {
  const hasEnded = useSharedValue(false);
  const startAbsoluteX = useSharedValue(0);
  const startAbsoluteY = useSharedValue(0);

  return Gesture.Pan()
    .onStart((event) => {
      // Get the absolute screen position where the drag started
      const initialX = event.absoluteX;
      const initialY = event.absoluteY;

      startAbsoluteX.value = initialX;
      startAbsoluteY.value = initialY;
      hasEnded.value = false;

      runOnJS(onDragStart)(piece, initialX, initialY);
    })
    .onUpdate((event) => {
      // Update floating piece position during drag
      runOnJS(onDragUpdate)(event.absoluteX, event.absoluteY);
    })
    .onEnd((event) => {
      if (hasEnded.value) return;
      hasEnded.value = true;

      // Report final absolute position for drop calculation
      const finalX = event.absoluteX;
      const finalY = event.absoluteY;

      runOnJS(onDragEnd)(finalX, finalY);
    })
    .onFinalize(() => {
      // Failsafe: ensure onDragEnd is called even if onEnd doesn't fire
      // This handles cancelled/failed gestures
      if (hasEnded.value) return;
      hasEnded.value = true;

      // For cancelled gestures from bank, use starting position
      runOnJS(onDragEnd)(startAbsoluteX.value, startAbsoluteY.value);
    });
};
