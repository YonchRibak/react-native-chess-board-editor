import { renderHook, act } from '@testing-library/react-native';
import { useBankDrag } from '../../hooks/useBankDrag';
import type { ComponentLayout } from '../../types/bank';

describe('useBankDrag', () => {
  const mockOnPieceDropCoords = jest.fn();
  const pieceSize = 50;
  const bankLayout: ComponentLayout = {
    x: 100,
    y: 200,
    width: 300,
    height: 50,
  };

  beforeEach(() => {
    mockOnPieceDropCoords.mockClear();
  });

  describe('initialization', () => {
    it('should initialize with no dragging piece', () => {
      const { result } = renderHook(() =>
        useBankDrag({ pieceSize, bankLayout })
      );

      expect(result.current.dragging).toBe(null);
    });

    it('should initialize shared values', () => {
      const { result } = renderHook(() =>
        useBankDrag({ pieceSize, bankLayout })
      );

      expect(result.current.translateX).toBeDefined();
      expect(result.current.translateY).toBeDefined();
      expect(result.current.opacity).toBeDefined();
      expect(result.current.opacity.value).toBe(0);
    });

    it('should provide drag handlers', () => {
      const { result } = renderHook(() =>
        useBankDrag({ pieceSize, bankLayout })
      );

      expect(typeof result.current.handleDragStart).toBe('function');
      expect(typeof result.current.handleDragUpdate).toBe('function');
      expect(typeof result.current.handleDragEnd).toBe('function');
    });
  });

  describe('handleDragStart', () => {
    it('should set dragging piece', () => {
      const { result } = renderHook(() =>
        useBankDrag({ pieceSize, bankLayout })
      );

      act(() => {
        result.current.handleDragStart('P', 150, 250);
      });

      expect(result.current.dragging).toEqual({
        piece: 'P',
        startX: 150,
        startY: 250,
      });
    });

    it('should set opacity to 1', () => {
      const { result } = renderHook(() =>
        useBankDrag({ pieceSize, bankLayout })
      );

      act(() => {
        result.current.handleDragStart('P', 150, 250);
      });

      expect(result.current.opacity.value).toBe(1);
    });

    it('should position floating piece correctly', () => {
      const { result } = renderHook(() =>
        useBankDrag({ pieceSize, bankLayout })
      );

      const startX = 150;
      const startY = 250;

      act(() => {
        result.current.handleDragStart('P', startX, startY);
      });

      // Piece should be centered on touch point, accounting for bank position
      const actualPieceSize = pieceSize * 0.8;
      const expectedX = startX - bankLayout.x - actualPieceSize / 2;
      const expectedY = startY - bankLayout.y - actualPieceSize / 2;

      expect(result.current.translateX.value).toBe(expectedX);
      expect(result.current.translateY.value).toBe(expectedY);
    });

    it('should handle different pieces', () => {
      const { result } = renderHook(() =>
        useBankDrag({ pieceSize, bankLayout })
      );

      const pieces = ['P', 'N', 'B', 'R', 'Q', 'K', 'p', 'n', 'b', 'r', 'q', 'k'];

      pieces.forEach((piece) => {
        act(() => {
          result.current.handleDragStart(piece as any, 150, 250);
        });

        expect(result.current.dragging?.piece).toBe(piece);
      });
    });
  });

  describe('handleDragUpdate', () => {
    it('should update translate values', () => {
      const { result } = renderHook(() =>
        useBankDrag({ pieceSize, bankLayout })
      );

      // Start dragging
      act(() => {
        result.current.handleDragStart('P', 150, 250);
      });

      // Update drag position
      const newX = 200;
      const newY = 300;

      act(() => {
        result.current.handleDragUpdate(newX, newY);
      });

      const actualPieceSize = pieceSize * 0.8;
      const expectedX = newX - bankLayout.x - actualPieceSize / 2;
      const expectedY = newY - bankLayout.y - actualPieceSize / 2;

      expect(result.current.translateX.value).toBe(expectedX);
      expect(result.current.translateY.value).toBe(expectedY);
    });

    it('should update position multiple times', () => {
      const { result } = renderHook(() =>
        useBankDrag({ pieceSize, bankLayout })
      );

      act(() => {
        result.current.handleDragStart('P', 150, 250);
      });

      const positions = [
        { x: 200, y: 300 },
        { x: 250, y: 350 },
        { x: 300, y: 400 },
      ];

      positions.forEach(({ x, y }) => {
        act(() => {
          result.current.handleDragUpdate(x, y);
        });

        const actualPieceSize = pieceSize * 0.8;
        const expectedX = x - bankLayout.x - actualPieceSize / 2;
        const expectedY = y - bankLayout.y - actualPieceSize / 2;

        expect(result.current.translateX.value).toBe(expectedX);
        expect(result.current.translateY.value).toBe(expectedY);
      });
    });
  });

  describe('handleDragEnd', () => {
    it('should call onPieceDropCoords with correct coordinates', () => {
      const { result } = renderHook(() =>
        useBankDrag({
          pieceSize,
          bankLayout,
          onPieceDropCoords: mockOnPieceDropCoords,
        })
      );

      act(() => {
        result.current.handleDragStart('P', 150, 250);
      });

      act(() => {
        result.current.handleDragEnd(300, 400);
      });

      expect(mockOnPieceDropCoords).toHaveBeenCalledWith('P', 300, 400);
    });

    it('should set opacity to 0', () => {
      const { result } = renderHook(() =>
        useBankDrag({ pieceSize, bankLayout })
      );

      act(() => {
        result.current.handleDragStart('P', 150, 250);
      });

      expect(result.current.opacity.value).toBe(1);

      act(() => {
        result.current.handleDragEnd(300, 400);
      });

      expect(result.current.opacity.value).toBe(0);
    });

    it('should reset dragging state', () => {
      const { result } = renderHook(() =>
        useBankDrag({ pieceSize, bankLayout })
      );

      act(() => {
        result.current.handleDragStart('P', 150, 250);
      });

      expect(result.current.dragging).not.toBe(null);

      act(() => {
        result.current.handleDragEnd(300, 400);
      });

      expect(result.current.dragging).toBe(null);
    });

    it('should work without onPieceDropCoords callback', () => {
      const { result } = renderHook(() =>
        useBankDrag({ pieceSize, bankLayout })
      );

      act(() => {
        result.current.handleDragStart('P', 150, 250);
      });

      expect(() => {
        act(() => {
          result.current.handleDragEnd(300, 400);
        });
      }).not.toThrow();
    });

    it('should not error when no piece is dragging', () => {
      const { result } = renderHook(() =>
        useBankDrag({
          pieceSize,
          bankLayout,
          onPieceDropCoords: mockOnPieceDropCoords,
        })
      );

      expect(() => {
        act(() => {
          result.current.handleDragEnd(300, 400);
        });
      }).not.toThrow();

      expect(mockOnPieceDropCoords).not.toHaveBeenCalled();
    });
  });

  describe('complete drag workflow', () => {
    it('should handle full drag lifecycle', () => {
      const { result } = renderHook(() =>
        useBankDrag({
          pieceSize,
          bankLayout,
          onPieceDropCoords: mockOnPieceDropCoords,
        })
      );

      // Start
      act(() => {
        result.current.handleDragStart('N', 150, 250);
      });

      expect(result.current.dragging?.piece).toBe('N');
      expect(result.current.opacity.value).toBe(1);

      // Update
      act(() => {
        result.current.handleDragUpdate(200, 300);
      });

      expect(result.current.translateX.value).not.toBe(0);

      // End
      act(() => {
        result.current.handleDragEnd(250, 350);
      });

      expect(result.current.dragging).toBe(null);
      expect(result.current.opacity.value).toBe(0);
      expect(mockOnPieceDropCoords).toHaveBeenCalledWith('N', 250, 350);
    });

    it('should handle multiple sequential drags', () => {
      const { result } = renderHook(() =>
        useBankDrag({
          pieceSize,
          bankLayout,
          onPieceDropCoords: mockOnPieceDropCoords,
        })
      );

      // First drag
      act(() => {
        result.current.handleDragStart('P', 150, 250);
      });

      act(() => {
        result.current.handleDragEnd(200, 300);
      });

      expect(mockOnPieceDropCoords).toHaveBeenCalledWith('P', 200, 300);

      // Second drag
      act(() => {
        result.current.handleDragStart('N', 160, 260);
      });

      act(() => {
        result.current.handleDragEnd(210, 310);
      });

      expect(mockOnPieceDropCoords).toHaveBeenCalledWith('N', 210, 310);
      expect(mockOnPieceDropCoords).toHaveBeenCalledTimes(2);
    });
  });

  describe('different bank layouts', () => {
    it('should adjust calculations based on bank position', () => {
      const layouts = [
        { x: 0, y: 0, width: 300, height: 50 },
        { x: 100, y: 200, width: 300, height: 50 },
        { x: 50, y: 600, width: 300, height: 50 },
      ];

      layouts.forEach((layout) => {
        mockOnPieceDropCoords.mockClear();

        const { result } = renderHook(() =>
          useBankDrag({ pieceSize, bankLayout: layout })
        );

        const startX = 150;
        const startY = 250;

        act(() => {
          result.current.handleDragStart('P', startX, startY);
        });

        const actualPieceSize = pieceSize * 0.8;
        const expectedX = startX - layout.x - actualPieceSize / 2;
        const expectedY = startY - layout.y - actualPieceSize / 2;

        expect(result.current.translateX.value).toBe(expectedX);
        expect(result.current.translateY.value).toBe(expectedY);
      });
    });
  });

  describe('different piece sizes', () => {
    it('should scale correctly with different piece sizes', () => {
      const sizes = [30, 40, 50, 60, 80];

      sizes.forEach((size) => {
        const { result } = renderHook(() =>
          useBankDrag({ pieceSize: size, bankLayout })
        );

        const startX = 150;
        const startY = 250;

        act(() => {
          result.current.handleDragStart('P', startX, startY);
        });

        const actualPieceSize = size * 0.8;
        const expectedX = startX - bankLayout.x - actualPieceSize / 2;
        const expectedY = startY - bankLayout.y - actualPieceSize / 2;

        expect(result.current.translateX.value).toBe(expectedX);
        expect(result.current.translateY.value).toBe(expectedY);
      });
    });
  });

  describe('edge cases', () => {
    it('should handle negative coordinates', () => {
      const { result } = renderHook(() =>
        useBankDrag({ pieceSize, bankLayout })
      );

      act(() => {
        result.current.handleDragStart('P', -50, -50);
      });

      expect(result.current.dragging).not.toBe(null);
    });

    it('should handle very large coordinates', () => {
      const { result } = renderHook(() =>
        useBankDrag({
          pieceSize,
          bankLayout,
          onPieceDropCoords: mockOnPieceDropCoords,
        })
      );

      act(() => {
        result.current.handleDragStart('P', 10000, 10000);
      });

      act(() => {
        result.current.handleDragEnd(20000, 20000);
      });

      expect(mockOnPieceDropCoords).toHaveBeenCalledWith('P', 20000, 20000);
    });

    it('should handle fractional coordinates', () => {
      const { result } = renderHook(() =>
        useBankDrag({ pieceSize, bankLayout })
      );

      act(() => {
        result.current.handleDragStart('P', 150.5, 250.75);
        result.current.handleDragUpdate(200.25, 300.5);
      });

      expect(result.current.dragging).not.toBe(null);
    });
  });
});
