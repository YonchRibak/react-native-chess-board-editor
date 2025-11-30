import {
  isValidFenStructure,
  isValidSquare,
  updateActiveColor,
  parseFen,
  DEFAULT_FEN,
} from '../../utils/fen';

describe('FEN Validation', () => {
  describe('isValidFenStructure', () => {
    it('should validate the default starting position', () => {
      expect(isValidFenStructure(DEFAULT_FEN)).toBe(true);
    });

    it('should validate a position after e4', () => {
      const fen =
        'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1';
      expect(isValidFenStructure(fen)).toBe(true);
    });

    it('should validate an empty board', () => {
      const fen = '8/8/8/8/8/8/8/8 w - - 0 1';
      expect(isValidFenStructure(fen)).toBe(true);
    });

    it('should validate with no castling rights', () => {
      const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w - - 0 1';
      expect(isValidFenStructure(fen)).toBe(true);
    });

    it('should validate with partial castling rights', () => {
      const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w Kq - 0 1';
      expect(isValidFenStructure(fen)).toBe(true);
    });

    it('should validate with en passant on rank 3', () => {
      const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq e3 0 1';
      expect(isValidFenStructure(fen)).toBe(true);
    });

    it('should validate with en passant on rank 6', () => {
      const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq e6 0 1';
      expect(isValidFenStructure(fen)).toBe(true);
    });

    it('should validate with different move counts', () => {
      const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 10 25';
      expect(isValidFenStructure(fen)).toBe(true);
    });

    it('should reject FEN with wrong number of fields', () => {
      expect(isValidFenStructure('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq')).toBe(
        false
      );
      expect(isValidFenStructure('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR')).toBe(
        false
      );
    });

    it('should reject FEN with wrong number of ranks', () => {
      expect(isValidFenStructure('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP w KQkq - 0 1')).toBe(
        false
      );
      expect(
        isValidFenStructure('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR/8 w KQkq - 0 1')
      ).toBe(false);
    });

    it('should reject FEN with invalid piece symbols', () => {
      expect(isValidFenStructure('xnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')).toBe(
        false
      );
      expect(isValidFenStructure('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')).toBe(
        true
      );
    });

    it('should reject FEN with rank that does not sum to 8', () => {
      expect(isValidFenStructure('rnbqkbnr/ppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')).toBe(
        false
      ); // Only 7 pawns
      expect(isValidFenStructure('rnbqkbnr/ppppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')).toBe(
        false
      ); // 9 pawns
    });

    it('should reject FEN with invalid active color', () => {
      expect(isValidFenStructure('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR x KQkq - 0 1')).toBe(
        false
      );
      expect(isValidFenStructure('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR W KQkq - 0 1')).toBe(
        false
      );
    });

    it('should reject FEN with invalid castling rights', () => {
      expect(isValidFenStructure('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkqX - 0 1')).toBe(
        false
      );
      expect(isValidFenStructure('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w abc - 0 1')).toBe(
        false
      );
    });

    it('should reject FEN with invalid en passant square', () => {
      expect(isValidFenStructure('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq e4 0 1')).toBe(
        false
      ); // Wrong rank
      expect(isValidFenStructure('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq i3 0 1')).toBe(
        false
      ); // Invalid file
    });

    it('should reject FEN with invalid move counts', () => {
      expect(
        isValidFenStructure('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - abc 1')
      ).toBe(false);
      expect(
        isValidFenStructure('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 def')
      ).toBe(false);
    });

    it('should handle extra whitespace', () => {
      expect(
        isValidFenStructure('  rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR  w  KQkq  -  0  1  ')
      ).toBe(true);
    });

    it('should allow illegal positions (multiple kings, etc)', () => {
      // Multiple white kings
      expect(isValidFenStructure('kkkkkkkk/8/8/8/8/8/8/KKKKKKKK w - - 0 1')).toBe(true);

      // Pawns on first rank
      expect(isValidFenStructure('PPPPPPPP/8/8/8/8/8/8/pppppppp w - - 0 1')).toBe(true);

      // All queens
      expect(isValidFenStructure('QQQQQQQQ/qqqqqqqq/8/8/8/8/8/8 w - - 0 1')).toBe(true);
    });
  });

  describe('isValidSquare', () => {
    it('should validate all valid squares', () => {
      const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
      const ranks = [1, 2, 3, 4, 5, 6, 7, 8];

      files.forEach((file) => {
        ranks.forEach((rank) => {
          const square = `${file}${rank}`;
          expect(isValidSquare(square)).toBe(true);
        });
      });
    });

    it('should reject invalid files', () => {
      expect(isValidSquare('i1')).toBe(false);
      expect(isValidSquare('z5')).toBe(false);
      expect(isValidSquare('A1')).toBe(false);
    });

    it('should reject invalid ranks', () => {
      expect(isValidSquare('a0')).toBe(false);
      expect(isValidSquare('a9')).toBe(false);
      expect(isValidSquare('e10')).toBe(false);
    });

    it('should reject malformed squares', () => {
      expect(isValidSquare('e')).toBe(false);
      expect(isValidSquare('4')).toBe(false);
      expect(isValidSquare('e44')).toBe(false);
      expect(isValidSquare('ee4')).toBe(false);
      expect(isValidSquare('')).toBe(false);
      expect(isValidSquare('e4e4')).toBe(false);
    });
  });
});

describe('FEN Active Color', () => {
  describe('updateActiveColor', () => {
    it('should update turn to white', () => {
      const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 1';
      const newFen = updateActiveColor(fen, 'w');
      const components = parseFen(newFen);

      expect(components.activeColor).toBe('w');
    });

    it('should update turn to black', () => {
      const newFen = updateActiveColor(DEFAULT_FEN, 'b');
      const components = parseFen(newFen);

      expect(components.activeColor).toBe('b');
    });

    it('should preserve other FEN components', () => {
      const fen =
        'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 5 10';
      const newFen = updateActiveColor(fen, 'w');

      expect(newFen).toContain('rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR');
      expect(newFen).toContain(' w ');
      expect(newFen).toContain(' KQkq ');
      expect(newFen).toContain(' e3 ');
      expect(newFen).toContain(' 5 10');
    });

    it('should allow toggling turn back and forth', () => {
      let fen = DEFAULT_FEN;

      fen = updateActiveColor(fen, 'b');
      expect(parseFen(fen).activeColor).toBe('b');

      fen = updateActiveColor(fen, 'w');
      expect(parseFen(fen).activeColor).toBe('w');

      fen = updateActiveColor(fen, 'b');
      expect(parseFen(fen).activeColor).toBe('b');
    });
  });
});
