import type { PieceSymbol } from './piece';
import type { Square } from './board';

/**
 * Drag event data
 */
export interface DragEventData {
  piece: PieceSymbol;
  sourceSquare: Square | null; // null if from PieceBank
  targetSquare: Square | null; // null if dropped outside board
}
