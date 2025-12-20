import { renderHook, act } from '@testing-library/react-native';
import { useBoardLayout } from '../../hooks/useBoardLayout';
import { View } from 'react-native';

describe('useBoardLayout', () => {
  describe('initialization', () => {
    it('should initialize with zero layout values', () => {
      const { result } = renderHook(() => useBoardLayout());

      expect(result.current.boardLayout).toEqual({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      });
    });

    it('should provide a ref', () => {
      const { result } = renderHook(() => useBoardLayout());

      expect(result.current.boardRef).toBeDefined();
      expect(result.current.boardRef.current).toBe(null);
    });

    it('should provide handleBoardLayout function', () => {
      const { result } = renderHook(() => useBoardLayout());

      expect(typeof result.current.handleBoardLayout).toBe('function');
    });
  });

  describe('handleBoardLayout', () => {
    it('should call measure on ref when handleBoardLayout is called', () => {
      const { result } = renderHook(() => useBoardLayout());

      const mockMeasure = jest.fn((callback) => {
        callback(0, 0, 400, 400, 50, 100);
      });

      // Mock the ref
      Object.defineProperty(result.current.boardRef, 'current', {
        writable: true,
        value: { measure: mockMeasure },
      });

      act(() => {
        result.current.handleBoardLayout();
      });

      expect(mockMeasure).toHaveBeenCalled();
    });

    it('should update layout with measured values', () => {
      const { result } = renderHook(() => useBoardLayout());

      const mockMeasure = jest.fn((callback) => {
        callback(0, 0, 400, 400, 50, 100);
      });

      Object.defineProperty(result.current.boardRef, 'current', {
        writable: true,
        value: { measure: mockMeasure },
      });

      act(() => {
        result.current.handleBoardLayout();
      });

      expect(result.current.boardLayout).toEqual({
        x: 50,
        y: 100,
        width: 400,
        height: 400,
      });
    });

    it('should handle different layout values', () => {
      const { result } = renderHook(() => useBoardLayout());

      const mockMeasure = jest.fn((callback) => {
        callback(0, 0, 320, 320, 20, 80);
      });

      Object.defineProperty(result.current.boardRef, 'current', {
        writable: true,
        value: { measure: mockMeasure },
      });

      act(() => {
        result.current.handleBoardLayout();
      });

      expect(result.current.boardLayout).toEqual({
        x: 20,
        y: 80,
        width: 320,
        height: 320,
      });
    });

    it('should handle non-square boards', () => {
      const { result } = renderHook(() => useBoardLayout());

      const mockMeasure = jest.fn((callback) => {
        callback(0, 0, 400, 500, 10, 20);
      });

      Object.defineProperty(result.current.boardRef, 'current', {
        writable: true,
        value: { measure: mockMeasure },
      });

      act(() => {
        result.current.handleBoardLayout();
      });

      expect(result.current.boardLayout).toEqual({
        x: 10,
        y: 20,
        width: 400,
        height: 500,
      });
    });

    it('should handle zero position values', () => {
      const { result } = renderHook(() => useBoardLayout());

      const mockMeasure = jest.fn((callback) => {
        callback(0, 0, 320, 320, 0, 0);
      });

      Object.defineProperty(result.current.boardRef, 'current', {
        writable: true,
        value: { measure: mockMeasure },
      });

      act(() => {
        result.current.handleBoardLayout();
      });

      expect(result.current.boardLayout).toEqual({
        x: 0,
        y: 0,
        width: 320,
        height: 320,
      });
    });

    it('should not error when ref is null', () => {
      const { result } = renderHook(() => useBoardLayout());

      expect(() => {
        act(() => {
          result.current.handleBoardLayout();
        });
      }).not.toThrow();
    });

    it('should update layout multiple times', () => {
      const { result } = renderHook(() => useBoardLayout());

      const mockMeasure = jest.fn();

      Object.defineProperty(result.current.boardRef, 'current', {
        writable: true,
        value: { measure: mockMeasure },
      });

      // First measurement
      mockMeasure.mockImplementationOnce((callback) => {
        callback(0, 0, 320, 320, 10, 20);
      });

      act(() => {
        result.current.handleBoardLayout();
      });

      expect(result.current.boardLayout).toEqual({
        x: 10,
        y: 20,
        width: 320,
        height: 320,
      });

      // Second measurement (e.g., after device rotation)
      mockMeasure.mockImplementationOnce((callback) => {
        callback(0, 0, 400, 400, 50, 100);
      });

      act(() => {
        result.current.handleBoardLayout();
      });

      expect(result.current.boardLayout).toEqual({
        x: 50,
        y: 100,
        width: 400,
        height: 400,
      });

      expect(mockMeasure).toHaveBeenCalledTimes(2);
    });
  });

  describe('layout state persistence', () => {
    it('should maintain layout state across re-renders', () => {
      const { result } = renderHook(() => useBoardLayout());

      const mockMeasure = jest.fn((callback) => {
        callback(0, 0, 400, 400, 50, 100);
      });

      Object.defineProperty(result.current.boardRef, 'current', {
        writable: true,
        value: { measure: mockMeasure },
      });

      act(() => {
        result.current.handleBoardLayout();
      });

      const initialLayout = result.current.boardLayout;

      // Layout state should persist
      expect(result.current.boardLayout).toEqual(initialLayout);
      expect(result.current.boardLayout).toEqual({
        x: 50,
        y: 100,
        width: 400,
        height: 400,
      });
    });
  });

  describe('edge cases', () => {
    it('should handle large board sizes', () => {
      const { result } = renderHook(() => useBoardLayout());

      const mockMeasure = jest.fn((callback) => {
        callback(0, 0, 1000, 1000, 100, 200);
      });

      Object.defineProperty(result.current.boardRef, 'current', {
        writable: true,
        value: { measure: mockMeasure },
      });

      act(() => {
        result.current.handleBoardLayout();
      });

      expect(result.current.boardLayout).toEqual({
        x: 100,
        y: 200,
        width: 1000,
        height: 1000,
      });
    });

    it('should handle small board sizes', () => {
      const { result } = renderHook(() => useBoardLayout());

      const mockMeasure = jest.fn((callback) => {
        callback(0, 0, 100, 100, 5, 10);
      });

      Object.defineProperty(result.current.boardRef, 'current', {
        writable: true,
        value: { measure: mockMeasure },
      });

      act(() => {
        result.current.handleBoardLayout();
      });

      expect(result.current.boardLayout).toEqual({
        x: 5,
        y: 10,
        width: 100,
        height: 100,
      });
    });

    it('should handle fractional values', () => {
      const { result } = renderHook(() => useBoardLayout());

      const mockMeasure = jest.fn((callback) => {
        callback(0, 0, 320.5, 320.5, 10.25, 20.75);
      });

      Object.defineProperty(result.current.boardRef, 'current', {
        writable: true,
        value: { measure: mockMeasure },
      });

      act(() => {
        result.current.handleBoardLayout();
      });

      expect(result.current.boardLayout).toEqual({
        x: 10.25,
        y: 20.75,
        width: 320.5,
        height: 320.5,
      });
    });
  });

  describe('typical usage scenarios', () => {
    it('should handle initial layout measurement', () => {
      const { result } = renderHook(() => useBoardLayout());

      expect(result.current.boardLayout.width).toBe(0);

      const mockMeasure = jest.fn((callback) => {
        callback(0, 0, 400, 400, 50, 100);
      });

      Object.defineProperty(result.current.boardRef, 'current', {
        writable: true,
        value: { measure: mockMeasure },
      });

      act(() => {
        result.current.handleBoardLayout();
      });

      expect(result.current.boardLayout.width).toBeGreaterThan(0);
    });

    it('should handle layout remeasurement on orientation change', () => {
      const { result } = renderHook(() => useBoardLayout());

      const mockMeasure = jest.fn();

      Object.defineProperty(result.current.boardRef, 'current', {
        writable: true,
        value: { measure: mockMeasure },
      });

      // Portrait orientation
      mockMeasure.mockImplementationOnce((callback) => {
        callback(0, 0, 320, 480, 10, 50);
      });

      act(() => {
        result.current.handleBoardLayout();
      });

      expect(result.current.boardLayout.height).toBe(480);

      // Landscape orientation
      mockMeasure.mockImplementationOnce((callback) => {
        callback(0, 0, 480, 320, 50, 10);
      });

      act(() => {
        result.current.handleBoardLayout();
      });

      expect(result.current.boardLayout.height).toBe(320);
    });
  });
});
