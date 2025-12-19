import type { PieceSymbol } from './index';

/**
 * State tracking which piece is currently being dragged from the bank
 */
export interface DraggingState {
  piece: PieceSymbol;
  startX: number;
  startY: number;
}

/**
 * Layout information for a component's position and dimensions
 * Can be used for any component that needs to track its screen position
 */
export interface ComponentLayout {
  x: number;
  y: number;
  width: number;
  height: number;
}
