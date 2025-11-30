import {
  getPieceAt,
  updatePieceAt,
  movePiece,
  DEFAULT_FEN,
} from '../../utils/fen';

describe('FEN Piece Manipulation', () => {
  describe('getPieceAt', () => {
    it('should get pieces from starting position', () => {
      // Black pieces (rank 8)
      expect(getPieceAt(DEFAULT_FEN, 'a8')).toBe('r');
      expect(getPieceAt(DEFAULT_FEN, 'b8')).toBe('n');
      expect(getPieceAt(DEFAULT_FEN, 'c8')).toBe('b');
      expect(getPieceAt(DEFAULT_FEN, 'd8')).toBe('q');
      expect(getPieceAt(DEFAULT_FEN, 'e8')).toBe('k');
      expect(getPieceAt(DEFAULT_FEN, 'h8')).toBe('r');

      // Black pawns (rank 7)
      expect(getPieceAt(DEFAULT_FEN, 'a7')).toBe('p');
      expect(getPieceAt(DEFAULT_FEN, 'e7')).toBe('p');
      expect(getPieceAt(DEFAULT_FEN, 'h7')).toBe('p');

      // Empty squares
      expect(getPieceAt(DEFAULT_FEN, 'e4')).toBe(null);
      expect(getPieceAt(DEFAULT_FEN, 'd5')).toBe(null);

      // White pawns (rank 2)
      expect(getPieceAt(DEFAULT_FEN, 'a2')).toBe('P');
      expect(getPieceAt(DEFAULT_FEN, 'e2')).toBe('P');
      expect(getPieceAt(DEFAULT_FEN, 'h2')).toBe('P');

      // White pieces (rank 1)
      expect(getPieceAt(DEFAULT_FEN, 'a1')).toBe('R');
      expect(getPieceAt(DEFAULT_FEN, 'd1')).toBe('Q');
      expect(getPieceAt(DEFAULT_FEN, 'e1')).toBe('K');
      expect(getPieceAt(DEFAULT_FEN, 'h1')).toBe('R');
    });

    it('should get pieces from a custom position', () => {
      const fen =
        'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1';

      expect(getPieceAt(fen, 'e4')).toBe('P');
      expect(getPieceAt(fen, 'e2')).toBe(null);
    });
  });

  describe('updatePieceAt', () => {
    it('should add a piece to an empty square', () => {
      const newFen = updatePieceAt(DEFAULT_FEN, 'e4', 'P');
      expect(getPieceAt(newFen, 'e4')).toBe('P');
    });

    it('should remove a piece from a square', () => {
      const newFen = updatePieceAt(DEFAULT_FEN, 'e2', null);
      expect(getPieceAt(newFen, 'e2')).toBe(null);
    });

    it('should replace a piece on a square', () => {
      const newFen = updatePieceAt(DEFAULT_FEN, 'e2', 'Q');
      expect(getPieceAt(newFen, 'e2')).toBe('Q');
    });

    it('should not affect other pieces', () => {
      const newFen = updatePieceAt(DEFAULT_FEN, 'e4', 'P');

      // Check that other pieces are unchanged
      expect(getPieceAt(newFen, 'e1')).toBe('K');
      expect(getPieceAt(newFen, 'e2')).toBe('P');
      expect(getPieceAt(newFen, 'e7')).toBe('p');
      expect(getPieceAt(newFen, 'e8')).toBe('k');
    });

    it('should preserve other FEN components', () => {
      const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 5 10';
      const newFen = updatePieceAt(fen, 'e4', 'P');

      // Check that FEN components are preserved
      expect(newFen).toContain('w KQkq - 5 10');
    });

    it('should handle all piece types', () => {
      let fen = DEFAULT_FEN;

      // Add all white pieces
      fen = updatePieceAt(fen, 'e4', 'P');
      expect(getPieceAt(fen, 'e4')).toBe('P');

      fen = updatePieceAt(fen, 'e5', 'N');
      expect(getPieceAt(fen, 'e5')).toBe('N');

      fen = updatePieceAt(fen, 'd4', 'B');
      expect(getPieceAt(fen, 'd4')).toBe('B');

      fen = updatePieceAt(fen, 'd5', 'R');
      expect(getPieceAt(fen, 'd5')).toBe('R');

      fen = updatePieceAt(fen, 'f4', 'Q');
      expect(getPieceAt(fen, 'f4')).toBe('Q');

      fen = updatePieceAt(fen, 'f5', 'K');
      expect(getPieceAt(fen, 'f5')).toBe('K');

      // Add all black pieces
      fen = updatePieceAt(fen, 'c4', 'p');
      expect(getPieceAt(fen, 'c4')).toBe('p');

      fen = updatePieceAt(fen, 'c5', 'n');
      expect(getPieceAt(fen, 'c5')).toBe('n');

      fen = updatePieceAt(fen, 'b4', 'b');
      expect(getPieceAt(fen, 'b4')).toBe('b');

      fen = updatePieceAt(fen, 'b5', 'r');
      expect(getPieceAt(fen, 'b5')).toBe('r');

      fen = updatePieceAt(fen, 'g4', 'q');
      expect(getPieceAt(fen, 'g4')).toBe('q');

      fen = updatePieceAt(fen, 'g5', 'k');
      expect(getPieceAt(fen, 'g5')).toBe('k');
    });
  });

  describe('movePiece', () => {
    it('should move a pawn forward', () => {
      const newFen = movePiece(DEFAULT_FEN, 'e2', 'e4');

      expect(getPieceAt(newFen, 'e2')).toBe(null);
      expect(getPieceAt(newFen, 'e4')).toBe('P');
    });

    it('should capture a piece', () => {
      // Set up a position where white pawn can capture black pawn
      let fen = updatePieceAt(DEFAULT_FEN, 'e4', 'P');
      fen = updatePieceAt(fen, 'd5', 'p');

      const newFen = movePiece(fen, 'e4', 'd5');

      expect(getPieceAt(newFen, 'e4')).toBe(null);
      expect(getPieceAt(newFen, 'd5')).toBe('P'); // White pawn captured black pawn
    });

    it('should not move if source square is empty', () => {
      const newFen = movePiece(DEFAULT_FEN, 'e4', 'e5');

      // FEN should be unchanged
      expect(newFen).toBe(DEFAULT_FEN);
    });

    it('should move knights', () => {
      const newFen = movePiece(DEFAULT_FEN, 'b1', 'c3');

      expect(getPieceAt(newFen, 'b1')).toBe(null);
      expect(getPieceAt(newFen, 'c3')).toBe('N');
    });

    it('should preserve other FEN components', () => {
      const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 5 10';
      const newFen = movePiece(fen, 'e2', 'e4');

      expect(newFen).toContain('w KQkq - 5 10');
    });

    it('should allow moving to the same square (no-op)', () => {
      const newFen = movePiece(DEFAULT_FEN, 'e2', 'e2');

      expect(getPieceAt(newFen, 'e2')).toBe('P');
    });

    it('should allow illegal chess moves (library does not enforce rules)', () => {
      // Move king multiple squares (illegal in chess)
      const newFen = movePiece(DEFAULT_FEN, 'e1', 'e5');

      expect(getPieceAt(newFen, 'e1')).toBe(null);
      expect(getPieceAt(newFen, 'e5')).toBe('K');
    });
  });

  describe('arbitrary positions (no rule enforcement)', () => {
    it('should allow multiple kings of the same color', () => {
      let fen = updatePieceAt(DEFAULT_FEN, 'e4', 'K');
      fen = updatePieceAt(fen, 'd4', 'K');

      expect(getPieceAt(fen, 'e1')).toBe('K');
      expect(getPieceAt(fen, 'e4')).toBe('K');
      expect(getPieceAt(fen, 'd4')).toBe('K');
    });

    it('should allow pawns on first and eighth ranks', () => {
      let fen = updatePieceAt(DEFAULT_FEN, 'e1', 'P');
      fen = updatePieceAt(fen, 'e8', 'P');

      expect(getPieceAt(fen, 'e1')).toBe('P');
      expect(getPieceAt(fen, 'e8')).toBe('P');
    });

    it('should allow removing all pieces', () => {
      let fen = DEFAULT_FEN;

      // Remove all pieces
      for (let rank = 1; rank <= 8; rank++) {
        for (const file of ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']) {
          const square = `${file}${rank}`;
          fen = updatePieceAt(fen, square, null);
        }
      }

      // Check empty board
      for (let rank = 1; rank <= 8; rank++) {
        for (const file of ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']) {
          const square = `${file}${rank}`;
          expect(getPieceAt(fen, square)).toBe(null);
        }
      }
    });
  });
});
