import { validateEnPassantInput, validateFenInput } from '../../utils/validation';

describe('validation', () => {
  describe('validateEnPassantInput', () => {
    describe('empty input', () => {
      it('should accept empty string as valid', () => {
        const result = validateEnPassantInput('');
        expect(result.valid).toBe(true);
        expect(result.error).toBeNull();
      });

      it('should accept empty string with FEN provided', () => {
        const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
        const result = validateEnPassantInput('', fen);
        expect(result.valid).toBe(true);
        expect(result.error).toBeNull();
      });
    });

    describe('incomplete input (single character)', () => {
      it('should return invalid for single character without error message', () => {
        const result = validateEnPassantInput('e');
        expect(result.valid).toBe(false);
        expect(result.error).toBeNull(); // Don't show error while typing
      });

      it('should return invalid for single digit without error message', () => {
        const result = validateEnPassantInput('3');
        expect(result.valid).toBe(false);
        expect(result.error).toBeNull();
      });
    });

    describe('format validation for rank 3', () => {
      it('should accept valid rank 3 square (e3)', () => {
        const result = validateEnPassantInput('e3');
        expect(result.valid).toBe(true);
        expect(result.error).toBeNull();
      });

      it('should accept valid rank 3 square (a3)', () => {
        const result = validateEnPassantInput('a3');
        expect(result.valid).toBe(true);
        expect(result.error).toBeNull();
      });

      it('should accept valid rank 3 square (h3)', () => {
        const result = validateEnPassantInput('h3');
        expect(result.valid).toBe(true);
        expect(result.error).toBeNull();
      });

      it('should accept valid rank 3 square (d3)', () => {
        const result = validateEnPassantInput('d3');
        expect(result.valid).toBe(true);
        expect(result.error).toBeNull();
      });
    });

    describe('format validation for rank 6', () => {
      it('should accept valid rank 6 square (e6)', () => {
        const result = validateEnPassantInput('e6');
        expect(result.valid).toBe(true);
        expect(result.error).toBeNull();
      });

      it('should accept valid rank 6 square (a6)', () => {
        const result = validateEnPassantInput('a6');
        expect(result.valid).toBe(true);
        expect(result.error).toBeNull();
      });

      it('should accept valid rank 6 square (h6)', () => {
        const result = validateEnPassantInput('h6');
        expect(result.valid).toBe(true);
        expect(result.error).toBeNull();
      });

      it('should accept valid rank 6 square (c6)', () => {
        const result = validateEnPassantInput('c6');
        expect(result.valid).toBe(true);
        expect(result.error).toBeNull();
      });
    });

    describe('format validation for invalid ranks', () => {
      it('should reject rank 1 with error message', () => {
        const result = validateEnPassantInput('e1');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Must be rank 3 (e.g., e3) or rank 6 (e.g., d6)');
      });

      it('should reject rank 2 with error message', () => {
        const result = validateEnPassantInput('e2');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Must be rank 3 (e.g., e3) or rank 6 (e.g., d6)');
      });

      it('should reject rank 4 with error message', () => {
        const result = validateEnPassantInput('e4');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Must be rank 3 (e.g., e3) or rank 6 (e.g., d6)');
      });

      it('should reject rank 5 with error message', () => {
        const result = validateEnPassantInput('e5');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Must be rank 3 (e.g., e3) or rank 6 (e.g., d6)');
      });

      it('should reject rank 7 with error message', () => {
        const result = validateEnPassantInput('e7');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Must be rank 3 (e.g., e3) or rank 6 (e.g., d6)');
      });

      it('should reject rank 8 with error message', () => {
        const result = validateEnPassantInput('e8');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Must be rank 3 (e.g., e3) or rank 6 (e.g., d6)');
      });
    });

    describe('format validation for invalid files', () => {
      it('should reject invalid file letter with error message', () => {
        const result = validateEnPassantInput('i3');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Must be rank 3 (e.g., e3) or rank 6 (e.g., d6)');
      });

      it('should reject number as file with error message', () => {
        const result = validateEnPassantInput('33');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Must be rank 3 (e.g., e3) or rank 6 (e.g., d6)');
      });

      it('should reject uppercase file letter with error message', () => {
        const result = validateEnPassantInput('E3');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Must be rank 3 (e.g., e3) or rank 6 (e.g., d6)');
      });
    });

    describe('strict validation with FEN', () => {
      it('should accept valid e3 with correct pawn position in FEN', () => {
        // Black pawn on e4, white pawn on d4 that can capture en passant
        const fen = 'rnbqkbnr/pppp1ppp/8/8/3Pp3/8/PPP1PPPP/RNBQKBNR w KQkq e3 0 1';
        const result = validateEnPassantInput('e3', fen);
        expect(result.valid).toBe(true);
        expect(result.error).toBeNull();
      });

      it('should accept valid e6 with correct pawn position in FEN', () => {
        // White pawn on e5, black pawn on d5 that can capture en passant
        const fen = 'rnbqkbnr/ppp1pppp/8/3pP3/8/8/PPPP1PPP/RNBQKBNR b KQkq e6 0 1';
        const result = validateEnPassantInput('e6', fen);
        expect(result.valid).toBe(true);
        expect(result.error).toBeNull();
      });

      it('should reject e3 without correct pawn position in FEN', () => {
        // No black pawn on e4
        const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
        const result = validateEnPassantInput('e3', fen);
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Invalid: no pawns in correct position for en passant');
      });

      it('should reject e6 without correct pawn position in FEN', () => {
        // No white pawn on e5
        const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 1';
        const result = validateEnPassantInput('e6', fen);
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Invalid: no pawns in correct position for en passant');
      });

      it('should validate format even with invalid FEN', () => {
        const invalidFen = 'invalid-fen-string';
        const result = validateEnPassantInput('e4', invalidFen);
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Must be rank 3 (e.g., e3) or rank 6 (e.g., d6)');
      });
    });

    describe('edge cases', () => {
      it('should reject input longer than 2 characters without error message', () => {
        const result = validateEnPassantInput('e33');
        expect(result.valid).toBe(false);
        expect(result.error).toBeNull(); // Don't show error for wrong length
      });

      it('should reject special characters', () => {
        const result = validateEnPassantInput('e@');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Must be rank 3 (e.g., e3) or rank 6 (e.g., d6)');
      });

      it('should reject spaces', () => {
        const result = validateEnPassantInput('e ');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Must be rank 3 (e.g., e3) or rank 6 (e.g., d6)');
      });

      it('should handle hyphen notation', () => {
        const result = validateEnPassantInput('-');
        expect(result.valid).toBe(false);
        expect(result.error).toBeNull(); // Single character, no error while typing
      });
    });
  });

  describe('validateFenInput', () => {
    describe('valid FEN strings', () => {
      it('should accept default starting position', () => {
        const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
        const result = validateFenInput(fen);
        expect(result.valid).toBe(true);
        expect(result.error).toBeNull();
      });

      it('should accept position after e4', () => {
        const fen = 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1';
        const result = validateFenInput(fen);
        expect(result.valid).toBe(true);
        expect(result.error).toBeNull();
      });

      it('should accept empty board', () => {
        const fen = '8/8/8/8/8/8/8/8 w - - 0 1';
        const result = validateFenInput(fen);
        expect(result.valid).toBe(true);
        expect(result.error).toBeNull();
      });

      it('should accept FEN with no castling rights', () => {
        const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w - - 0 1';
        const result = validateFenInput(fen);
        expect(result.valid).toBe(true);
        expect(result.error).toBeNull();
      });

      it('should accept FEN with partial castling rights', () => {
        const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w Kq - 0 1';
        const result = validateFenInput(fen);
        expect(result.valid).toBe(true);
        expect(result.error).toBeNull();
      });

      it('should accept FEN with en passant square', () => {
        const fen = 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1';
        const result = validateFenInput(fen);
        expect(result.valid).toBe(true);
        expect(result.error).toBeNull();
      });

      it('should accept FEN with high move counts', () => {
        const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 50 100';
        const result = validateFenInput(fen);
        expect(result.valid).toBe(true);
        expect(result.error).toBeNull();
      });

      it('should accept FEN with extra whitespace', () => {
        const fen = '  rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1  ';
        const result = validateFenInput(fen);
        expect(result.valid).toBe(true);
        expect(result.error).toBeNull();
      });
    });

    describe('invalid FEN strings', () => {
      it('should reject empty string', () => {
        const result = validateFenInput('');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('FEN cannot be empty');
      });

      it('should reject whitespace only', () => {
        const result = validateFenInput('   ');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('FEN cannot be empty');
      });

      it('should reject FEN with missing fields', () => {
        const result = validateFenInput('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Invalid FEN structure');
      });

      it('should reject FEN with too many fields', () => {
        const result = validateFenInput('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1 extra');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Invalid FEN structure');
      });

      it('should reject FEN with too few ranks', () => {
        const result = validateFenInput('rnbqkbnr/pppppppp/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Invalid FEN structure');
      });

      it('should reject FEN with too many ranks', () => {
        const result = validateFenInput('rnbqkbnr/pppppppp/8/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Invalid FEN structure');
      });

      it('should reject FEN with invalid piece characters', () => {
        const result = validateFenInput('rnbqkbnr/ppppXppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Invalid FEN structure');
      });

      it('should reject FEN with invalid active color', () => {
        const result = validateFenInput('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR x KQkq - 0 1');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Invalid FEN structure');
      });

      it('should reject completely invalid string', () => {
        const result = validateFenInput('not-a-valid-fen-string');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Invalid FEN structure');
      });

      it('should reject FEN with only piece placement', () => {
        const result = validateFenInput('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Invalid FEN structure');
      });
    });

    describe('edge cases', () => {
      it('should accept FEN with newlines as whitespace separators', () => {
        const result = validateFenInput('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR\nw\nKQkq\n-\n0\n1');
        expect(result.valid).toBe(true);
        expect(result.error).toBeNull();
      });

      it('should accept FEN with tabs as whitespace separators', () => {
        const result = validateFenInput('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR\tw\tKQkq\t-\t0\t1');
        expect(result.valid).toBe(true);
        expect(result.error).toBeNull();
      });

      it('should return consistent error message for different invalid structures', () => {
        const invalidFens = [
          'invalid',
          '8/8/8 w - - 0 1',
          'rnbqkbnr w KQkq - 0 1',
          '',
          'a b c d e f',
        ];

        invalidFens.forEach(fen => {
          const result = validateFenInput(fen);
          expect(result.valid).toBe(false);
          expect(result.error).toMatch(/FEN cannot be empty|Invalid FEN structure/);
        });
      });
    });

    describe('return value structure', () => {
      it('should return object with valid and error properties', () => {
        const result = validateFenInput('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
        expect(result).toHaveProperty('valid');
        expect(result).toHaveProperty('error');
        expect(typeof result.valid).toBe('boolean');
      });

      it('should return null error when valid', () => {
        const result = validateFenInput('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
        expect(result.error).toBeNull();
      });

      it('should return string error when invalid', () => {
        const result = validateFenInput('invalid');
        expect(typeof result.error).toBe('string');
        expect(result.error).not.toBeNull();
      });
    });
  });
});
