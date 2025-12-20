import type { PieceSymbol } from './piece';

/**
 * Chess square notation (e.g., 'a1', 'h8')
 */
export type Square = string;

/**
 * Board coordinates (0-7 for both row and column)
 */
export interface BoardCoordinates {
  row: number;
  col: number;
}

/**
 * Piece placement on a square
 */
export interface PiecePlacement {
  square: Square;
  piece: PieceSymbol | null;
}

/**
 * Board state as 2D array
 */
export type BoardState = (PieceSymbol | null)[][];

/**
 * Castling rights individual flags
 */
export interface CastlingRights {
  whiteKingSide: boolean;
  whiteQueenSide: boolean;
  blackKingSide: boolean;
  blackQueenSide: boolean;
}
