import { Gesture } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
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
  return Gesture.Pan()
    .onStart((event) => {
      // Get the absolute screen position where the drag started
      const initialX = event.absoluteX;
      const initialY = event.absoluteY;

      runOnJS(onDragStart)(piece, initialX, initialY);
    })
    .onUpdate((event) => {
      // Update floating piece position during drag
      runOnJS(onDragUpdate)(event.absoluteX, event.absoluteY);
    })
    .onEnd((event) => {
      // Report final absolute position for drop calculation
      const finalX = event.absoluteX;
      const finalY = event.absoluteY;

      runOnJS(onDragEnd)(finalX, finalY);
    });
};
