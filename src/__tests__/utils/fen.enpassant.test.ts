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

    it('should validate e3 after e2-e4 (black pawn on e4, white pawns adjacent)', () => {
      // Set up position: white pawn on e4, black pawn on d4
      let fen = updatePieceAt(DEFAULT_FEN, 'e2', null); // Remove white pawn from e2
      fen = updatePieceAt(fen, 'e4', 'p'); // Black pawn on e4
      fen = updatePieceAt(fen, 'd4', 'P'); // White pawn on d4 (can capture en passant)

      expect(isValidEnPassantSquare(fen, 'e3')).toBe(true);
    });

    it('should validate e3 with white pawn on f4', () => {
      // Set up position: black pawn on e4, white pawn on f4
      let fen = updatePieceAt(DEFAULT_FEN, 'e2', null);
      fen = updatePieceAt(fen, 'e4', 'p'); // Black pawn on e4
      fen = updatePieceAt(fen, 'f4', 'P'); // White pawn on f4 (can capture en passant)

      expect(isValidEnPassantSquare(fen, 'e3')).toBe(true);
    });

    it('should validate e6 after e7-e5 (white pawn on e5, black pawns adjacent)', () => {
      // Set up position: white pawn on e5, black pawn on d5
      let fen = updatePieceAt(DEFAULT_FEN, 'e7', null); // Remove black pawn from e7
      fen = updatePieceAt(fen, 'e5', 'P'); // White pawn on e5
      fen = updatePieceAt(fen, 'd5', 'p'); // Black pawn on d5 (can capture en passant)

      expect(isValidEnPassantSquare(fen, 'e6')).toBe(true);
    });

    it('should reject e3 if no black pawn on e4', () => {
      // Empty e4 square
      const fen = DEFAULT_FEN;
      expect(isValidEnPassantSquare(fen, 'e3')).toBe(false);
    });

    it('should reject e3 if wrong piece on e4', () => {
      // White pawn on e4 instead of black
      let fen = updatePieceAt(DEFAULT_FEN, 'e2', null);
      fen = updatePieceAt(fen, 'e4', 'P'); // White pawn, not black

      expect(isValidEnPassantSquare(fen, 'e3')).toBe(false);
    });

    it('should reject e3 if no white pawns adjacent', () => {
      // Black pawn on e4, but no white pawns on d4 or f4
      let fen = updatePieceAt(DEFAULT_FEN, 'e2', null);
      fen = updatePieceAt(fen, 'e4', 'p'); // Black pawn on e4
      // No white pawns on d4 or f4

      expect(isValidEnPassantSquare(fen, 'e3')).toBe(false);
    });

    it('should reject e6 if no white pawn on e5', () => {
      const fen = DEFAULT_FEN;
      expect(isValidEnPassantSquare(fen, 'e6')).toBe(false);
    });

    it('should reject e6 if wrong piece on e5', () => {
      // Black pawn on e5 instead of white
      let fen = updatePieceAt(DEFAULT_FEN, 'e7', null);
      fen = updatePieceAt(fen, 'e5', 'p'); // Black pawn, not white

      expect(isValidEnPassantSquare(fen, 'e6')).toBe(false);
    });

    it('should reject e6 if no black pawns adjacent', () => {
      // White pawn on e5, but no black pawns on d5 or f5
      let fen = updatePieceAt(DEFAULT_FEN, 'e7', null);
      fen = updatePieceAt(fen, 'e5', 'P'); // White pawn on e5
      // No black pawns on d5 or f5

      expect(isValidEnPassantSquare(fen, 'e6')).toBe(false);
    });

    it('should validate a3 with proper setup', () => {
      // Black pawn on a4, white pawn on b4
      let fen = updatePieceAt(DEFAULT_FEN, 'a7', null);
      fen = updatePieceAt(fen, 'a4', 'p');
      fen = updatePieceAt(fen, 'b4', 'P');

      expect(isValidEnPassantSquare(fen, 'a3')).toBe(true);
    });

    it('should validate h3 with proper setup', () => {
      // Black pawn on h4, white pawn on g4
      let fen = updatePieceAt(DEFAULT_FEN, 'h7', null);
      fen = updatePieceAt(fen, 'h4', 'p');
      fen = updatePieceAt(fen, 'g4', 'P');

      expect(isValidEnPassantSquare(fen, 'h3')).toBe(true);
    });

    it('should validate with pawns on both sides', () => {
      // Black pawn on e4, white pawns on both d4 and f4
      let fen = updatePieceAt(DEFAULT_FEN, 'e2', null);
      fen = updatePieceAt(fen, 'e4', 'p');
      fen = updatePieceAt(fen, 'd4', 'P');
      fen = updatePieceAt(fen, 'f4', 'P');

      expect(isValidEnPassantSquare(fen, 'e3')).toBe(true);
    });
  });

  describe('getTurnFromEnPassant', () => {
    it('should return white for rank 3 squares', () => {
      expect(getTurnFromEnPassant('a3')).toBe('w');
      expect(getTurnFromEnPassant('e3')).toBe('w');
      expect(getTurnFromEnPassant('h3')).toBe('w');
    });

    it('should return black for rank 6 squares', () => {
      expect(getTurnFromEnPassant('a6')).toBe('b');
      expect(getTurnFromEnPassant('e6')).toBe('b');
      expect(getTurnFromEnPassant('h6')).toBe('b');
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

    it('should automatically update turn to white for rank 3', () => {
      const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 1';
      const newFen = updateEnPassant(fen, 'e3');
      const components = parseFen(newFen);

      expect(components.enPassantTarget).toBe('e3');
      expect(components.activeColor).toBe('w'); // Should be white's turn
    });

    it('should automatically update turn to black for rank 6', () => {
      const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
      const newFen = updateEnPassant(fen, 'e6');
      const components = parseFen(newFen);

      expect(components.enPassantTarget).toBe('e6');
      expect(components.activeColor).toBe('b'); // Should be black's turn
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
        expect(components.activeColor).toBe('w');
      });
    });

    it('should update all en passant squares on rank 6', () => {
      const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

      files.forEach((file) => {
        const square = `${file}6`;
        const newFen = updateEnPassant(DEFAULT_FEN, square);
        const components = parseFen(newFen);

        expect(components.enPassantTarget).toBe(square);
        expect(components.activeColor).toBe('b');
      });
    });
  });

  describe('en passant integration scenarios', () => {
    it('should properly set up e3 en passant after black pawn e7-e5', () => {
      // Simulate black pawn moving e7-e5 (so e3 en passant square, white to play)
      let fen = updatePieceAt(DEFAULT_FEN, 'e7', null);
      fen = updatePieceAt(fen, 'e5', 'p');
      fen = updateEnPassant(fen, 'e3');

      const components = parseFen(fen);
      expect(components.enPassantTarget).toBe('e3');
      expect(components.activeColor).toBe('w');
    });

    it('should properly set up e6 en passant after white pawn e2-e4', () => {
      // Simulate white pawn moving e2-e4 (so e6 en passant square, black to play)
      let fen = updatePieceAt(DEFAULT_FEN, 'e2', null);
      fen = updatePieceAt(fen, 'e4', 'P');
      fen = updateEnPassant(fen, 'e6');

      const components = parseFen(fen);
      expect(components.enPassantTarget).toBe('e6');
      expect(components.activeColor).toBe('b');
    });
  });
});
