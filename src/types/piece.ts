/**
 * Chess piece symbols
 * Uppercase = White pieces, Lowercase = Black pieces
 */
export type PieceSymbol = 'P' | 'N' | 'B' | 'R' | 'Q' | 'K' | 'p' | 'n' | 'b' | 'r' | 'q' | 'k';

/**
 * Chess piece colors
 */
export type PieceColor = 'w' | 'b';

/**
 * Available piece set styles
 */
export type PieceSet = 'unicode' | 'cburnett' | 'alpha';

/**
 * Piece set configuration
 */
export interface PieceSetConfig {
  /** Unique identifier for the piece set */
  id: PieceSet;
  /** Display name for the piece set */
  name: string;
  /** Description of the piece set style */
  description: string;
}
