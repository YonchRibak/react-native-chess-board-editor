import type { PieceSymbol } from '../types';

/**
 * Default square size in pixels
 */
export const DEFAULT_SQUARE_SIZE = 45;

/**
 * Default light square color
 */
export const DEFAULT_LIGHT_SQUARE_COLOR = '#F0D9B5';

/**
 * Default dark square color
 */
export const DEFAULT_DARK_SQUARE_COLOR = '#B58863';

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
 * Files (columns) on a chess board
 */
export const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

/**
 * Ranks (rows) on a chess board
 */
export const RANKS = [8, 7, 6, 5, 4, 3, 2, 1];

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
