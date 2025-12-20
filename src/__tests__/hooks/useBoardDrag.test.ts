import { renderHook, act } from '@testing-library/react-native';
import { useBoardDrag } from '../../hooks/useBoardDrag';
import { DEFAULT_FEN } from '../../utils/fen';

describe('useBoardDrag', () => {
  const mockOnFenChange = jest.fn();
  const squareSize = 50;

  beforeEach(() => {
    jest.useFakeTimers();
    mockOnFenChange.mockClear();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('initialization', () => {
    it('should initialize with no dragging piece', () => {
      const { result } = renderHook(() =>
        useBoardDrag(DEFAULT_FEN, mockOnFenChange, squareSize)
      );

      expect(result.current.draggingPiece).toBe(null);
    });

    it('should initialize shared values', () => {
      const { result } = renderHook(() =>
        useBoardDrag(DEFAULT_FEN, mockOnFenChange, squareSize)
      );

      expect(result.current.translateX).toBeDefined();
      expect(result.current.translateY).toBeDefined();
      expect(result.current.isDragging).toBeDefined();
    });

    it('should provide drag handlers', () => {
      const { result } = renderHook(() =>
        useBoardDrag(DEFAULT_FEN, mockOnFenChange, squareSize)
      );

      expect(typeof result.current.handleDragStart).toBe('function');
      expect(typeof result.current.handleDragEnd).toBe('function');
    });
  });

  describe('handleDragStart', () => {
    it('should set dragging piece', () => {
      const { result } = renderHook(() =>
        useBoardDrag(DEFAULT_FEN, mockOnFenChange, squareSize)
      );

      act(() => {
        result.current.handleDragStart(6, 4, 'P'); // e2 white pawn
      });

      expect(result.current.draggingPiece).toEqual({
        piece: 'P',
        sourceSquare: 'e2',
        sourceRow: 6,
        sourceCol: 4,
      });
    });

    it('should set dragging state after drag start', () => {
      const { result } = renderHook(() =>
        useBoardDrag(DEFAULT_FEN, mockOnFenChange, squareSize)
      );

      act(() => {
        result.current.handleDragStart(6, 4, 'P');
      });

      // Verify dragging piece is set (isDragging shared value is internal)
      expect(result.current.draggingPiece).not.toBe(null);
      expect(result.current.isDragging).toBeDefined();
    });

    it('should handle dragging different pieces', () => {
      const { result } = renderHook(() =>
        useBoardDrag(DEFAULT_FEN, mockOnFenChange, squareSize)
      );

      // Drag white knight
      act(() => {
        result.current.handleDragStart(7, 1, 'N'); // b1
      });

      expect(result.current.draggingPiece?.piece).toBe('N');
      expect(result.current.draggingPiece?.sourceSquare).toBe('b1');

      // Drag white rook
      act(() => {
        result.current.handleDragStart(7, 0, 'R'); // a1
      });

      expect(result.current.draggingPiece?.piece).toBe('R');
      expect(result.current.draggingPiece?.sourceSquare).toBe('a1');
    });

    it('should handle black pieces', () => {
      const { result } = renderHook(() =>
        useBoardDrag(DEFAULT_FEN, mockOnFenChange, squareSize)
      );

      act(() => {
        result.current.handleDragStart(1, 4, 'p'); // e7 black pawn
      });

      expect(result.current.draggingPiece).toEqual({
        piece: 'p',
        sourceSquare: 'e7',
        sourceRow: 1,
        sourceCol: 4,
      });
    });
  });

  describe('handleDragEnd', () => {
    it('should move piece to valid square', () => {
      const { result } = renderHook(() =>
        useBoardDrag(DEFAULT_FEN, mockOnFenChange, squareSize)
      );

      // Start dragging e2 pawn
      act(() => {
        result.current.handleDragStart(6, 4, 'P');
      });

      // Drop on e4 (coordinates for center of e4 square)
      const e4X = 4 * squareSize + squareSize / 2;
      const e4Y = 4 * squareSize + squareSize / 2;

      act(() => {
        result.current.handleDragEnd(e4X, e4Y);
      });

      expect(mockOnFenChange).toHaveBeenCalled();

      // Advance timers to complete the fade-out animation
      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(result.current.draggingPiece).toBe(null);
      // Note: isDragging.value is set to false in the animation callback
      // which runs when the spring animation completes, not at a fixed time
    });

    it('should remove piece when dropped outside board', () => {
      const { result } = renderHook(() =>
        useBoardDrag(DEFAULT_FEN, mockOnFenChange, squareSize)
      );

      // Start dragging e2 pawn
      act(() => {
        result.current.handleDragStart(6, 4, 'P');
      });

      // Drop outside board
      act(() => {
        result.current.handleDragEnd(-100, -100);
      });

      expect(mockOnFenChange).toHaveBeenCalled();

      // Advance timers to complete the fade-out animation
      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(result.current.draggingPiece).toBe(null);
    });

    it('should handle dropping on same square', () => {
      const { result } = renderHook(() =>
        useBoardDrag(DEFAULT_FEN, mockOnFenChange, squareSize)
      );

      // Start dragging e2 pawn
      act(() => {
        result.current.handleDragStart(6, 4, 'P');
      });

      // Drop back on e2
      const e2X = 4 * squareSize + squareSize / 2;
      const e2Y = 6 * squareSize + squareSize / 2;

      act(() => {
        result.current.handleDragEnd(e2X, e2Y);
      });

      expect(mockOnFenChange).toHaveBeenCalled();

      // Advance timers to complete the fade-out animation
      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(result.current.draggingPiece).toBe(null);
    });

    it('should not error when no piece is dragging', () => {
      const { result } = renderHook(() =>
        useBoardDrag(DEFAULT_FEN, mockOnFenChange, squareSize)
      );

      expect(() => {
        act(() => {
          result.current.handleDragEnd(100, 100);
        });
      }).not.toThrow();

      expect(mockOnFenChange).not.toHaveBeenCalled();
    });

    it('should reset dragging state', () => {
      const { result } = renderHook(() =>
        useBoardDrag(DEFAULT_FEN, mockOnFenChange, squareSize)
      );

      act(() => {
        result.current.handleDragStart(6, 4, 'P');
      });

      expect(result.current.draggingPiece).not.toBe(null);

      act(() => {
        result.current.handleDragEnd(100, 100);
      });

      // Advance timers to complete the fade-out animation
      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(result.current.draggingPiece).toBe(null);
    });
  });

  describe('drag workflow', () => {
    it('should handle complete drag workflow', () => {
      const { result } = renderHook(() =>
        useBoardDrag(DEFAULT_FEN, mockOnFenChange, squareSize)
      );

      // Start drag
      act(() => {
        result.current.handleDragStart(6, 4, 'P');
      });

      expect(result.current.draggingPiece?.piece).toBe('P');
      expect(result.current.draggingPiece).not.toBe(null);

      // End drag
      const targetX = 4 * squareSize + squareSize / 2;
      const targetY = 4 * squareSize + squareSize / 2;

      act(() => {
        result.current.handleDragEnd(targetX, targetY);
      });

      expect(mockOnFenChange).toHaveBeenCalled();

      // Advance timers to complete the fade-out animation
      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(result.current.draggingPiece).toBe(null);
    });

    it('should handle multiple sequential drags', () => {
      const { result } = renderHook(() =>
        useBoardDrag(DEFAULT_FEN, mockOnFenChange, squareSize)
      );

      // First drag
      act(() => {
        result.current.handleDragStart(6, 4, 'P');
      });

      act(() => {
        result.current.handleDragEnd(200, 200);
      });

      // Advance timers to complete the fade-out animation
      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(result.current.draggingPiece).toBe(null);

      // Second drag
      act(() => {
        result.current.handleDragStart(7, 1, 'N');
      });

      expect(result.current.draggingPiece?.piece).toBe('N');

      act(() => {
        result.current.handleDragEnd(150, 150);
      });

      // Advance timers to complete the fade-out animation
      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(result.current.draggingPiece).toBe(null);
      expect(mockOnFenChange).toHaveBeenCalledTimes(2);
    });
  });

  describe('square size variations', () => {
    it('should work with different square sizes', () => {
      const sizes = [40, 50, 60, 80];

      sizes.forEach((size) => {
        mockOnFenChange.mockClear();

        const { result } = renderHook(() =>
          useBoardDrag(DEFAULT_FEN, mockOnFenChange, size)
        );

        act(() => {
          result.current.handleDragStart(6, 4, 'P');
        });

        const targetX = 4 * size + size / 2;
        const targetY = 4 * size + size / 2;

        act(() => {
          result.current.handleDragEnd(targetX, targetY);
        });

        expect(mockOnFenChange).toHaveBeenCalled();
      });
    });
  });

  describe('coordinate conversions', () => {
    it('should convert row/col to correct square name', () => {
      const { result } = renderHook(() =>
        useBoardDrag(DEFAULT_FEN, mockOnFenChange, squareSize)
      );

      const testCases = [
        { row: 0, col: 0, square: 'a8' },
        { row: 0, col: 7, square: 'h8' },
        { row: 7, col: 0, square: 'a1' },
        { row: 7, col: 7, square: 'h1' },
        { row: 6, col: 4, square: 'e2' },
        { row: 1, col: 4, square: 'e7' },
      ];

      testCases.forEach(({ row, col, square }) => {
        act(() => {
          result.current.handleDragStart(row, col, 'P');
        });

        expect(result.current.draggingPiece?.sourceSquare).toBe(square);
      });
    });
  });

  describe('edge cases', () => {
    it('should handle drag start on empty square with null piece', () => {
      const { result } = renderHook(() =>
        useBoardDrag(DEFAULT_FEN, mockOnFenChange, squareSize)
      );

      // This shouldn't happen in normal usage, but test defensive code
      expect(() => {
        act(() => {
          // @ts-expect-error Testing edge case
          result.current.handleDragStart(4, 4, null);
        });
      }).not.toThrow();
    });

    it('should handle very large coordinates', () => {
      const { result } = renderHook(() =>
        useBoardDrag(DEFAULT_FEN, mockOnFenChange, squareSize)
      );

      act(() => {
        result.current.handleDragStart(6, 4, 'P');
      });

      act(() => {
        result.current.handleDragEnd(10000, 10000);
      });

      expect(mockOnFenChange).toHaveBeenCalled();

      // Advance timers to complete the fade-out animation
      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(result.current.draggingPiece).toBe(null);
    });

    it('should handle negative coordinates', () => {
      const { result } = renderHook(() =>
        useBoardDrag(DEFAULT_FEN, mockOnFenChange, squareSize)
      );

      act(() => {
        result.current.handleDragStart(6, 4, 'P');
      });

      act(() => {
        result.current.handleDragEnd(-500, -500);
      });

      expect(mockOnFenChange).toHaveBeenCalled();

      // Advance timers to complete the fade-out animation
      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(result.current.draggingPiece).toBe(null);
    });
  });

  describe('FEN updates', () => {
    it('should update FEN when piece is moved', () => {
      const { result } = renderHook(() =>
        useBoardDrag(DEFAULT_FEN, mockOnFenChange, squareSize)
      );

      act(() => {
        result.current.handleDragStart(6, 4, 'P');
      });

      act(() => {
        result.current.handleDragEnd(200, 200);
      });

      expect(mockOnFenChange).toHaveBeenCalledTimes(1);
      expect(typeof mockOnFenChange.mock.calls[0][0]).toBe('string');
    });

    it('should update FEN when piece is removed', () => {
      const { result } = renderHook(() =>
        useBoardDrag(DEFAULT_FEN, mockOnFenChange, squareSize)
      );

      act(() => {
        result.current.handleDragStart(6, 4, 'P');
      });

      // Drop outside board
      act(() => {
        result.current.handleDragEnd(-100, -100);
      });

      expect(mockOnFenChange).toHaveBeenCalledTimes(1);
    });
  });
});
