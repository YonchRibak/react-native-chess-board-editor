import {
  parseFen,
  componentsToFen,
  fenToBoardState,
  boardStateToFen,
  DEFAULT_FEN,
} from '../../utils/fen';
import type { BoardState } from '../../types';

describe('FEN Parsing and Conversion', () => {
  describe('parseFen', () => {
    it('should parse the default starting position', () => {
      const components = parseFen(DEFAULT_FEN);
      expect(components.piecePlacement).toBe(
        'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR'
      );
      expect(components.activeColor).toBe('w');
      expect(components.castlingAvailability).toBe('KQkq');
      expect(components.enPassantTarget).toBe('-');
      expect(components.halfmoveClock).toBe(0);
      expect(components.fullmoveNumber).toBe(1);
    });

    it('should parse a position after e4', () => {
      const fen =
        'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1';
      const components = parseFen(fen);
      expect(components.piecePlacement).toBe(
        'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR'
      );
      expect(components.activeColor).toBe('b');
      expect(components.castlingAvailability).toBe('KQkq');
      expect(components.enPassantTarget).toBe('e3');
      expect(components.halfmoveClock).toBe(0);
      expect(components.fullmoveNumber).toBe(1);
    });

    it('should parse a position with no castling rights', () => {
      const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w - - 0 1';
      const components = parseFen(fen);
      expect(components.castlingAvailability).toBe('-');
    });

    it('should parse a position with partial castling rights', () => {
      const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w Kq - 0 1';
      const components = parseFen(fen);
      expect(components.castlingAvailability).toBe('Kq');
    });

    it('should handle different move counts', () => {
      const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 5 10';
      const components = parseFen(fen);
      expect(components.halfmoveClock).toBe(5);
      expect(components.fullmoveNumber).toBe(10);
    });
  });

  describe('componentsToFen', () => {
    it('should convert components back to FEN string', () => {
      const components = {
        piecePlacement: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
        activeColor: 'w' as const,
        castlingAvailability: 'KQkq',
        enPassantTarget: '-',
        halfmoveClock: 0,
        fullmoveNumber: 1,
      };
      const fen = componentsToFen(components);
      expect(fen).toBe(DEFAULT_FEN);
    });

    it('should handle en passant square', () => {
      const components = {
        piecePlacement: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR',
        activeColor: 'b' as const,
        castlingAvailability: 'KQkq',
        enPassantTarget: 'e3',
        halfmoveClock: 0,
        fullmoveNumber: 1,
      };
      const fen = componentsToFen(components);
      expect(fen).toBe(
        'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1'
      );
    });
  });

  describe('fenToBoardState', () => {
    it('should convert starting position to board state', () => {
      const board = fenToBoardState(
        'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR'
      );

      // Check dimensions
      expect(board.length).toBe(8);
      expect(board[0].length).toBe(8);

      // Check first rank (black pieces)
      expect(board[0]).toEqual(['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r']);

      // Check second rank (black pawns)
      expect(board[1]).toEqual(['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p']);

      // Check empty ranks
      for (let row = 2; row < 6; row++) {
        expect(board[row]).toEqual([
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
        ]);
      }

      // Check seventh rank (white pawns)
      expect(board[6]).toEqual(['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P']);

      // Check eighth rank (white pieces)
      expect(board[7]).toEqual(['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']);
    });

    it('should handle position after e4', () => {
      const board = fenToBoardState(
        'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR'
      );

      // Check white pawn on e4 (row 4, col 4)
      expect(board[4][4]).toBe('P');

      // Check e2 is empty
      expect(board[6][4]).toBe(null);
    });

    it('should handle empty board', () => {
      const board = fenToBoardState('8/8/8/8/8/8/8/8');

      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          expect(board[row][col]).toBe(null);
        }
      }
    });
  });

  describe('boardStateToFen', () => {
    it('should convert board state to FEN piece placement', () => {
      const board: BoardState = [
        ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
        ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
      ];

      const fen = boardStateToFen(board);
      expect(fen).toBe('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');
    });

    it('should handle position after e4', () => {
      const board: BoardState = [
        ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
        ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, 'P', null, null, null],
        [null, null, null, null, null, null, null, null],
        ['P', 'P', 'P', 'P', null, 'P', 'P', 'P'],
        ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
      ];

      const fen = boardStateToFen(board);
      expect(fen).toBe('rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR');
    });

    it('should handle empty board', () => {
      const board: BoardState = Array(8)
        .fill(null)
        .map(() => Array(8).fill(null));

      const fen = boardStateToFen(board);
      expect(fen).toBe('8/8/8/8/8/8/8/8');
    });
  });

  describe('roundtrip conversions', () => {
    it('should convert FEN to board state and back', () => {
      const testFens = [
        'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
        'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR',
        '8/8/8/8/8/8/8/8',
        'r1bqkb1r/pppp1ppp/2n2n2/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R',
      ];

      testFens.forEach((fen) => {
        const board = fenToBoardState(fen);
        const backToFen = boardStateToFen(board);
        expect(backToFen).toBe(fen);
      });
    });

    it('should parse FEN and convert back', () => {
      const testFens = [
        DEFAULT_FEN,
        'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1',
        'r1bqkb1r/pppp1ppp/2n2n2/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4',
      ];

      testFens.forEach((fen) => {
        const components = parseFen(fen);
        const backToFen = componentsToFen(components);
        expect(backToFen).toBe(fen);
      });
    });
  });
});
