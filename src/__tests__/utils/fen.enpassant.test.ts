import {
  isValidEnPassantSquareFormat,
  isValidEnPassantSquare,
  getTurnFromEnPassant,
  updateEnPassant,
  updatePieceAt,
  parseFen,
  DEFAULT_FEN,
} from '../../utils/fen';

describe('FEN En Passant', () => {
  describe('isValidEnPassantSquareFormat', () => {
    it('should accept valid en passant squares on rank 3', () => {
      expect(isValidEnPassantSquareFormat('a3')).toBe(true);
      expect(isValidEnPassantSquareFormat('b3')).toBe(true);
      expect(isValidEnPassantSquareFormat('c3')).toBe(true);
      expect(isValidEnPassantSquareFormat('d3')).toBe(true);
      expect(isValidEnPassantSquareFormat('e3')).toBe(true);
      expect(isValidEnPassantSquareFormat('f3')).toBe(true);
      expect(isValidEnPassantSquareFormat('g3')).toBe(true);
      expect(isValidEnPassantSquareFormat('h3')).toBe(true);
    });

    it('should accept valid en passant squares on rank 6', () => {
      expect(isValidEnPassantSquareFormat('a6')).toBe(true);
      expect(isValidEnPassantSquareFormat('b6')).toBe(true);
      expect(isValidEnPassantSquareFormat('c6')).toBe(true);
      expect(isValidEnPassantSquareFormat('d6')).toBe(true);
      expect(isValidEnPassantSquareFormat('e6')).toBe(true);
      expect(isValidEnPassantSquareFormat('f6')).toBe(true);
      expect(isValidEnPassantSquareFormat('g6')).toBe(true);
      expect(isValidEnPassantSquareFormat('h6')).toBe(true);
    });

    it('should accept - for no en passant', () => {
      expect(isValidEnPassantSquareFormat('-')).toBe(true);
    });

    it('should reject squares on other ranks', () => {
      expect(isValidEnPassantSquareFormat('e1')).toBe(false);
      expect(isValidEnPassantSquareFormat('e2')).toBe(false);
      expect(isValidEnPassantSquareFormat('e4')).toBe(false);
      expect(isValidEnPassantSquareFormat('e5')).toBe(false);
      expect(isValidEnPassantSquareFormat('e7')).toBe(false);
      expect(isValidEnPassantSquareFormat('e8')).toBe(false);
    });

    it('should reject invalid file letters', () => {
      expect(isValidEnPassantSquareFormat('i3')).toBe(false);
      expect(isValidEnPassantSquareFormat('z6')).toBe(false);
    });

    it('should reject invalid formats', () => {
      expect(isValidEnPassantSquareFormat('e')).toBe(false);
      expect(isValidEnPassantSquareFormat('3')).toBe(false);
      expect(isValidEnPassantSquareFormat('e33')).toBe(false);
      expect(isValidEnPassantSquareFormat('')).toBe(false);
      expect(isValidEnPassantSquareFormat('e3e3')).toBe(false);
    });
  });

  describe('isValidEnPassantSquare (with board context)', () => {
    it('should accept - for no en passant', () => {
      expect(isValidEnPassantSquare(DEFAULT_FEN, '-')).toBe(true);
    });

    it('should validate e3 when white pawn is on e4 (white just moved e2-e4)', () => {
      // Set up position: white pawn on e4 (moved from e2)
      let fen = updatePieceAt(DEFAULT_FEN, 'e2', null); // Remove white pawn from e2
      fen = updatePieceAt(fen, 'e4', 'P'); // White pawn on e4

      expect(isValidEnPassantSquare(fen, 'e3')).toBe(true);
    });

    it('should validate e3 even without adjacent black pawns', () => {
      // Per FEN spec: only the jumped pawn matters, not if capture is possible
      let fen = updatePieceAt(DEFAULT_FEN, 'e2', null);
      fen = updatePieceAt(fen, 'e4', 'P'); // White pawn on e4
      // No black pawns on d4 or f4 - should still be valid

      expect(isValidEnPassantSquare(fen, 'e3')).toBe(true);
    });

    it('should validate e6 when black pawn is on e5 (black just moved e7-e5)', () => {
      // Set up position: black pawn on e5 (moved from e7)
      let fen = updatePieceAt(DEFAULT_FEN, 'e7', null); // Remove black pawn from e7
      fen = updatePieceAt(fen, 'e5', 'p'); // Black pawn on e5

      expect(isValidEnPassantSquare(fen, 'e6')).toBe(true);
    });

    it('should validate e6 even without adjacent white pawns', () => {
      // Per FEN spec: only the jumped pawn matters, not if capture is possible
      let fen = updatePieceAt(DEFAULT_FEN, 'e7', null);
      fen = updatePieceAt(fen, 'e5', 'p'); // Black pawn on e5
      // No white pawns on d5 or f5 - should still be valid

      expect(isValidEnPassantSquare(fen, 'e6')).toBe(true);
    });

    it('should reject e3 if no white pawn on e4', () => {
      // Empty e4 square
      const fen = DEFAULT_FEN;
      expect(isValidEnPassantSquare(fen, 'e3')).toBe(false);
    });

    it('should reject e3 if wrong piece on e4', () => {
      // Black pawn on e4 instead of white
      let fen = updatePieceAt(DEFAULT_FEN, 'e2', null);
      fen = updatePieceAt(fen, 'e4', 'p'); // Black pawn, not white

      expect(isValidEnPassantSquare(fen, 'e3')).toBe(false);
    });

    it('should reject e6 if no black pawn on e5', () => {
      const fen = DEFAULT_FEN;
      expect(isValidEnPassantSquare(fen, 'e6')).toBe(false);
    });

    it('should reject e6 if wrong piece on e5', () => {
      // White pawn on e5 instead of black
      let fen = updatePieceAt(DEFAULT_FEN, 'e7', null);
      fen = updatePieceAt(fen, 'e5', 'P'); // White pawn, not black

      expect(isValidEnPassantSquare(fen, 'e6')).toBe(false);
    });

    it('should validate a3 when white pawn is on a4', () => {
      // White pawn on a4 (moved from a2)
      let fen = updatePieceAt(DEFAULT_FEN, 'a2', null);
      fen = updatePieceAt(fen, 'a4', 'P');

      expect(isValidEnPassantSquare(fen, 'a3')).toBe(true);
    });

    it('should validate h3 when white pawn is on h4', () => {
      // White pawn on h4 (moved from h2)
      let fen = updatePieceAt(DEFAULT_FEN, 'h2', null);
      fen = updatePieceAt(fen, 'h4', 'P');

      expect(isValidEnPassantSquare(fen, 'h3')).toBe(true);
    });

    it('should validate all files on rank 3 when white pawns are on rank 4', () => {
      const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

      files.forEach((file) => {
        const targetSquare = `${file}3`;
        const pawnSquare = `${file}4`;

        let fen = DEFAULT_FEN;
        fen = updatePieceAt(fen, pawnSquare, 'P'); // Place white pawn

        expect(isValidEnPassantSquare(fen, targetSquare)).toBe(true);
      });
    });

    it('should validate all files on rank 6 when black pawns are on rank 5', () => {
      const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

      files.forEach((file) => {
        const targetSquare = `${file}6`;
        const pawnSquare = `${file}5`;

        let fen = DEFAULT_FEN;
        fen = updatePieceAt(fen, pawnSquare, 'p'); // Place black pawn

        expect(isValidEnPassantSquare(fen, targetSquare)).toBe(true);
      });
    });
  });

  describe('getTurnFromEnPassant', () => {
    it('should return black for rank 3 squares (white just moved)', () => {
      expect(getTurnFromEnPassant('a3')).toBe('b');
      expect(getTurnFromEnPassant('e3')).toBe('b');
      expect(getTurnFromEnPassant('h3')).toBe('b');
    });

    it('should return white for rank 6 squares (black just moved)', () => {
      expect(getTurnFromEnPassant('a6')).toBe('w');
      expect(getTurnFromEnPassant('e6')).toBe('w');
      expect(getTurnFromEnPassant('h6')).toBe('w');
    });

    it('should return white for -', () => {
      expect(getTurnFromEnPassant('-')).toBe('w');
    });
  });

  describe('updateEnPassant', () => {
    it('should update en passant square', () => {
      const newFen = updateEnPassant(DEFAULT_FEN, 'e3');
      const components = parseFen(newFen);
      expect(components.enPassantTarget).toBe('e3');
    });

    it('should automatically update turn to black for rank 3', () => {
      const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
      const newFen = updateEnPassant(fen, 'e3');
      const components = parseFen(newFen);

      expect(components.enPassantTarget).toBe('e3');
      expect(components.activeColor).toBe('b'); // Should be black's turn (white just moved)
    });

    it('should automatically update turn to white for rank 6', () => {
      const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 1';
      const newFen = updateEnPassant(fen, 'e6');
      const components = parseFen(newFen);

      expect(components.enPassantTarget).toBe('e6');
      expect(components.activeColor).toBe('w'); // Should be white's turn (black just moved)
    });

    it('should not update turn when autoUpdateTurn is false', () => {
      const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 1';
      const newFen = updateEnPassant(fen, 'e3', false);
      const components = parseFen(newFen);

      expect(components.enPassantTarget).toBe('e3');
      expect(components.activeColor).toBe('b'); // Should remain black's turn
    });

    it('should clear en passant with -', () => {
      const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq e3 0 1';
      const newFen = updateEnPassant(fen, '-');
      const components = parseFen(newFen);

      expect(components.enPassantTarget).toBe('-');
    });

    it('should preserve other FEN components', () => {
      const fen =
        'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 5 10';
      const newFen = updateEnPassant(fen, 'e3', false);

      expect(newFen).toContain('rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR');
      expect(newFen).toContain(' b ');
      expect(newFen).toContain(' KQkq ');
      expect(newFen).toContain(' e3 ');
      expect(newFen).toContain(' 5 10');
    });

    it('should handle empty string as -', () => {
      const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq e3 0 1';
      const newFen = updateEnPassant(fen, '');
      const components = parseFen(newFen);

      expect(components.enPassantTarget).toBe('-');
    });

    it('should update all en passant squares on rank 3', () => {
      const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

      files.forEach((file) => {
        const square = `${file}3`;
        const newFen = updateEnPassant(DEFAULT_FEN, square);
        const components = parseFen(newFen);

        expect(components.enPassantTarget).toBe(square);
        expect(components.activeColor).toBe('b'); // White just moved, black to play
      });
    });

    it('should update all en passant squares on rank 6', () => {
      const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

      files.forEach((file) => {
        const square = `${file}6`;
        const newFen = updateEnPassant(DEFAULT_FEN, square);
        const components = parseFen(newFen);

        expect(components.enPassantTarget).toBe(square);
        expect(components.activeColor).toBe('w'); // Black just moved, white to play
      });
    });
  });

  describe('en passant integration scenarios', () => {
    it('should properly set up e3 en passant after white pawn e2-e4', () => {
      // Simulate white pawn moving e2-e4 (so e3 en passant square, black to play)
      let fen = updatePieceAt(DEFAULT_FEN, 'e2', null);
      fen = updatePieceAt(fen, 'e4', 'P');
      fen = updateEnPassant(fen, 'e3');

      const components = parseFen(fen);
      expect(components.enPassantTarget).toBe('e3');
      expect(components.activeColor).toBe('b'); // Black to play
    });

    it('should properly set up e6 en passant after black pawn e7-e5', () => {
      // Simulate black pawn moving e7-e5 (so e6 en passant square, white to play)
      let fen = updatePieceAt(DEFAULT_FEN, 'e7', null);
      fen = updatePieceAt(fen, 'e5', 'p');
      fen = updateEnPassant(fen, 'e6');

      const components = parseFen(fen);
      expect(components.enPassantTarget).toBe('e6');
      expect(components.activeColor).toBe('w'); // White to play
    });
  });
});
