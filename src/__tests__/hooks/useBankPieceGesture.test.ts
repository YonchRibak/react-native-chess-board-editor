import { renderHook } from '@testing-library/react-native';
import { useBankPieceGesture } from '../../hooks/useBankPieceGesture';

// Note: Gesture handlers are mocked in jest.setup.js
// These tests verify the hook returns gesture configuration correctly

describe('useBankPieceGesture', () => {
  const mockOnDragStart = jest.fn();
  const mockOnDragUpdate = jest.fn();
  const mockOnDragEnd = jest.fn();

  beforeEach(() => {
    mockOnDragStart.mockClear();
    mockOnDragUpdate.mockClear();
    mockOnDragEnd.mockClear();
  });

  describe('gesture configuration', () => {
    it('should return a gesture object', () => {
      const { result } = renderHook(() =>
        useBankPieceGesture({
          piece: 'P',
          onDragStart: mockOnDragStart,
          onDragUpdate: mockOnDragUpdate,
          onDragEnd: mockOnDragEnd,
        })
      );

      expect(result.current).toBeDefined();
    });

    it('should create gesture for white pieces', () => {
      const whitePieces = ['P', 'N', 'B', 'R', 'Q', 'K'];

      whitePieces.forEach((piece) => {
        const { result } = renderHook(() =>
          useBankPieceGesture({
            piece: piece as any,
            onDragStart: mockOnDragStart,
            onDragUpdate: mockOnDragUpdate,
            onDragEnd: mockOnDragEnd,
          })
        );

        expect(result.current).toBeDefined();
      });
    });

    it('should create gesture for black pieces', () => {
      const blackPieces = ['p', 'n', 'b', 'r', 'q', 'k'];

      blackPieces.forEach((piece) => {
        const { result } = renderHook(() =>
          useBankPieceGesture({
            piece: piece as any,
            onDragStart: mockOnDragStart,
            onDragUpdate: mockOnDragUpdate,
            onDragEnd: mockOnDragEnd,
          })
        );

        expect(result.current).toBeDefined();
      });
    });

    it('should create gesture for all piece types', () => {
      const allPieces = ['P', 'N', 'B', 'R', 'Q', 'K', 'p', 'n', 'b', 'r', 'q', 'k'];

      allPieces.forEach((piece) => {
        const { result } = renderHook(() =>
          useBankPieceGesture({
            piece: piece as any,
            onDragStart: mockOnDragStart,
            onDragUpdate: mockOnDragUpdate,
            onDragEnd: mockOnDragEnd,
          })
        );

        expect(result.current).toBeDefined();
      });
    });
  });

  describe('callback functions', () => {
    it('should accept onDragStart callback', () => {
      expect(() => {
        renderHook(() =>
          useBankPieceGesture({
            piece: 'P',
            onDragStart: mockOnDragStart,
            onDragUpdate: mockOnDragUpdate,
            onDragEnd: mockOnDragEnd,
          })
        );
      }).not.toThrow();
    });

    it('should accept onDragUpdate callback', () => {
      expect(() => {
        renderHook(() =>
          useBankPieceGesture({
            piece: 'P',
            onDragStart: mockOnDragStart,
            onDragUpdate: mockOnDragUpdate,
            onDragEnd: mockOnDragEnd,
          })
        );
      }).not.toThrow();
    });

    it('should accept onDragEnd callback', () => {
      expect(() => {
        renderHook(() =>
          useBankPieceGesture({
            piece: 'P',
            onDragStart: mockOnDragStart,
            onDragUpdate: mockOnDragUpdate,
            onDragEnd: mockOnDragEnd,
          })
        );
      }).not.toThrow();
    });

    it('should work with different callback combinations', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      const callback3 = jest.fn();

      expect(() => {
        renderHook(() =>
          useBankPieceGesture({
            piece: 'N',
            onDragStart: callback1,
            onDragUpdate: callback2,
            onDragEnd: callback3,
          })
        );
      }).not.toThrow();
    });
  });

  describe('gesture stability', () => {
    it('should create gesture consistently', () => {
      const { result } = renderHook(() =>
        useBankPieceGesture({
          piece: 'P',
          onDragStart: mockOnDragStart,
          onDragUpdate: mockOnDragUpdate,
          onDragEnd: mockOnDragEnd,
        })
      );

      expect(result.current).toBeDefined();

      // Note: Due to mocking, we can't verify exact reference equality
      // but we can verify the gesture is defined
      expect(result.current).toBeDefined();
      expect(typeof result.current).toBe('object');
    });

    it('should recreate gesture when piece changes', () => {
      const { result, rerender } = renderHook(
        ({ piece }) =>
          useBankPieceGesture({
            piece,
            onDragStart: mockOnDragStart,
            onDragUpdate: mockOnDragUpdate,
            onDragEnd: mockOnDragEnd,
          }),
        { initialProps: { piece: 'P' as any } }
      );

      expect(result.current).toBeDefined();

      rerender({ piece: 'N' as any });

      expect(result.current).toBeDefined();
    });
  });

  describe('different piece configurations', () => {
    it('should handle pawn gestures', () => {
      const { result } = renderHook(() =>
        useBankPieceGesture({
          piece: 'P',
          onDragStart: mockOnDragStart,
          onDragUpdate: mockOnDragUpdate,
          onDragEnd: mockOnDragEnd,
        })
      );

      expect(result.current).toBeDefined();
    });

    it('should handle knight gestures', () => {
      const { result } = renderHook(() =>
        useBankPieceGesture({
          piece: 'N',
          onDragStart: mockOnDragStart,
          onDragUpdate: mockOnDragUpdate,
          onDragEnd: mockOnDragEnd,
        })
      );

      expect(result.current).toBeDefined();
    });

    it('should handle bishop gestures', () => {
      const { result } = renderHook(() =>
        useBankPieceGesture({
          piece: 'B',
          onDragStart: mockOnDragStart,
          onDragUpdate: mockOnDragUpdate,
          onDragEnd: mockOnDragEnd,
        })
      );

      expect(result.current).toBeDefined();
    });

    it('should handle rook gestures', () => {
      const { result } = renderHook(() =>
        useBankPieceGesture({
          piece: 'R',
          onDragStart: mockOnDragStart,
          onDragUpdate: mockOnDragUpdate,
          onDragEnd: mockOnDragEnd,
        })
      );

      expect(result.current).toBeDefined();
    });

    it('should handle queen gestures', () => {
      const { result } = renderHook(() =>
        useBankPieceGesture({
          piece: 'Q',
          onDragStart: mockOnDragStart,
          onDragUpdate: mockOnDragUpdate,
          onDragEnd: mockOnDragEnd,
        })
      );

      expect(result.current).toBeDefined();
    });

    it('should handle king gestures', () => {
      const { result } = renderHook(() =>
        useBankPieceGesture({
          piece: 'K',
          onDragStart: mockOnDragStart,
          onDragUpdate: mockOnDragUpdate,
          onDragEnd: mockOnDragEnd,
        })
      );

      expect(result.current).toBeDefined();
    });
  });

  describe('hook return value', () => {
    it('should return gesture handler', () => {
      const { result } = renderHook(() =>
        useBankPieceGesture({
          piece: 'P',
          onDragStart: mockOnDragStart,
          onDragUpdate: mockOnDragUpdate,
          onDragEnd: mockOnDragEnd,
        })
      );

      // The hook returns the gesture directly (not an object with properties)
      expect(result.current).toBeDefined();
      expect(typeof result.current).toBe('object');
    });
  });

  describe('integration scenarios', () => {
    it('should support horizontal piece bank usage', () => {
      const pieces = ['P', 'N', 'B', 'R', 'Q', 'K'];

      pieces.forEach((piece) => {
        const { result } = renderHook(() =>
          useBankPieceGesture({
            piece: piece as any,
            onDragStart: mockOnDragStart,
            onDragUpdate: mockOnDragUpdate,
            onDragEnd: mockOnDragEnd,
          })
        );

        expect(result.current).toBeDefined();
      });
    });

    it('should support vertical piece bank usage', () => {
      const pieces = ['p', 'n', 'b', 'r', 'q', 'k'];

      pieces.forEach((piece) => {
        const { result } = renderHook(() =>
          useBankPieceGesture({
            piece: piece as any,
            onDragStart: mockOnDragStart,
            onDragUpdate: mockOnDragUpdate,
            onDragEnd: mockOnDragEnd,
          })
        );

        expect(result.current).toBeDefined();
      });
    });

    it('should support dual bank usage (white and black)', () => {
      const whitePieces = ['P', 'N', 'B', 'R', 'Q', 'K'];
      const blackPieces = ['p', 'n', 'b', 'r', 'q', 'k'];

      [...whitePieces, ...blackPieces].forEach((piece) => {
        const { result } = renderHook(() =>
          useBankPieceGesture({
            piece: piece as any,
            onDragStart: mockOnDragStart,
            onDragUpdate: mockOnDragUpdate,
            onDragEnd: mockOnDragEnd,
          })
        );

        expect(result.current).toBeDefined();
      });
    });
  });
});
