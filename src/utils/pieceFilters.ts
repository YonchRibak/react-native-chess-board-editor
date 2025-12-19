import type { PieceSymbol } from '../types';
import { WHITE_PIECES, BLACK_PIECES, ALL_PIECES_ORDERED } from '../constants';

/**
 * Get pieces to display based on color filter
 * @param color - Optional color filter ('white', 'black', or undefined for all)
 * @returns Array of piece symbols to display
 */
export const getPiecesByColor = (color?: 'white' | 'black'): PieceSymbol[] => {
  if (!color) {
    return ALL_PIECES_ORDERED;
  }
  return color === 'white' ? WHITE_PIECES : BLACK_PIECES;
};

/**
 * Get label text for piece bank based on color filter
 * @param color - Optional color filter ('white', 'black', or undefined for all)
 * @returns Label text for the piece bank
 */
export const getBankLabel = (color?: 'white' | 'black'): string => {
  if (!color) {
    return 'All Pieces';
  }
  return color === 'white' ? 'White Pieces' : 'Black Pieces';
};
