import {
  parseCastlingRights,
  castlingRightsToString,
  updateCastlingRights,
  DEFAULT_FEN,
} from '../../utils/fen';

describe('FEN Castling Rights', () => {
  describe('parseCastlingRights', () => {
    it('should parse full castling rights', () => {
      const rights = parseCastlingRights('KQkq');
      expect(rights.whiteKingSide).toBe(true);
      expect(rights.whiteQueenSide).toBe(true);
      expect(rights.blackKingSide).toBe(true);
      expect(rights.blackQueenSide).toBe(true);
    });

    it('should parse no castling rights', () => {
      const rights = parseCastlingRights('-');
      expect(rights.whiteKingSide).toBe(false);
      expect(rights.whiteQueenSide).toBe(false);
      expect(rights.blackKingSide).toBe(false);
      expect(rights.blackQueenSide).toBe(false);
    });

    it('should parse partial castling rights - white only', () => {
      const rights = parseCastlingRights('KQ');
      expect(rights.whiteKingSide).toBe(true);
      expect(rights.whiteQueenSide).toBe(true);
      expect(rights.blackKingSide).toBe(false);
      expect(rights.blackQueenSide).toBe(false);
    });

    it('should parse partial castling rights - black only', () => {
      const rights = parseCastlingRights('kq');
      expect(rights.whiteKingSide).toBe(false);
      expect(rights.whiteQueenSide).toBe(false);
      expect(rights.blackKingSide).toBe(true);
      expect(rights.blackQueenSide).toBe(true);
    });

    it('should parse partial castling rights - kingside only', () => {
      const rights = parseCastlingRights('Kk');
      expect(rights.whiteKingSide).toBe(true);
      expect(rights.whiteQueenSide).toBe(false);
      expect(rights.blackKingSide).toBe(true);
      expect(rights.blackQueenSide).toBe(false);
    });

    it('should parse partial castling rights - queenside only', () => {
      const rights = parseCastlingRights('Qq');
      expect(rights.whiteKingSide).toBe(false);
      expect(rights.whiteQueenSide).toBe(true);
      expect(rights.blackKingSide).toBe(false);
      expect(rights.blackQueenSide).toBe(true);
    });

    it('should parse mixed castling rights', () => {
      const rights = parseCastlingRights('Kq');
      expect(rights.whiteKingSide).toBe(true);
      expect(rights.whiteQueenSide).toBe(false);
      expect(rights.blackKingSide).toBe(false);
      expect(rights.blackQueenSide).toBe(true);
    });

    it('should handle order independence', () => {
      const rights1 = parseCastlingRights('KQkq');
      const rights2 = parseCastlingRights('qkQK');

      expect(rights1).toEqual(rights2);
    });
  });

  describe('castlingRightsToString', () => {
    it('should convert full castling rights to string', () => {
      const rights = {
        whiteKingSide: true,
        whiteQueenSide: true,
        blackKingSide: true,
        blackQueenSide: true,
      };
      expect(castlingRightsToString(rights)).toBe('KQkq');
    });

    it('should convert no castling rights to -', () => {
      const rights = {
        whiteKingSide: false,
        whiteQueenSide: false,
        blackKingSide: false,
        blackQueenSide: false,
      };
      expect(castlingRightsToString(rights)).toBe('-');
    });

    it('should convert partial castling rights - white only', () => {
      const rights = {
        whiteKingSide: true,
        whiteQueenSide: true,
        blackKingSide: false,
        blackQueenSide: false,
      };
      expect(castlingRightsToString(rights)).toBe('KQ');
    });

    it('should convert partial castling rights - black only', () => {
      const rights = {
        whiteKingSide: false,
        whiteQueenSide: false,
        blackKingSide: true,
        blackQueenSide: true,
      };
      expect(castlingRightsToString(rights)).toBe('kq');
    });

    it('should convert partial castling rights - mixed', () => {
      const rights = {
        whiteKingSide: true,
        whiteQueenSide: false,
        blackKingSide: false,
        blackQueenSide: true,
      };
      expect(castlingRightsToString(rights)).toBe('Kq');
    });

    it('should maintain correct order', () => {
      const rights = {
        whiteKingSide: false,
        whiteQueenSide: true,
        blackKingSide: true,
        blackQueenSide: false,
      };
      expect(castlingRightsToString(rights)).toBe('Qk');
    });
  });

  describe('updateCastlingRights', () => {
    it('should update castling rights to full', () => {
      const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w - - 0 1';
      const newFen = updateCastlingRights(fen, 'KQkq');
      expect(newFen).toContain(' KQkq ');
    });

    it('should update castling rights to none', () => {
      const newFen = updateCastlingRights(DEFAULT_FEN, '-');
      expect(newFen).toContain(' - ');
    });

    it('should update castling rights to partial', () => {
      const newFen = updateCastlingRights(DEFAULT_FEN, 'Kq');
      expect(newFen).toContain(' Kq ');
    });

    it('should preserve other FEN components', () => {
      const fen =
        'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 5 10';
      const newFen = updateCastlingRights(fen, 'Kq');

      expect(newFen).toContain('rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR');
      expect(newFen).toContain(' b ');
      expect(newFen).toContain(' Kq ');
      expect(newFen).toContain(' e3 ');
      expect(newFen).toContain(' 5 10');
    });

    it('should handle empty string as no rights', () => {
      const newFen = updateCastlingRights(DEFAULT_FEN, '');
      expect(newFen).toContain(' - ');
    });
  });

  describe('roundtrip conversions', () => {
    it('should convert castling string to rights and back', () => {
      const testCases = ['KQkq', 'KQ', 'kq', 'Kq', 'Qk', 'K', 'Q', 'k', 'q', '-'];

      testCases.forEach((castlingString) => {
        const rights = parseCastlingRights(castlingString);
        const backToString = castlingRightsToString(rights);

        // Normalize '-' case
        const normalized = castlingString === '-' ? '-' : castlingString;
        expect(backToString).toBe(normalized);
      });
    });
  });
});
