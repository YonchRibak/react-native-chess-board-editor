import type { PieceSymbol } from '../types';

/**
 * Chess piece constants and mappings
 */

/**
 * All white pieces for piece bank
 */
export const WHITE_PIECES: PieceSymbol[] = ['P', 'N', 'B', 'R', 'Q', 'K'];

/**
 * All black pieces for piece bank
 */
export const BLACK_PIECES: PieceSymbol[] = ['p', 'n', 'b', 'r', 'q', 'k'];

/**
 * All pieces in order for piece bank display
 */
export const ALL_PIECES_ORDERED: PieceSymbol[] = [
  ...WHITE_PIECES,
  ...BLACK_PIECES,
];

/**
 * Piece names mapping
 */
export const PIECE_NAMES: Record<PieceSymbol, string> = {
  P: 'White Pawn',
  N: 'White Knight',
  B: 'White Bishop',
  R: 'White Rook',
  Q: 'White Queen',
  K: 'White King',
  p: 'Black Pawn',
  n: 'Black Knight',
  b: 'Black Bishop',
  r: 'Black Rook',
  q: 'Black Queen',
  k: 'Black King',
};

/**
 * Piece Unicode symbols for text rendering
 */
export const PIECE_UNICODE: Record<PieceSymbol, string> = {
  P: '♙',
  N: '♘',
  B: '♗',
  R: '♖',
  Q: '♕',
  K: '♔',
  p: '♟',
  n: '♞',
  b: '♝',
  r: '♜',
  q: '♛',
  k: '♚',
};
