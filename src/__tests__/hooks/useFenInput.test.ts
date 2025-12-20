import { renderHook, act } from '@testing-library/react-native';
import { useFenInput } from '../../hooks/useFenInput';
import { DEFAULT_FEN } from '../../utils/fen';

describe('useFenInput', () => {
  const mockOnFenChange = jest.fn();

  beforeEach(() => {
    mockOnFenChange.mockClear();
  });

  describe('initialization', () => {
    it('should initialize with provided FEN', () => {
      const { result } = renderHook(() => useFenInput(DEFAULT_FEN));

      expect(result.current.localFen).toBe(DEFAULT_FEN);
      expect(result.current.isEditing).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should initialize with custom FEN', () => {
      const customFen = '8/8/8/8/8/8/8/8 w - - 0 1';
      const { result } = renderHook(() => useFenInput(customFen));

      expect(result.current.localFen).toBe(customFen);
    });

    it('should provide all required functions', () => {
      const { result } = renderHook(() => useFenInput(DEFAULT_FEN));

      expect(typeof result.current.setLocalFen).toBe('function');
      expect(typeof result.current.setIsEditing).toBe('function');
      expect(typeof result.current.handleSubmit).toBe('function');
      expect(typeof result.current.handleCancel).toBe('function');
    });
  });

  describe('editing state', () => {
    it('should toggle editing state', () => {
      const { result } = renderHook(() => useFenInput(DEFAULT_FEN));

      expect(result.current.isEditing).toBe(false);

      act(() => {
        result.current.setIsEditing(true);
      });

      expect(result.current.isEditing).toBe(true);

      act(() => {
        result.current.setIsEditing(false);
      });

      expect(result.current.isEditing).toBe(false);
    });

    it('should update local FEN while editing', () => {
      const { result } = renderHook(() => useFenInput(DEFAULT_FEN));

      act(() => {
        result.current.setIsEditing(true);
      });

      const newFen = '8/8/8/8/8/8/8/8 w - - 0 1';

      act(() => {
        result.current.setLocalFen(newFen);
      });

      expect(result.current.localFen).toBe(newFen);
    });
  });

  describe('sync with prop changes', () => {
    it('should sync localFen when prop changes and not editing', () => {
      const { result, rerender } = renderHook(
        ({ fen }) => useFenInput(fen),
        { initialProps: { fen: DEFAULT_FEN } }
      );

      const newFen = '8/8/8/8/8/8/8/8 w - - 0 1';

      rerender({ fen: newFen });

      expect(result.current.localFen).toBe(newFen);
      expect(result.current.error).toBe(null);
    });

    it('should not sync when editing', () => {
      const { result, rerender } = renderHook(
        ({ fen }) => useFenInput(fen),
        { initialProps: { fen: DEFAULT_FEN } }
      );

      act(() => {
        result.current.setIsEditing(true);
      });

      const userInput = 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1';

      act(() => {
        result.current.setLocalFen(userInput);
      });

      // Prop changes should not affect local state while editing
      rerender({ fen: '8/8/8/8/8/8/8/8 w - - 0 1' });

      expect(result.current.localFen).toBe(userInput);
    });

    it('should clear error when prop changes and not editing', () => {
      const { result, rerender } = renderHook(
        ({ fen }) => useFenInput(fen),
        { initialProps: { fen: DEFAULT_FEN } }
      );

      // Create an error
      act(() => {
        result.current.setLocalFen('invalid');
      });

      act(() => {
        result.current.handleSubmit();
      });

      expect(result.current.error).not.toBe(null);

      // Change prop while not editing
      rerender({ fen: '8/8/8/8/8/8/8/8 w - - 0 1' });

      expect(result.current.error).toBe(null);
    });
  });

  describe('handleSubmit', () => {
    it('should submit valid FEN', () => {
      const { result } = renderHook(() =>
        useFenInput(DEFAULT_FEN, mockOnFenChange)
      );

      const newFen = '8/8/8/8/8/8/8/8 w - - 0 1';

      act(() => {
        result.current.setLocalFen(newFen);
      });

      act(() => {
        result.current.handleSubmit();
      });

      expect(mockOnFenChange).toHaveBeenCalledWith(newFen);
      expect(result.current.error).toBe(null);
      expect(result.current.isEditing).toBe(false);
    });

    it('should trim whitespace before submitting', () => {
      const { result } = renderHook(() =>
        useFenInput(DEFAULT_FEN, mockOnFenChange)
      );

      const fenWithSpaces = '  8/8/8/8/8/8/8/8 w - - 0 1  ';

      act(() => {
        result.current.setLocalFen(fenWithSpaces);
      });

      act(() => {
        result.current.handleSubmit();
      });

      expect(mockOnFenChange).toHaveBeenCalledWith('8/8/8/8/8/8/8/8 w - - 0 1');
    });

    it('should reject empty FEN', () => {
      const { result } = renderHook(() =>
        useFenInput(DEFAULT_FEN, mockOnFenChange)
      );

      act(() => {
        result.current.setLocalFen('');
      });

      act(() => {
        result.current.handleSubmit();
      });

      expect(result.current.error).toBe('FEN cannot be empty');
      expect(mockOnFenChange).not.toHaveBeenCalled();
      expect(result.current.isEditing).toBe(false);
    });

    it('should reject invalid FEN structure', () => {
      const { result } = renderHook(() =>
        useFenInput(DEFAULT_FEN, mockOnFenChange)
      );

      act(() => {
        result.current.setLocalFen('invalid fen string');
      });

      act(() => {
        result.current.handleSubmit();
      });

      expect(result.current.error).toBe('Invalid FEN structure');
      expect(mockOnFenChange).not.toHaveBeenCalled();
    });

    it('should reject FEN with wrong number of fields', () => {
      const { result } = renderHook(() =>
        useFenInput(DEFAULT_FEN, mockOnFenChange)
      );

      act(() => {
        result.current.setLocalFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq');
      });

      act(() => {
        result.current.handleSubmit();
      });

      expect(result.current.error).toBe('Invalid FEN structure');
      expect(mockOnFenChange).not.toHaveBeenCalled();
    });

    it('should work without onFenChange callback', () => {
      const { result } = renderHook(() => useFenInput(DEFAULT_FEN));

      const newFen = '8/8/8/8/8/8/8/8 w - - 0 1';

      expect(() => {
        act(() => {
          result.current.setLocalFen(newFen);
          result.current.handleSubmit();
        });
      }).not.toThrow();

      expect(result.current.error).toBe(null);
    });

    it('should accept complex valid FEN', () => {
      const { result } = renderHook(() =>
        useFenInput(DEFAULT_FEN, mockOnFenChange)
      );

      const complexFen = 'r1bqkb1r/pppp1ppp/2n2n2/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4';

      act(() => {
        result.current.setLocalFen(complexFen);
      });

      act(() => {
        result.current.handleSubmit();
      });

      expect(mockOnFenChange).toHaveBeenCalledWith(complexFen);
      expect(result.current.error).toBe(null);
    });
  });

  describe('handleCancel', () => {
    it('should reset to original FEN', () => {
      const { result } = renderHook(() => useFenInput(DEFAULT_FEN));

      act(() => {
        result.current.setIsEditing(true);
        result.current.setLocalFen('8/8/8/8/8/8/8/8 w - - 0 1');
      });

      act(() => {
        result.current.handleCancel();
      });

      expect(result.current.localFen).toBe(DEFAULT_FEN);
      expect(result.current.isEditing).toBe(false);
    });

    it('should clear error', () => {
      const { result } = renderHook(() => useFenInput(DEFAULT_FEN));

      act(() => {
        result.current.setLocalFen('invalid');
      });

      act(() => {
        result.current.handleSubmit();
      });

      expect(result.current.error).not.toBe(null);

      act(() => {
        result.current.handleCancel();
      });

      expect(result.current.error).toBe(null);
    });

    it('should exit editing mode', () => {
      const { result } = renderHook(() => useFenInput(DEFAULT_FEN));

      act(() => {
        result.current.setIsEditing(true);
      });

      expect(result.current.isEditing).toBe(true);

      act(() => {
        result.current.handleCancel();
      });

      expect(result.current.isEditing).toBe(false);
    });

    it('should not call onFenChange', () => {
      const { result } = renderHook(() =>
        useFenInput(DEFAULT_FEN, mockOnFenChange)
      );

      act(() => {
        result.current.setLocalFen('8/8/8/8/8/8/8/8 w - - 0 1');
        result.current.handleCancel();
      });

      expect(mockOnFenChange).not.toHaveBeenCalled();
    });
  });

  describe('workflow scenarios', () => {
    it('should handle complete edit workflow', () => {
      const { result } = renderHook(() =>
        useFenInput(DEFAULT_FEN, mockOnFenChange)
      );

      // Start editing
      act(() => {
        result.current.setIsEditing(true);
      });

      // Type new FEN
      const newFen = '8/8/8/8/8/8/8/8 w - - 0 1';
      act(() => {
        result.current.setLocalFen(newFen);
      });

      // Submit
      act(() => {
        result.current.handleSubmit();
      });

      expect(mockOnFenChange).toHaveBeenCalledWith(newFen);
      expect(result.current.isEditing).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should handle cancel workflow', () => {
      const { result } = renderHook(() =>
        useFenInput(DEFAULT_FEN, mockOnFenChange)
      );

      // Start editing
      act(() => {
        result.current.setIsEditing(true);
      });

      // Type new FEN
      act(() => {
        result.current.setLocalFen('8/8/8/8/8/8/8/8 w - - 0 1');
      });

      // Cancel
      act(() => {
        result.current.handleCancel();
      });

      expect(mockOnFenChange).not.toHaveBeenCalled();
      expect(result.current.localFen).toBe(DEFAULT_FEN);
      expect(result.current.isEditing).toBe(false);
    });

    it('should handle error correction workflow', () => {
      const { result } = renderHook(() =>
        useFenInput(DEFAULT_FEN, mockOnFenChange)
      );

      // Submit invalid FEN
      act(() => {
        result.current.setLocalFen('invalid');
      });

      act(() => {
        result.current.handleSubmit();
      });

      expect(result.current.error).toBe('Invalid FEN structure');

      // Correct the error
      act(() => {
        result.current.setIsEditing(true);
        result.current.setLocalFen('8/8/8/8/8/8/8/8 w - - 0 1');
      });

      act(() => {
        result.current.handleSubmit();
      });

      expect(result.current.error).toBe(null);
      expect(mockOnFenChange).toHaveBeenCalledTimes(1);
    });
  });
});
