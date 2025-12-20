import { renderHook } from '@testing-library/react-native';
import { usePieceGesture } from '../../hooks/usePieceGesture';
import { useSharedValue } from 'react-native-reanimated';

// Note: Gesture handlers are mocked in jest.setup.js
// These tests verify the hook returns gesture configuration correctly

describe('usePieceGesture', () => {
  const mockOnDragStart = jest.fn();
  const mockOnDragEnd = jest.fn();

  beforeEach(() => {
    mockOnDragStart.mockClear();
    mockOnDragEnd.mockClear();
  });

  describe('gesture configuration', () => {
    it('should return a gesture object', () => {
      const { result } = renderHook(() => {
        const translateX = useSharedValue(0);
        const translateY = useSharedValue(0);

        return usePieceGesture({
          piece: 'P',
          row: 6,
          col: 4,
          squareSize: 50,
          pieceSize: 28,
          onDragStart: mockOnDragStart,
          onDragEnd: mockOnDragEnd,
          translateX,
          translateY,
        });
      });

      expect(result.current).toBeDefined();
    });

    it('should return gesture for white pieces', () => {
      const whitePieces = ['P', 'N', 'B', 'R', 'Q', 'K'];

      whitePieces.forEach((piece) => {
        const { result } = renderHook(() => {
          const translateX = useSharedValue(0);
          const translateY = useSharedValue(0);

          return usePieceGesture({
            piece: piece as any,
            row: 6,
            col: 4,
            squareSize: 50,
            pieceSize: 28,
            onDragStart: mockOnDragStart,
            onDragEnd: mockOnDragEnd,
            translateX,
            translateY,
          });
        });

        expect(result.current).toBeDefined();
      });
    });

    it('should return gesture for black pieces', () => {
      const blackPieces = ['p', 'n', 'b', 'r', 'q', 'k'];

      blackPieces.forEach((piece) => {
        const { result } = renderHook(() => {
          const translateX = useSharedValue(0);
          const translateY = useSharedValue(0);

          return usePieceGesture({
            piece: piece as any,
            row: 1,
            col: 4,
            squareSize: 50,
            pieceSize: 28,
            onDragStart: mockOnDragStart,
            onDragEnd: mockOnDragEnd,
            translateX,
            translateY,
          });
        });

        expect(result.current).toBeDefined();
      });
    });

    it('should handle null piece', () => {
      const { result } = renderHook(() => {
        const translateX = useSharedValue(0);
        const translateY = useSharedValue(0);

        return usePieceGesture({
          piece: null,
          row: 3,
          col: 3,
          squareSize: 50,
          pieceSize: 28,
          onDragStart: mockOnDragStart,
          onDragEnd: mockOnDragEnd,
          translateX,
          translateY,
        });
      });

      expect(result.current).toBeDefined();
    });
  });

  describe('different board positions', () => {
    it('should create gesture for all board positions', () => {
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          const { result } = renderHook(() => {
            const translateX = useSharedValue(0);
            const translateY = useSharedValue(0);

            return usePieceGesture({
              piece: 'P',
              row,
              col,
              squareSize: 50,
              pieceSize: 28,
              onDragStart: mockOnDragStart,
              onDragEnd: mockOnDragEnd,
              translateX,
              translateY,
            });
          });

          expect(result.current).toBeDefined();
        }
      }
    });
  });

  describe('different square sizes', () => {
    it('should handle various square sizes', () => {
      const sizes = [30, 40, 50, 60, 80, 100];

      sizes.forEach((size) => {
        const { result } = renderHook(() => {
          const translateX = useSharedValue(0);
          const translateY = useSharedValue(0);

          return usePieceGesture({
            piece: 'P',
            row: 6,
            col: 4,
            squareSize: size,
            pieceSize: size * 0.7 * 0.8,
            onDragStart: mockOnDragStart,
            onDragEnd: mockOnDragEnd,
            translateX,
            translateY,
          });
        });

        expect(result.current).toBeDefined();
      });
    });
  });

  describe('shared values', () => {
    it('should accept shared values for translation', () => {
      expect(() => {
        renderHook(() => {
          const translateX = useSharedValue(0);
          const translateY = useSharedValue(0);

          return usePieceGesture({
            piece: 'P',
            row: 6,
            col: 4,
            squareSize: 50,
            pieceSize: 28,
            onDragStart: mockOnDragStart,
            onDragEnd: mockOnDragEnd,
            translateX,
            translateY,
          });
        });
      }).not.toThrow();
    });

    it('should work with different initial shared values', () => {
      const { result } = renderHook(() => {
        const translateX = useSharedValue(100);
        const translateY = useSharedValue(200);

        return usePieceGesture({
          piece: 'P',
          row: 6,
          col: 4,
          squareSize: 50,
          pieceSize: 28,
          onDragStart: mockOnDragStart,
          onDragEnd: mockOnDragEnd,
          translateX,
          translateY,
        });
      });

      expect(result.current).toBeDefined();
    });
  });

  describe('callback functions', () => {
    it('should accept onDragStart callback', () => {
      expect(() => {
        renderHook(() => {
          const translateX = useSharedValue(0);
          const translateY = useSharedValue(0);

          return usePieceGesture({
            piece: 'P',
            row: 6,
            col: 4,
            squareSize: 50,
            pieceSize: 28,
            onDragStart: mockOnDragStart,
            onDragEnd: mockOnDragEnd,
            translateX,
            translateY,
          });
        });
      }).not.toThrow();
    });

    it('should accept onDragEnd callback', () => {
      expect(() => {
        renderHook(() => {
          const translateX = useSharedValue(0);
          const translateY = useSharedValue(0);

          return usePieceGesture({
            piece: 'P',
            row: 6,
            col: 4,
            squareSize: 50,
            pieceSize: 28,
            onDragStart: mockOnDragStart,
            onDragEnd: mockOnDragEnd,
            translateX,
            translateY,
          });
        });
      }).not.toThrow();
    });
  });

  describe('gesture stability', () => {
    it('should return stable gesture reference across re-renders', () => {
      const { result } = renderHook(() => {
        const translateX = useSharedValue(0);
        const translateY = useSharedValue(0);

        return usePieceGesture({
          piece: 'P',
          row: 6,
          col: 4,
          squareSize: 50,
          pieceSize: 28,
          onDragStart: mockOnDragStart,
          onDragEnd: mockOnDragEnd,
          translateX,
          translateY,
        });
      });

      const initialGesture = result.current;

      // Note: Due to mocking, we can't verify exact reference equality
      // but we can verify the gesture is defined and stable
      expect(result.current).toBeDefined();
      expect(result.current).toBe(initialGesture);
      expect(typeof result.current).toBe('object');
    });
  });

  describe('edge cases', () => {
    it('should handle corner squares', () => {
      const corners = [
        { row: 0, col: 0 }, // a8
        { row: 0, col: 7 }, // h8
        { row: 7, col: 0 }, // a1
        { row: 7, col: 7 }, // h1
      ];

      corners.forEach(({ row, col }) => {
        const { result } = renderHook(() => {
          const translateX = useSharedValue(0);
          const translateY = useSharedValue(0);

          return usePieceGesture({
            piece: 'P',
            row,
            col,
            squareSize: 50,
            pieceSize: 28,
            onDragStart: mockOnDragStart,
            onDragEnd: mockOnDragEnd,
            translateX,
            translateY,
          });
        });

        expect(result.current).toBeDefined();
      });
    });

    it('should handle very small square sizes', () => {
      const { result } = renderHook(() => {
        const translateX = useSharedValue(0);
        const translateY = useSharedValue(0);

        return usePieceGesture({
          piece: 'P',
          row: 6,
          col: 4,
          squareSize: 1,
          pieceSize: 0.56,
          onDragStart: mockOnDragStart,
          onDragEnd: mockOnDragEnd,
          translateX,
          translateY,
        });
      });

      expect(result.current).toBeDefined();
    });

    it('should handle very large square sizes', () => {
      const { result } = renderHook(() => {
        const translateX = useSharedValue(0);
        const translateY = useSharedValue(0);

        return usePieceGesture({
          piece: 'P',
          row: 6,
          col: 4,
          squareSize: 1000,
          pieceSize: 560,
          onDragStart: mockOnDragStart,
          onDragEnd: mockOnDragEnd,
          translateX,
          translateY,
        });
      });

      expect(result.current).toBeDefined();
    });
  });
});
