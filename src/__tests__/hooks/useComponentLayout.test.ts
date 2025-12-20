import { renderHook, act } from '@testing-library/react-native';
import { useComponentLayout } from '../../hooks/useComponentLayout';

describe('useComponentLayout', () => {
  describe('initialization', () => {
    it('should initialize with zero layout values', () => {
      const { result } = renderHook(() => useComponentLayout());

      expect(result.current.layout).toEqual({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      });
    });

    it('should provide a ref', () => {
      const { result } = renderHook(() => useComponentLayout());

      expect(result.current.ref).toBeDefined();
      expect(result.current.ref.current).toBe(null);
    });

    it('should provide handleLayout function', () => {
      const { result } = renderHook(() => useComponentLayout());

      expect(typeof result.current.handleLayout).toBe('function');
    });
  });

  describe('handleLayout', () => {
    it('should call measure on ref when handleLayout is called', () => {
      const { result } = renderHook(() => useComponentLayout());

      const mockMeasure = jest.fn((callback) => {
        callback(0, 0, 200, 50, 100, 200);
      });

      Object.defineProperty(result.current.ref, 'current', {
        writable: true,
        value: { measure: mockMeasure },
      });

      act(() => {
        result.current.handleLayout();
      });

      expect(mockMeasure).toHaveBeenCalled();
    });

    it('should update layout with measured values', () => {
      const { result } = renderHook(() => useComponentLayout());

      const mockMeasure = jest.fn((callback) => {
        callback(0, 0, 200, 50, 100, 200);
      });

      Object.defineProperty(result.current.ref, 'current', {
        writable: true,
        value: { measure: mockMeasure },
      });

      act(() => {
        result.current.handleLayout();
      });

      expect(result.current.layout).toEqual({
        x: 100,
        y: 200,
        width: 200,
        height: 50,
      });
    });

    it('should handle horizontal component layout', () => {
      const { result } = renderHook(() => useComponentLayout());

      const mockMeasure = jest.fn((callback) => {
        callback(0, 0, 400, 40, 50, 100);
      });

      Object.defineProperty(result.current.ref, 'current', {
        writable: true,
        value: { measure: mockMeasure },
      });

      act(() => {
        result.current.handleLayout();
      });

      expect(result.current.layout).toEqual({
        x: 50,
        y: 100,
        width: 400,
        height: 40,
      });
    });

    it('should handle vertical component layout', () => {
      const { result } = renderHook(() => useComponentLayout());

      const mockMeasure = jest.fn((callback) => {
        callback(0, 0, 60, 300, 20, 50);
      });

      Object.defineProperty(result.current.ref, 'current', {
        writable: true,
        value: { measure: mockMeasure },
      });

      act(() => {
        result.current.handleLayout();
      });

      expect(result.current.layout).toEqual({
        x: 20,
        y: 50,
        width: 60,
        height: 300,
      });
    });

    it('should handle square component layout', () => {
      const { result } = renderHook(() => useComponentLayout());

      const mockMeasure = jest.fn((callback) => {
        callback(0, 0, 100, 100, 50, 50);
      });

      Object.defineProperty(result.current.ref, 'current', {
        writable: true,
        value: { measure: mockMeasure },
      });

      act(() => {
        result.current.handleLayout();
      });

      expect(result.current.layout).toEqual({
        x: 50,
        y: 50,
        width: 100,
        height: 100,
      });
    });

    it('should not error when ref is null', () => {
      const { result } = renderHook(() => useComponentLayout());

      expect(() => {
        act(() => {
          result.current.handleLayout();
        });
      }).not.toThrow();
    });

    it('should update layout multiple times', () => {
      const { result } = renderHook(() => useComponentLayout());

      const mockMeasure = jest.fn();

      Object.defineProperty(result.current.ref, 'current', {
        writable: true,
        value: { measure: mockMeasure },
      });

      // First measurement
      mockMeasure.mockImplementationOnce((callback) => {
        callback(0, 0, 200, 50, 10, 20);
      });

      act(() => {
        result.current.handleLayout();
      });

      expect(result.current.layout).toEqual({
        x: 10,
        y: 20,
        width: 200,
        height: 50,
      });

      // Second measurement
      mockMeasure.mockImplementationOnce((callback) => {
        callback(0, 0, 300, 60, 30, 40);
      });

      act(() => {
        result.current.handleLayout();
      });

      expect(result.current.layout).toEqual({
        x: 30,
        y: 40,
        width: 300,
        height: 60,
      });

      expect(mockMeasure).toHaveBeenCalledTimes(2);
    });
  });

  describe('layout state persistence', () => {
    it('should maintain layout state across re-renders', () => {
      const { result } = renderHook(() => useComponentLayout());

      const mockMeasure = jest.fn((callback) => {
        callback(0, 0, 200, 50, 100, 200);
      });

      Object.defineProperty(result.current.ref, 'current', {
        writable: true,
        value: { measure: mockMeasure },
      });

      act(() => {
        result.current.handleLayout();
      });

      const initialLayout = result.current.layout;

      // Layout state should persist
      expect(result.current.layout).toEqual(initialLayout);
      expect(result.current.layout).toEqual({
        x: 100,
        y: 200,
        width: 200,
        height: 50,
      });
    });
  });

  describe('edge cases', () => {
    it('should handle zero dimensions', () => {
      const { result } = renderHook(() => useComponentLayout());

      const mockMeasure = jest.fn((callback) => {
        callback(0, 0, 0, 0, 100, 200);
      });

      Object.defineProperty(result.current.ref, 'current', {
        writable: true,
        value: { measure: mockMeasure },
      });

      act(() => {
        result.current.handleLayout();
      });

      expect(result.current.layout).toEqual({
        x: 100,
        y: 200,
        width: 0,
        height: 0,
      });
    });

    it('should handle negative positions', () => {
      const { result } = renderHook(() => useComponentLayout());

      const mockMeasure = jest.fn((callback) => {
        callback(0, 0, 200, 50, -10, -20);
      });

      Object.defineProperty(result.current.ref, 'current', {
        writable: true,
        value: { measure: mockMeasure },
      });

      act(() => {
        result.current.handleLayout();
      });

      expect(result.current.layout).toEqual({
        x: -10,
        y: -20,
        width: 200,
        height: 50,
      });
    });

    it('should handle very large dimensions', () => {
      const { result } = renderHook(() => useComponentLayout());

      const mockMeasure = jest.fn((callback) => {
        callback(0, 0, 10000, 5000, 100, 200);
      });

      Object.defineProperty(result.current.ref, 'current', {
        writable: true,
        value: { measure: mockMeasure },
      });

      act(() => {
        result.current.handleLayout();
      });

      expect(result.current.layout).toEqual({
        x: 100,
        y: 200,
        width: 10000,
        height: 5000,
      });
    });

    it('should handle very small dimensions', () => {
      const { result } = renderHook(() => useComponentLayout());

      const mockMeasure = jest.fn((callback) => {
        callback(0, 0, 1, 1, 10, 20);
      });

      Object.defineProperty(result.current.ref, 'current', {
        writable: true,
        value: { measure: mockMeasure },
      });

      act(() => {
        result.current.handleLayout();
      });

      expect(result.current.layout).toEqual({
        x: 10,
        y: 20,
        width: 1,
        height: 1,
      });
    });

    it('should handle fractional values', () => {
      const { result } = renderHook(() => useComponentLayout());

      const mockMeasure = jest.fn((callback) => {
        callback(0, 0, 200.5, 50.25, 100.75, 200.125);
      });

      Object.defineProperty(result.current.ref, 'current', {
        writable: true,
        value: { measure: mockMeasure },
      });

      act(() => {
        result.current.handleLayout();
      });

      expect(result.current.layout).toEqual({
        x: 100.75,
        y: 200.125,
        width: 200.5,
        height: 50.25,
      });
    });
  });

  describe('typical usage scenarios', () => {
    it('should handle piece bank component layout', () => {
      const { result } = renderHook(() => useComponentLayout());

      const mockMeasure = jest.fn((callback) => {
        // Horizontal piece bank: 6 pieces * 50px each
        callback(0, 0, 300, 50, 40, 600);
      });

      Object.defineProperty(result.current.ref, 'current', {
        writable: true,
        value: { measure: mockMeasure },
      });

      act(() => {
        result.current.handleLayout();
      });

      expect(result.current.layout).toEqual({
        x: 40,
        y: 600,
        width: 300,
        height: 50,
      });
    });

    it('should handle button component layout', () => {
      const { result } = renderHook(() => useComponentLayout());

      const mockMeasure = jest.fn((callback) => {
        callback(0, 0, 100, 40, 150, 500);
      });

      Object.defineProperty(result.current.ref, 'current', {
        writable: true,
        value: { measure: mockMeasure },
      });

      act(() => {
        result.current.handleLayout();
      });

      expect(result.current.layout).toEqual({
        x: 150,
        y: 500,
        width: 100,
        height: 40,
      });
    });

    it('should handle input component layout', () => {
      const { result } = renderHook(() => useComponentLayout());

      const mockMeasure = jest.fn((callback) => {
        callback(0, 0, 200, 36, 50, 400);
      });

      Object.defineProperty(result.current.ref, 'current', {
        writable: true,
        value: { measure: mockMeasure },
      });

      act(() => {
        result.current.handleLayout();
      });

      expect(result.current.layout).toEqual({
        x: 50,
        y: 400,
        width: 200,
        height: 36,
      });
    });

    it('should handle layout after window resize', () => {
      const { result } = renderHook(() => useComponentLayout());

      const mockMeasure = jest.fn();

      Object.defineProperty(result.current.ref, 'current', {
        writable: true,
        value: { measure: mockMeasure },
      });

      // Initial layout
      mockMeasure.mockImplementationOnce((callback) => {
        callback(0, 0, 300, 50, 100, 200);
      });

      act(() => {
        result.current.handleLayout();
      });

      // After resize
      mockMeasure.mockImplementationOnce((callback) => {
        callback(0, 0, 400, 60, 120, 220);
      });

      act(() => {
        result.current.handleLayout();
      });

      expect(result.current.layout).toEqual({
        x: 120,
        y: 220,
        width: 400,
        height: 60,
      });
    });
  });

  describe('comparison with useBoardLayout', () => {
    it('should have same structure as useBoardLayout', () => {
      const { result } = renderHook(() => useComponentLayout());

      const layoutKeys = Object.keys(result.current.layout).sort();
      expect(layoutKeys).toEqual(['height', 'width', 'x', 'y']);
    });

    it('should work with different component sizes than board', () => {
      const { result } = renderHook(() => useComponentLayout());

      const mockMeasure = jest.fn((callback) => {
        // Much smaller than typical board (400x400)
        callback(0, 0, 60, 30, 10, 20);
      });

      Object.defineProperty(result.current.ref, 'current', {
        writable: true,
        value: { measure: mockMeasure },
      });

      act(() => {
        result.current.handleLayout();
      });

      expect(result.current.layout.width).toBeLessThan(100);
      expect(result.current.layout.height).toBeLessThan(100);
    });
  });
});
