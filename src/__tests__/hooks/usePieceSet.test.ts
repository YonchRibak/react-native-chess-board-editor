import { renderHook, act } from '@testing-library/react-native';
import { usePieceSet } from '../../hooks/usePieceSet';

describe('usePieceSet', () => {
  const mockOnPieceSetChange = jest.fn();

  beforeEach(() => {
    mockOnPieceSetChange.mockClear();
  });

  describe('initialization', () => {
    it('should initialize with default piece set', () => {
      const { result } = renderHook(() => usePieceSet());

      // Default is 'cburnett' from constants
      expect(result.current.pieceSet).toBe('cburnett');
    });

    it('should initialize with custom piece set', () => {
      const { result } = renderHook(() => usePieceSet('alpha'));

      expect(result.current.pieceSet).toBe('alpha');
    });

    it('should initialize with unicode piece set', () => {
      const { result } = renderHook(() => usePieceSet('unicode'));

      expect(result.current.pieceSet).toBe('unicode');
    });

    it('should initialize with merida piece set', () => {
      const { result } = renderHook(() => usePieceSet('merida'));

      expect(result.current.pieceSet).toBe('merida');
    });

    it('should initialize with custom registered piece set', () => {
      const { result } = renderHook(() => usePieceSet('my-custom-set'));

      expect(result.current.pieceSet).toBe('my-custom-set');
    });

    it('should provide handlePieceSetChange function', () => {
      const { result } = renderHook(() => usePieceSet());

      expect(typeof result.current.handlePieceSetChange).toBe('function');
    });
  });

  describe('handlePieceSetChange', () => {
    it('should update piece set', () => {
      const { result } = renderHook(() =>
        usePieceSet('cburnett', mockOnPieceSetChange)
      );

      act(() => {
        result.current.handlePieceSetChange('alpha');
      });

      expect(result.current.pieceSet).toBe('alpha');
      expect(mockOnPieceSetChange).toHaveBeenCalledWith('alpha');
    });

    it('should update to unicode', () => {
      const { result } = renderHook(() =>
        usePieceSet('cburnett', mockOnPieceSetChange)
      );

      act(() => {
        result.current.handlePieceSetChange('unicode');
      });

      expect(result.current.pieceSet).toBe('unicode');
      expect(mockOnPieceSetChange).toHaveBeenCalledWith('unicode');
    });

    it('should update to merida', () => {
      const { result } = renderHook(() =>
        usePieceSet('cburnett', mockOnPieceSetChange)
      );

      act(() => {
        result.current.handlePieceSetChange('merida');
      });

      expect(result.current.pieceSet).toBe('merida');
    });

    it('should update to custom piece set', () => {
      const { result } = renderHook(() =>
        usePieceSet('cburnett', mockOnPieceSetChange)
      );

      act(() => {
        result.current.handlePieceSetChange('my-custom-set');
      });

      expect(result.current.pieceSet).toBe('my-custom-set');
      expect(mockOnPieceSetChange).toHaveBeenCalledWith('my-custom-set');
    });

    it('should work without onPieceSetChange callback', () => {
      const { result } = renderHook(() => usePieceSet('cburnett'));

      expect(() => {
        act(() => {
          result.current.handlePieceSetChange('alpha');
        });
      }).not.toThrow();

      expect(result.current.pieceSet).toBe('alpha');
    });

    it('should call callback only when piece set changes', () => {
      const { result } = renderHook(() =>
        usePieceSet('cburnett', mockOnPieceSetChange)
      );

      act(() => {
        result.current.handlePieceSetChange('alpha');
      });

      expect(mockOnPieceSetChange).toHaveBeenCalledTimes(1);

      act(() => {
        result.current.handlePieceSetChange('merida');
      });

      expect(mockOnPieceSetChange).toHaveBeenCalledTimes(2);
    });

    it('should allow setting same piece set again', () => {
      const { result } = renderHook(() =>
        usePieceSet('cburnett', mockOnPieceSetChange)
      );

      act(() => {
        result.current.handlePieceSetChange('cburnett');
      });

      expect(mockOnPieceSetChange).toHaveBeenCalledWith('cburnett');
      expect(result.current.pieceSet).toBe('cburnett');
    });
  });

  describe('piece set persistence', () => {
    it('should maintain piece set across re-renders', () => {
      const { result } = renderHook(() => usePieceSet('alpha'));

      act(() => {
        result.current.handlePieceSetChange('merida');
      });

      // Piece set should persist after state change
      expect(result.current.pieceSet).toBe('merida');
    });

    it('should not change when prop changes', () => {
      const { result, rerender } = renderHook(
        ({ initialSet }) => usePieceSet(initialSet),
        { initialProps: { initialSet: 'cburnett' } }
      );

      act(() => {
        result.current.handlePieceSetChange('alpha');
      });

      // Changing the prop should not affect internal state
      rerender({ initialSet: 'merida' });

      expect(result.current.pieceSet).toBe('alpha');
    });
  });

  describe('multiple piece set changes', () => {
    it('should handle sequence of changes', () => {
      const { result } = renderHook(() =>
        usePieceSet('cburnett', mockOnPieceSetChange)
      );

      const sets = ['alpha', 'merida', 'unicode', 'cburnett'];

      sets.forEach((set, index) => {
        act(() => {
          result.current.handlePieceSetChange(set);
        });

        expect(result.current.pieceSet).toBe(set);
        expect(mockOnPieceSetChange).toHaveBeenCalledTimes(index + 1);
      });
    });

    it('should handle rapid changes', () => {
      const { result } = renderHook(() =>
        usePieceSet('cburnett', mockOnPieceSetChange)
      );

      act(() => {
        result.current.handlePieceSetChange('alpha');
        result.current.handlePieceSetChange('merida');
        result.current.handlePieceSetChange('unicode');
      });

      expect(result.current.pieceSet).toBe('unicode');
      expect(mockOnPieceSetChange).toHaveBeenCalledTimes(3);
    });
  });

  describe('edge cases', () => {
    it('should handle empty string as piece set', () => {
      const { result } = renderHook(() => usePieceSet(''));

      expect(result.current.pieceSet).toBe('');

      act(() => {
        result.current.handlePieceSetChange('cburnett');
      });

      expect(result.current.pieceSet).toBe('cburnett');
    });

    it('should handle very long piece set names', () => {
      const longName = 'a'.repeat(1000);
      const { result } = renderHook(() =>
        usePieceSet('cburnett', mockOnPieceSetChange)
      );

      act(() => {
        result.current.handlePieceSetChange(longName);
      });

      expect(result.current.pieceSet).toBe(longName);
      expect(mockOnPieceSetChange).toHaveBeenCalledWith(longName);
    });

    it('should handle special characters in piece set name', () => {
      const specialName = 'custom-set_v2.0';
      const { result } = renderHook(() =>
        usePieceSet('cburnett', mockOnPieceSetChange)
      );

      act(() => {
        result.current.handlePieceSetChange(specialName);
      });

      expect(result.current.pieceSet).toBe(specialName);
    });
  });

  describe('typical usage scenarios', () => {
    it('should handle user selecting from dropdown', () => {
      const { result } = renderHook(() =>
        usePieceSet('cburnett', mockOnPieceSetChange)
      );

      // User selects alpha from dropdown
      act(() => {
        result.current.handlePieceSetChange('alpha');
      });

      expect(result.current.pieceSet).toBe('alpha');
      expect(mockOnPieceSetChange).toHaveBeenCalledWith('alpha');
    });

    it('should handle switching between SVG and unicode', () => {
      const { result } = renderHook(() =>
        usePieceSet('cburnett', mockOnPieceSetChange)
      );

      // Switch to unicode
      act(() => {
        result.current.handlePieceSetChange('unicode');
      });

      expect(result.current.pieceSet).toBe('unicode');

      // Switch back to SVG
      act(() => {
        result.current.handlePieceSetChange('cburnett');
      });

      expect(result.current.pieceSet).toBe('cburnett');
      expect(mockOnPieceSetChange).toHaveBeenCalledTimes(2);
    });

    it('should handle theme change in app', () => {
      const { result } = renderHook(() =>
        usePieceSet('cburnett', mockOnPieceSetChange)
      );

      // Dark theme uses alpha
      act(() => {
        result.current.handlePieceSetChange('alpha');
      });

      expect(result.current.pieceSet).toBe('alpha');

      // Light theme uses merida
      act(() => {
        result.current.handlePieceSetChange('merida');
      });

      expect(result.current.pieceSet).toBe('merida');
    });
  });

  describe('integration with callback', () => {
    it('should pass current piece set to callback', () => {
      const { result } = renderHook(() =>
        usePieceSet('cburnett', mockOnPieceSetChange)
      );

      act(() => {
        result.current.handlePieceSetChange('alpha');
      });

      expect(mockOnPieceSetChange).toHaveBeenCalledWith('alpha');
      expect(mockOnPieceSetChange.mock.calls[0][0]).toBe('alpha');
    });

    it('should allow callback to receive piece set for persistence', () => {
      const mockStorage = { setItem: jest.fn() };
      const persistCallback = jest.fn((pieceSet) => {
        // Simulates saving to AsyncStorage or similar
        mockStorage.setItem('pieceSet', pieceSet);
      });

      const { result } = renderHook(() =>
        usePieceSet('cburnett', persistCallback)
      );

      act(() => {
        result.current.handlePieceSetChange('alpha');
      });

      expect(persistCallback).toHaveBeenCalledWith('alpha');
      expect(mockStorage.setItem).toHaveBeenCalledWith('pieceSet', 'alpha');
    });
  });
});
