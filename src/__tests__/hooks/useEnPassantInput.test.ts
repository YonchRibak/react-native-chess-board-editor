import { renderHook, act } from '@testing-library/react-native';
import { useEnPassantInput } from '../../hooks/useEnPassantInput';
import { EN_PASSANT_MESSAGES } from '../../constants/validationMessages';

describe('useEnPassantInput', () => {
  const mockOnEnPassantChange = jest.fn();

  beforeEach(() => {
    mockOnEnPassantChange.mockClear();
  });

  describe('initialization', () => {
    it('should initialize with empty string when en passant is "-"', () => {
      const { result } = renderHook(() =>
        useEnPassantInput('-', mockOnEnPassantChange)
      );

      expect(result.current.localValue).toBe('');
      expect(result.current.error).toBe(null);
    });

    it('should initialize with en passant square value', () => {
      const { result } = renderHook(() =>
        useEnPassantInput('e3', mockOnEnPassantChange)
      );

      expect(result.current.localValue).toBe('e3');
      expect(result.current.error).toBe(null);
    });

    it('should provide help text without FEN', () => {
      const { result } = renderHook(() =>
        useEnPassantInput('-', mockOnEnPassantChange)
      );

      expect(result.current.helpText).toBe(
        EN_PASSANT_MESSAGES.HELP_WITHOUT_FEN
      );
    });

    it('should provide different help text with FEN', () => {
      const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
      const { result } = renderHook(() =>
        useEnPassantInput('-', mockOnEnPassantChange, fen)
      );

      expect(result.current.helpText).toBe(EN_PASSANT_MESSAGES.HELP_WITH_FEN);
    });
  });

  describe('sync with prop changes', () => {
    it('should sync when en passant prop changes', () => {
      const { result, rerender } = renderHook(
        ({ square }) => useEnPassantInput(square, mockOnEnPassantChange),
        { initialProps: { square: '-' } }
      );

      expect(result.current.localValue).toBe('');

      rerender({ square: 'e3' });

      expect(result.current.localValue).toBe('e3');
    });

    it('should convert "-" to empty string on sync', () => {
      const { result, rerender } = renderHook(
        ({ square }) => useEnPassantInput(square, mockOnEnPassantChange),
        { initialProps: { square: 'e3' } }
      );

      expect(result.current.localValue).toBe('e3');

      rerender({ square: '-' });

      expect(result.current.localValue).toBe('');
    });

    it('should clear error on sync', () => {
      const { result, rerender } = renderHook(
        ({ square }) => useEnPassantInput(square, mockOnEnPassantChange),
        { initialProps: { square: '-' } }
      );

      // Create an error
      act(() => {
        result.current.handleChange('x9');
      });

      expect(result.current.error).not.toBe(null);

      // Sync should clear error
      rerender({ square: 'e6' });

      expect(result.current.error).toBe(null);
    });
  });

  describe('handleChange', () => {
    it('should update local value', () => {
      const { result } = renderHook(() =>
        useEnPassantInput('-', mockOnEnPassantChange)
      );

      act(() => {
        result.current.handleChange('e');
      });

      expect(result.current.localValue).toBe('e');
    });

    it('should trim and lowercase input', () => {
      const { result } = renderHook(() =>
        useEnPassantInput('-', mockOnEnPassantChange)
      );

      act(() => {
        result.current.handleChange('  E3  ');
      });

      expect(result.current.localValue).toBe('e3');
    });

    it('should auto-apply when empty', () => {
      const { result } = renderHook(() =>
        useEnPassantInput('e3', mockOnEnPassantChange)
      );

      act(() => {
        result.current.handleChange('');
      });

      expect(mockOnEnPassantChange).toHaveBeenCalledWith('-');
      expect(result.current.localValue).toBe('');
    });

    it('should clear error while typing', () => {
      const { result } = renderHook(() =>
        useEnPassantInput('-', mockOnEnPassantChange)
      );

      // Create an error
      act(() => {
        result.current.handleChange('x9');
      });

      expect(result.current.error).not.toBe(null);

      // Typing should clear error
      act(() => {
        result.current.handleChange('e');
      });

      expect(result.current.error).toBe(null);
    });

    it('should validate and apply valid rank 3 square', () => {
      const { result } = renderHook(() =>
        useEnPassantInput('-', mockOnEnPassantChange)
      );

      act(() => {
        result.current.handleChange('e3');
      });

      expect(mockOnEnPassantChange).toHaveBeenCalledWith('e3');
      expect(result.current.error).toBe(null);
    });

    it('should validate and apply valid rank 6 square', () => {
      const { result } = renderHook(() =>
        useEnPassantInput('-', mockOnEnPassantChange)
      );

      act(() => {
        result.current.handleChange('d6');
      });

      expect(mockOnEnPassantChange).toHaveBeenCalledWith('d6');
      expect(result.current.error).toBe(null);
    });

    it('should reject invalid rank', () => {
      const { result } = renderHook(() =>
        useEnPassantInput('-', mockOnEnPassantChange)
      );

      act(() => {
        result.current.handleChange('e4');
      });

      expect(result.current.error).toBe(
        'Must be rank 3 (e.g., e3) or rank 6 (e.g., d6)'
      );
      expect(mockOnEnPassantChange).not.toHaveBeenCalled();
    });

    it('should reject invalid file', () => {
      const { result } = renderHook(() =>
        useEnPassantInput('-', mockOnEnPassantChange)
      );

      act(() => {
        result.current.handleChange('i3');
      });

      expect(result.current.error).toBe(
        'Must be rank 3 (e.g., e3) or rank 6 (e.g., d6)'
      );
    });

    it('should not validate incomplete input', () => {
      const { result } = renderHook(() =>
        useEnPassantInput('-', mockOnEnPassantChange)
      );

      act(() => {
        result.current.handleChange('e');
      });

      expect(result.current.error).toBe(null);
      expect(mockOnEnPassantChange).not.toHaveBeenCalled();
    });

    it('should test all valid rank 3 squares', () => {
      const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

      files.forEach((file) => {
        mockOnEnPassantChange.mockClear();
        const { result } = renderHook(() =>
          useEnPassantInput('-', mockOnEnPassantChange)
        );

        act(() => {
          result.current.handleChange(`${file}3`);
        });

        expect(mockOnEnPassantChange).toHaveBeenCalledWith(`${file}3`);
        expect(result.current.error).toBe(null);
      });
    });

    it('should test all valid rank 6 squares', () => {
      const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

      files.forEach((file) => {
        mockOnEnPassantChange.mockClear();
        const { result } = renderHook(() =>
          useEnPassantInput('-', mockOnEnPassantChange)
        );

        act(() => {
          result.current.handleChange(`${file}6`);
        });

        expect(mockOnEnPassantChange).toHaveBeenCalledWith(`${file}6`);
        expect(result.current.error).toBe(null);
      });
    });
  });

  describe('handleChange with FEN validation', () => {
    it('should accept valid en passant with correct pawn positions', () => {
      // Position with white pawn on e4, allowing e3 en passant
      const fen = 'rnbqkbnr/pppp1ppp/8/8/3Pp3/8/PPP1PPPP/RNBQKBNR w KQkq - 0 1';
      const { result } = renderHook(() =>
        useEnPassantInput('-', mockOnEnPassantChange, fen)
      );

      act(() => {
        result.current.handleChange('e3');
      });

      expect(mockOnEnPassantChange).toHaveBeenCalledWith('e3');
      expect(result.current.error).toBe(null);
    });

    it('should reject en passant without proper pawn positions', () => {
      // Empty board - no pawns
      const fen = '8/8/8/8/8/8/8/8 w - - 0 1';
      const { result } = renderHook(() =>
        useEnPassantInput('-', mockOnEnPassantChange, fen)
      );

      act(() => {
        result.current.handleChange('e3');
      });

      expect(result.current.error).toBe(
        'Invalid: no pawns in correct position for en passant'
      );
      expect(mockOnEnPassantChange).not.toHaveBeenCalled();
    });

    it('should validate with FEN for rank 6', () => {
      // Position with black pawn on e5, allowing e6 en passant
      const fen = 'rnbqkbnr/pppp1ppp/8/3pP3/8/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1';
      const { result } = renderHook(() =>
        useEnPassantInput('-', mockOnEnPassantChange, fen)
      );

      act(() => {
        result.current.handleChange('e6');
      });

      expect(mockOnEnPassantChange).toHaveBeenCalledWith('e6');
      expect(result.current.error).toBe(null);
    });
  });

  describe('handleClear', () => {
    it('should clear value', () => {
      const { result } = renderHook(() =>
        useEnPassantInput('e3', mockOnEnPassantChange)
      );

      act(() => {
        result.current.handleClear();
      });

      expect(result.current.localValue).toBe('');
    });

    it('should clear error', () => {
      const { result } = renderHook(() =>
        useEnPassantInput('-', mockOnEnPassantChange)
      );

      // Create an error
      act(() => {
        result.current.handleChange('x9');
      });

      expect(result.current.error).not.toBe(null);

      // Clear should remove error
      act(() => {
        result.current.handleClear();
      });

      expect(result.current.error).toBe(null);
    });

    it('should call onEnPassantChange with "-"', () => {
      const { result } = renderHook(() =>
        useEnPassantInput('e3', mockOnEnPassantChange)
      );

      act(() => {
        result.current.handleClear();
      });

      expect(mockOnEnPassantChange).toHaveBeenCalledWith('-');
    });
  });

  describe('workflow scenarios', () => {
    it('should handle complete input workflow', () => {
      const { result } = renderHook(() =>
        useEnPassantInput('-', mockOnEnPassantChange)
      );

      // Type 'e'
      act(() => {
        result.current.handleChange('e');
      });

      expect(result.current.localValue).toBe('e');
      expect(mockOnEnPassantChange).not.toHaveBeenCalled();

      // Complete typing to 'e3'
      act(() => {
        result.current.handleChange('e3');
      });

      expect(mockOnEnPassantChange).toHaveBeenCalledWith('e3');
      expect(result.current.error).toBe(null);
    });

    it('should handle error correction workflow', () => {
      const { result } = renderHook(() =>
        useEnPassantInput('-', mockOnEnPassantChange)
      );

      // Enter invalid value
      act(() => {
        result.current.handleChange('x9');
      });

      expect(result.current.error).not.toBe(null);

      // Correct the error
      act(() => {
        result.current.handleChange('e3');
      });

      expect(result.current.error).toBe(null);
      expect(mockOnEnPassantChange).toHaveBeenCalledWith('e3');
    });

    it('should handle clear after setting value', () => {
      const { result } = renderHook(() =>
        useEnPassantInput('-', mockOnEnPassantChange)
      );

      // Set value
      act(() => {
        result.current.handleChange('e3');
      });

      expect(result.current.localValue).toBe('e3');

      // Clear
      act(() => {
        result.current.handleClear();
      });

      expect(result.current.localValue).toBe('');
      expect(mockOnEnPassantChange).toHaveBeenLastCalledWith('-');
    });
  });

  describe('edge cases', () => {
    it('should handle uppercase input', () => {
      const { result } = renderHook(() =>
        useEnPassantInput('-', mockOnEnPassantChange)
      );

      act(() => {
        result.current.handleChange('E3');
      });

      expect(result.current.localValue).toBe('e3');
      expect(mockOnEnPassantChange).toHaveBeenCalledWith('e3');
    });

    it('should handle mixed case input', () => {
      const { result } = renderHook(() =>
        useEnPassantInput('-', mockOnEnPassantChange)
      );

      act(() => {
        result.current.handleChange('D6');
      });

      expect(result.current.localValue).toBe('d6');
    });

    it('should handle input with extra spaces', () => {
      const { result } = renderHook(() =>
        useEnPassantInput('-', mockOnEnPassantChange)
      );

      act(() => {
        result.current.handleChange('  e3  ');
      });

      expect(result.current.localValue).toBe('e3');
      expect(mockOnEnPassantChange).toHaveBeenCalledWith('e3');
    });

    it('should not call onChange for single character', () => {
      const { result } = renderHook(() =>
        useEnPassantInput('-', mockOnEnPassantChange)
      );

      mockOnEnPassantChange.mockClear();

      act(() => {
        result.current.handleChange('e');
      });

      expect(mockOnEnPassantChange).not.toHaveBeenCalled();
    });

    it('should not call onChange for more than 2 characters', () => {
      const { result } = renderHook(() =>
        useEnPassantInput('-', mockOnEnPassantChange)
      );

      mockOnEnPassantChange.mockClear();

      act(() => {
        result.current.handleChange('e33');
      });

      expect(mockOnEnPassantChange).not.toHaveBeenCalled();
    });
  });
});
