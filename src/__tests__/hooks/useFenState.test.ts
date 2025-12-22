import { renderHook, act } from '@testing-library/react-native';
import { useFenState } from '../../hooks/useFenState';
import { DEFAULT_FEN } from '../../utils/fen';

describe('useFenState', () => {
  const mockOnFenChange = jest.fn();

  beforeEach(() => {
    mockOnFenChange.mockClear();
  });

  describe('initialization', () => {
    it('should initialize with default FEN', () => {
      const { result } = renderHook(() => useFenState(DEFAULT_FEN));

      expect(result.current.fen).toBe(DEFAULT_FEN);
      expect(result.current.components.activeColor).toBe('w');
      expect(result.current.components.castlingAvailability).toBe('KQkq');
    });

    it('should initialize with custom FEN', () => {
      const customFen =
        'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1';
      const { result } = renderHook(() => useFenState(customFen));

      expect(result.current.fen).toBe(customFen);
      expect(result.current.components.activeColor).toBe('b');
      expect(result.current.components.enPassantTarget).toBe('e3');
    });

    it('should parse FEN components correctly', () => {
      const { result } = renderHook(() => useFenState(DEFAULT_FEN));

      expect(result.current.components).toEqual({
        piecePlacement: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
        activeColor: 'w',
        castlingAvailability: 'KQkq',
        enPassantTarget: '-',
        halfmoveClock: 0,
        fullmoveNumber: 1,
      });
    });
  });

  describe('handleFenChange', () => {
    it('should update FEN', () => {
      const { result } = renderHook(() =>
        useFenState(DEFAULT_FEN, mockOnFenChange)
      );

      const newFen = '8/8/8/8/8/8/8/8 w - - 0 1';

      act(() => {
        result.current.handleFenChange(newFen);
      });

      expect(result.current.fen).toBe(newFen);
      expect(mockOnFenChange).toHaveBeenCalledWith(newFen);
    });

    it('should update components when FEN changes', () => {
      const { result } = renderHook(() => useFenState(DEFAULT_FEN));

      const newFen =
        'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1';

      act(() => {
        result.current.handleFenChange(newFen);
      });

      expect(result.current.components.activeColor).toBe('b');
      expect(result.current.components.enPassantTarget).toBe('e3');
    });

    it('should work without onFenChange callback', () => {
      const { result } = renderHook(() => useFenState(DEFAULT_FEN));

      const newFen = '8/8/8/8/8/8/8/8 w - - 0 1';

      expect(() => {
        act(() => {
          result.current.handleFenChange(newFen);
        });
      }).not.toThrow();

      expect(result.current.fen).toBe(newFen);
    });
  });

  describe('handleTurnChange', () => {
    it('should update turn to black', () => {
      const { result } = renderHook(() =>
        useFenState(DEFAULT_FEN, mockOnFenChange)
      );

      act(() => {
        result.current.handleTurnChange('b');
      });

      expect(result.current.components.activeColor).toBe('b');
      expect(result.current.fen).toContain(' b ');
      expect(mockOnFenChange).toHaveBeenCalled();
    });

    it('should update turn to white', () => {
      const blackFen =
        'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1';
      const { result } = renderHook(() =>
        useFenState(blackFen, mockOnFenChange)
      );

      act(() => {
        result.current.handleTurnChange('w');
      });

      expect(result.current.components.activeColor).toBe('w');
      expect(result.current.fen).toContain(' w ');
    });

    it('should preserve other FEN components', () => {
      const { result } = renderHook(() => useFenState(DEFAULT_FEN));

      act(() => {
        result.current.handleTurnChange('b');
      });

      expect(result.current.components.castlingAvailability).toBe('KQkq');
      expect(result.current.components.enPassantTarget).toBe('-');
      expect(result.current.components.halfmoveClock).toBe(0);
      expect(result.current.components.fullmoveNumber).toBe(1);
    });
  });

  describe('handleCastlingChange', () => {
    it('should update castling rights', () => {
      const { result } = renderHook(() =>
        useFenState(DEFAULT_FEN, mockOnFenChange)
      );

      act(() => {
        result.current.handleCastlingChange('Kq');
      });

      expect(result.current.components.castlingAvailability).toBe('Kq');
      expect(result.current.fen).toContain(' Kq ');
      expect(mockOnFenChange).toHaveBeenCalled();
    });

    it('should handle no castling rights', () => {
      const { result } = renderHook(() => useFenState(DEFAULT_FEN));

      act(() => {
        result.current.handleCastlingChange('-');
      });

      expect(result.current.components.castlingAvailability).toBe('-');
      expect(result.current.fen).toContain(' - ');
    });

    it('should handle partial castling rights', () => {
      const { result } = renderHook(() => useFenState(DEFAULT_FEN));

      act(() => {
        result.current.handleCastlingChange('K');
      });

      expect(result.current.components.castlingAvailability).toBe('K');
    });
  });

  describe('handleEnPassantChange', () => {
    it('should update en passant square', () => {
      const { result } = renderHook(() =>
        useFenState(DEFAULT_FEN, mockOnFenChange)
      );

      act(() => {
        result.current.handleEnPassantChange('e3');
      });

      expect(result.current.components.enPassantTarget).toBe('e3');
      expect(result.current.fen).toContain(' e3 ');
      expect(mockOnFenChange).toHaveBeenCalled();
    });

    it('should clear en passant square', () => {
      const fenWithEP =
        'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1';
      const { result } = renderHook(() => useFenState(fenWithEP));

      act(() => {
        result.current.handleEnPassantChange('-');
      });

      expect(result.current.components.enPassantTarget).toBe('-');
    });

    it('should auto-update turn for rank 3 en passant', () => {
      const { result } = renderHook(() => useFenState(DEFAULT_FEN));

      act(() => {
        result.current.handleEnPassantChange('e3');
      });

      // En passant on rank 3 means white pawn just moved, so black to move
      expect(result.current.components.activeColor).toBe('b');
    });

    it('should auto-update turn for rank 6 en passant', () => {
      const blackFen =
        'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 1';
      const { result } = renderHook(() => useFenState(blackFen));

      act(() => {
        result.current.handleEnPassantChange('e6');
      });

      // En passant on rank 6 means black pawn just moved, so white to move
      expect(result.current.components.activeColor).toBe('w');
    });
  });

  describe('handlePieceUpdate', () => {
    it('should update piece at square', () => {
      const { result } = renderHook(() =>
        useFenState(DEFAULT_FEN, mockOnFenChange)
      );

      act(() => {
        result.current.handlePieceUpdate('e4', 'P');
      });

      expect(result.current.fen).toContain('4P3');
      expect(mockOnFenChange).toHaveBeenCalled();
    });

    it('should remove piece from square', () => {
      const { result } = renderHook(() => useFenState(DEFAULT_FEN));

      act(() => {
        result.current.handlePieceUpdate('e2', null);
      });

      // e2 pawn should be removed
      expect(result.current.fen).not.toContain('PPPPPPPP/RNBQKBNR');
    });

    it('should handle multiple piece updates', () => {
      const { result } = renderHook(() => useFenState(DEFAULT_FEN));

      act(() => {
        result.current.handlePieceUpdate('e4', 'P');
      });

      act(() => {
        result.current.handlePieceUpdate('e2', null);
      });

      act(() => {
        result.current.handlePieceUpdate('d5', 'p');
      });

      expect(result.current.components.piecePlacement).toContain('4P3');
    });
  });

  describe('multiple operations', () => {
    it('should handle sequence of operations', () => {
      const { result } = renderHook(() =>
        useFenState(DEFAULT_FEN, mockOnFenChange)
      );

      act(() => {
        result.current.handleTurnChange('b');
      });

      act(() => {
        result.current.handleCastlingChange('Kq');
      });

      act(() => {
        result.current.handleEnPassantChange('e6');
      });

      const finalFen = result.current.fen;

      // Turn should be auto-updated to 'w' by en passant on rank 6 (black just moved)
      expect(finalFen).toContain(' w ');
      expect(finalFen).toContain(' Kq ');
      expect(finalFen).toContain(' e6 ');
      expect(mockOnFenChange).toHaveBeenCalledTimes(3);
    });

    it('should maintain consistency across operations', () => {
      const { result } = renderHook(() => useFenState(DEFAULT_FEN));

      act(() => {
        result.current.handlePieceUpdate('e4', 'P');
      });

      act(() => {
        result.current.handlePieceUpdate('e2', null);
      });

      act(() => {
        result.current.handleTurnChange('b');
      });

      act(() => {
        result.current.handleEnPassantChange('e3');
      });

      // After setting e3, turn should be auto-updated to 'b' (white just moved)
      expect(result.current.components.activeColor).toBe('b');
      expect(result.current.components.enPassantTarget).toBe('e3');
    });
  });
});
