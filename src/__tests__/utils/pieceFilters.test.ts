import { getPiecesByColor, getBankLabel } from '../../utils/pieceFilters';
import { WHITE_PIECES, BLACK_PIECES, ALL_PIECES_ORDERED } from '../../constants/pieces';

describe('pieceFilters', () => {
  describe('getPiecesByColor', () => {
    it('should return white pieces when color is "white"', () => {
      const result = getPiecesByColor('white');
      expect(result).toEqual(WHITE_PIECES);
      expect(result).toEqual(['P', 'N', 'B', 'R', 'Q', 'K']);
    });

    it('should return black pieces when color is "black"', () => {
      const result = getPiecesByColor('black');
      expect(result).toEqual(BLACK_PIECES);
      expect(result).toEqual(['p', 'n', 'b', 'r', 'q', 'k']);
    });

    it('should return all pieces when color is undefined', () => {
      const result = getPiecesByColor(undefined);
      expect(result).toEqual(ALL_PIECES_ORDERED);
      expect(result).toEqual(['P', 'N', 'B', 'R', 'Q', 'K', 'p', 'n', 'b', 'r', 'q', 'k']);
    });

    it('should return all pieces when no color parameter is provided', () => {
      const result = getPiecesByColor();
      expect(result).toEqual(ALL_PIECES_ORDERED);
    });

    it('should return the correct number of pieces for white', () => {
      const result = getPiecesByColor('white');
      expect(result).toHaveLength(6);
    });

    it('should return the correct number of pieces for black', () => {
      const result = getPiecesByColor('black');
      expect(result).toHaveLength(6);
    });

    it('should return the correct number of pieces for all', () => {
      const result = getPiecesByColor();
      expect(result).toHaveLength(12);
    });

    it('should return pieces in correct order for white', () => {
      const result = getPiecesByColor('white');
      expect(result[0]).toBe('P'); // Pawn
      expect(result[1]).toBe('N'); // Knight
      expect(result[2]).toBe('B'); // Bishop
      expect(result[3]).toBe('R'); // Rook
      expect(result[4]).toBe('Q'); // Queen
      expect(result[5]).toBe('K'); // King
    });

    it('should return pieces in correct order for black', () => {
      const result = getPiecesByColor('black');
      expect(result[0]).toBe('p'); // Pawn
      expect(result[1]).toBe('n'); // Knight
      expect(result[2]).toBe('b'); // Bishop
      expect(result[3]).toBe('r'); // Rook
      expect(result[4]).toBe('q'); // Queen
      expect(result[5]).toBe('k'); // King
    });

    it('should return white pieces before black pieces when color is undefined', () => {
      const result = getPiecesByColor();
      expect(result.slice(0, 6)).toEqual(WHITE_PIECES);
      expect(result.slice(6, 12)).toEqual(BLACK_PIECES);
    });
  });

  describe('getBankLabel', () => {
    it('should return "White Pieces" when color is "white"', () => {
      const result = getBankLabel('white');
      expect(result).toBe('White Pieces');
    });

    it('should return "Black Pieces" when color is "black"', () => {
      const result = getBankLabel('black');
      expect(result).toBe('Black Pieces');
    });

    it('should return "All Pieces" when color is undefined', () => {
      const result = getBankLabel(undefined);
      expect(result).toBe('All Pieces');
    });

    it('should return "All Pieces" when no color parameter is provided', () => {
      const result = getBankLabel();
      expect(result).toBe('All Pieces');
    });

    it('should return a string value', () => {
      expect(typeof getBankLabel('white')).toBe('string');
      expect(typeof getBankLabel('black')).toBe('string');
      expect(typeof getBankLabel()).toBe('string');
    });
  });

  describe('integration between getPiecesByColor and getBankLabel', () => {
    it('should have matching labels and pieces for white', () => {
      const pieces = getPiecesByColor('white');
      const label = getBankLabel('white');

      expect(label).toContain('White');
      expect(pieces.every(p => p === p.toUpperCase())).toBe(true); // All uppercase = white pieces
    });

    it('should have matching labels and pieces for black', () => {
      const pieces = getPiecesByColor('black');
      const label = getBankLabel('black');

      expect(label).toContain('Black');
      expect(pieces.every(p => p === p.toLowerCase())).toBe(true); // All lowercase = black pieces
    });

    it('should have matching labels and pieces for all', () => {
      const pieces = getPiecesByColor();
      const label = getBankLabel();

      expect(label).toBe('All Pieces');
      expect(pieces).toHaveLength(12); // Both white and black
    });
  });
});
