import { renderHook, act } from '@testing-library/react-native';
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard';
import { Clipboard } from 'react-native';

// Mock Clipboard
jest.mock('react-native/Libraries/Components/Clipboard/Clipboard', () => ({
  setString: jest.fn(),
}));

describe('useCopyToClipboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  describe('initialization', () => {
    it('should initialize with copied=false', () => {
      const { result } = renderHook(() => useCopyToClipboard());

      expect(result.current.copied).toBe(false);
    });

    it('should provide copyToClipboard function', () => {
      const { result } = renderHook(() => useCopyToClipboard());

      expect(typeof result.current.copyToClipboard).toBe('function');
    });
  });

  describe('copyToClipboard', () => {
    it('should copy text to clipboard', () => {
      const { result } = renderHook(() => useCopyToClipboard());

      act(() => {
        result.current.copyToClipboard('test text');
      });

      expect(Clipboard.setString).toHaveBeenCalledWith('test text');
    });

    it('should set copied to true immediately', () => {
      const { result } = renderHook(() => useCopyToClipboard());

      act(() => {
        result.current.copyToClipboard('test');
      });

      expect(result.current.copied).toBe(true);
    });

    it('should reset copied to false after default timeout (2000ms)', () => {
      const { result } = renderHook(() => useCopyToClipboard());

      act(() => {
        result.current.copyToClipboard('test');
      });

      expect(result.current.copied).toBe(true);

      act(() => {
        jest.advanceTimersByTime(2000);
      });

      expect(result.current.copied).toBe(false);
    });

    it('should copy FEN string', () => {
      const { result } = renderHook(() => useCopyToClipboard());
      const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

      act(() => {
        result.current.copyToClipboard(fen);
      });

      expect(Clipboard.setString).toHaveBeenCalledWith(fen);
      expect(result.current.copied).toBe(true);
    });

    it('should copy empty string', () => {
      const { result } = renderHook(() => useCopyToClipboard());

      act(() => {
        result.current.copyToClipboard('');
      });

      expect(Clipboard.setString).toHaveBeenCalledWith('');
      expect(result.current.copied).toBe(true);
    });
  });

  describe('custom timeout', () => {
    it('should use custom timeout value', () => {
      const { result } = renderHook(() => useCopyToClipboard(5000));

      act(() => {
        result.current.copyToClipboard('test');
      });

      expect(result.current.copied).toBe(true);

      // After 2000ms (default), should still be true
      act(() => {
        jest.advanceTimersByTime(2000);
      });

      expect(result.current.copied).toBe(true);

      // After 5000ms (custom timeout), should be false
      act(() => {
        jest.advanceTimersByTime(3000);
      });

      expect(result.current.copied).toBe(false);
    });

    it('should handle very short timeout', () => {
      const { result } = renderHook(() => useCopyToClipboard(100));

      act(() => {
        result.current.copyToClipboard('test');
      });

      expect(result.current.copied).toBe(true);

      act(() => {
        jest.advanceTimersByTime(100);
      });

      expect(result.current.copied).toBe(false);
    });

    it('should handle very long timeout', () => {
      const { result } = renderHook(() => useCopyToClipboard(10000));

      act(() => {
        result.current.copyToClipboard('test');
      });

      expect(result.current.copied).toBe(true);

      act(() => {
        jest.advanceTimersByTime(9999);
      });

      expect(result.current.copied).toBe(true);

      act(() => {
        jest.advanceTimersByTime(1);
      });

      expect(result.current.copied).toBe(false);
    });
  });

  describe('multiple copies', () => {
    it('should handle multiple copy operations', () => {
      const { result } = renderHook(() => useCopyToClipboard(1000));

      act(() => {
        result.current.copyToClipboard('first');
      });

      expect(Clipboard.setString).toHaveBeenCalledWith('first');
      expect(result.current.copied).toBe(true);

      act(() => {
        jest.advanceTimersByTime(500);
      });

      act(() => {
        result.current.copyToClipboard('second');
      });

      expect(Clipboard.setString).toHaveBeenCalledWith('second');
      expect(result.current.copied).toBe(true);

      // First timeout should have been superseded
      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(result.current.copied).toBe(true);

      // Second timeout completes
      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(result.current.copied).toBe(false);
    });

    it('should copy different values sequentially', () => {
      const { result } = renderHook(() => useCopyToClipboard(500));

      const values = ['value1', 'value2', 'value3'];

      values.forEach((value) => {
        act(() => {
          result.current.copyToClipboard(value);
        });

        expect(Clipboard.setString).toHaveBeenCalledWith(value);
        expect(result.current.copied).toBe(true);

        act(() => {
          jest.advanceTimersByTime(500);
        });

        expect(result.current.copied).toBe(false);
      });

      expect(Clipboard.setString).toHaveBeenCalledTimes(3);
    });
  });

  describe('edge cases', () => {
    it('should handle copy before previous timeout completes', () => {
      const { result } = renderHook(() => useCopyToClipboard(2000));

      act(() => {
        result.current.copyToClipboard('first');
      });

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(result.current.copied).toBe(true);

      act(() => {
        result.current.copyToClipboard('second');
      });

      // Should still be true (new copy operation)
      expect(result.current.copied).toBe(true);

      // Advance past first timeout
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      // Should still be true (second timeout not complete)
      expect(result.current.copied).toBe(true);

      // Complete second timeout
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(result.current.copied).toBe(false);
    });

    it('should handle special characters', () => {
      const { result } = renderHook(() => useCopyToClipboard());
      const specialText = '!@#$%^&*()_+{}|:"<>?[];,./`~';

      act(() => {
        result.current.copyToClipboard(specialText);
      });

      expect(Clipboard.setString).toHaveBeenCalledWith(specialText);
    });

    it('should handle multiline text', () => {
      const { result } = renderHook(() => useCopyToClipboard());
      const multiline = 'line1\nline2\nline3';

      act(() => {
        result.current.copyToClipboard(multiline);
      });

      expect(Clipboard.setString).toHaveBeenCalledWith(multiline);
    });
  });
});
