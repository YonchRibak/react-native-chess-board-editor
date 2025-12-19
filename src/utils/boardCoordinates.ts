import type { PieceSymbol } from '../types';
import { coordsToSquare } from './index';

export interface BoardLayout {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DropSquareResult {
  square: string;
  piece: PieceSymbol;
}

/**
 * Calculate which chess square a piece was dropped on
 * @param dropX - Absolute X coordinate of the drop
 * @param dropY - Absolute Y coordinate of the drop
 * @param boardLayout - Board position and dimensions
 * @param squareSize - Size of each square in pixels
 * @param flipped - Whether the board is flipped
 * @returns The square notation (e.g., 'e4') or null if dropped outside board
 */
export const calculateDropSquare = (
  dropX: number,
  dropY: number,
  boardLayout: BoardLayout,
  squareSize: number,
  flipped: boolean
): string | null => {
  // Board has a 2px border, account for it
  const BOARD_BORDER_WIDTH = 2;

  // Convert to board-relative coordinates
  const relativeX = dropX - boardLayout.x - BOARD_BORDER_WIDTH;
  const relativeY = dropY - boardLayout.y - BOARD_BORDER_WIDTH;

  const boardInnerWidth = boardLayout.width - (BOARD_BORDER_WIDTH * 2);
  const boardInnerHeight = boardLayout.height - (BOARD_BORDER_WIDTH * 2);

  // Check if dropped within board bounds
  if (
    relativeX < 0 ||
    relativeY < 0 ||
    relativeX >= boardInnerWidth ||
    relativeY >= boardInnerHeight
  ) {
    return null;
  }

  // Calculate square coordinates
  const col = Math.floor(relativeX / squareSize);
  const row = Math.floor(relativeY / squareSize);

  // Account for flipped board
  const displayRow = flipped ? 7 - row : row;
  const displayCol = flipped ? 7 - col : col;

  // Check if within valid board range
  if (displayRow < 0 || displayRow >= 8 || displayCol < 0 || displayCol >= 8) {
    return null;
  }

  return coordsToSquare({ row: displayRow, col: displayCol });
};

export interface BoardDropTarget {
  row: number;
  col: number;
}

/**
 * Calculate which board square a drag gesture ended on
 * Used for piece drag-and-drop within the board
 * @param absoluteX - Absolute X coordinate (center of dragged piece)
 * @param absoluteY - Absolute Y coordinate (center of dragged piece)
 * @param squareSize - Size of each square in pixels
 * @returns The row and col coordinates, or null if outside board bounds
 */
export const calculateBoardDropTarget = (
  absoluteX: number,
  absoluteY: number,
  squareSize: number
): BoardDropTarget | null => {
  // Center the calculation on the piece's center point
  const col = Math.floor((absoluteX + squareSize / 2) / squareSize);
  const row = Math.floor((absoluteY + squareSize / 2) / squareSize);

  // Check if dropped within board bounds
  if (row >= 0 && row < 8 && col >= 0 && col < 8) {
    return { row, col };
  }

  return null;
};
