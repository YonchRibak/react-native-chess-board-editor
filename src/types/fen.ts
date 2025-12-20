import type { PieceColor } from './piece';

/**
 * Complete FEN string components
 */
export interface FenComponents {
  /** Piece placement (e.g., 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR') */
  piecePlacement: string;
  /** Active color (w or b) */
  activeColor: PieceColor;
  /** Castling availability (e.g., 'KQkq' or '-') */
  castlingAvailability: string;
  /** En passant target square (e.g., 'e3' or '-') */
  enPassantTarget: string;
  /** Halfmove clock (number of halfmoves since last capture or pawn move) */
  halfmoveClock: number;
  /** Fullmove number (starts at 1, incremented after Black's move) */
  fullmoveNumber: number;
}
