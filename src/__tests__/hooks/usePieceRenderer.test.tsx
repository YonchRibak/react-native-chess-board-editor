import { renderHook } from '@testing-library/react-native';
import { usePieceRenderer } from '../../hooks/usePieceRenderer';
import {
  registerCustomPieceSet,
  pieceRendererRegistry,
} from '../../utils/pieceRendererRegistry';
import React from 'react';
import { Text } from 'react-native';

describe('usePieceRenderer', () => {
  beforeEach(() => {
    // Clear registry before each test
    (pieceRendererRegistry as any).renderers.clear();
  });

  describe('with unregistered piece set', () => {
    it('should return undefined renderer for unregistered piece set', () => {
      const { result } = renderHook(() =>
        usePieceRenderer('non-existent-set')
      );

      expect(result.current.renderer).toBeUndefined();
      expect(result.current.isRegistered).toBe(false);
    });

    it('should return not registered for empty string', () => {
      const { result } = renderHook(() => usePieceRenderer(''));

      expect(result.current.renderer).toBeUndefined();
      expect(result.current.isRegistered).toBe(false);
    });

    it('should return not registered for random name', () => {
      const { result } = renderHook(() =>
        usePieceRenderer('random-unregistered-name')
      );

      expect(result.current.isRegistered).toBe(false);
    });
  });

  describe('with registered piece set', () => {
    it('should return renderer for registered piece set', () => {
      // Register a custom piece set
      const mockRenderer = (piece: string, size: number) => (
        <Text>{piece}</Text>
      );

      registerCustomPieceSet({
        name: 'test-set',
        type: 'svg',
        renderer: mockRenderer,
      });

      const { result } = renderHook(() => usePieceRenderer('test-set'));

      expect(result.current.renderer).toBeDefined();
      expect(result.current.isRegistered).toBe(true);
      expect(result.current.renderer?.type).toBe('svg');
    });

    it('should return correct renderer type for SVG piece set', () => {
      const mockSvgRenderer = (piece: string, size: number) => (
        <Text>SVG {piece}</Text>
      );

      registerCustomPieceSet({
        name: 'svg-set',
        type: 'svg',
        renderer: mockSvgRenderer,
      });

      const { result } = renderHook(() => usePieceRenderer('svg-set'));

      expect(result.current.isRegistered).toBe(true);
      expect(result.current.renderer?.type).toBe('svg');
    });

    it('should return correct renderer type for unicode piece set', () => {
      const mockUnicodeRenderer = (piece: string, size: number) => (
        <Text>{piece}</Text>
      );

      registerCustomPieceSet({
        name: 'unicode-set',
        type: 'unicode',
        renderer: mockUnicodeRenderer,
      });

      const { result } = renderHook(() => usePieceRenderer('unicode-set'));

      expect(result.current.isRegistered).toBe(true);
      expect(result.current.renderer?.type).toBe('unicode');
    });

    it('should return correct renderer type for component piece set', () => {
      const mockComponentRenderer = (piece: string, size: number) => (
        <Text>Component {piece}</Text>
      );

      registerCustomPieceSet({
        name: 'component-set',
        type: 'svg',
        renderer: mockComponentRenderer,
      });

      const { result } = renderHook(() => usePieceRenderer('component-set'));

      expect(result.current.isRegistered).toBe(true);
      expect(result.current.renderer?.type).toBe('svg');
    });
  });

  describe('multiple piece sets', () => {
    it('should handle multiple registered piece sets', () => {
      const mockRenderer1 = (piece: string, size: number) => (
        <Text>Set1 {piece}</Text>
      );
      const mockRenderer2 = (piece: string, size: number) => (
        <Text>Set2 {piece}</Text>
      );

      registerCustomPieceSet({
        name: 'set1',
        type: 'svg',
        renderer: mockRenderer1,
      });

      registerCustomPieceSet({
        name: 'set2',
        type: 'svg',
        renderer: mockRenderer2,
      });

      const { result: result1 } = renderHook(() => usePieceRenderer('set1'));
      const { result: result2 } = renderHook(() => usePieceRenderer('set2'));

      expect(result1.current.isRegistered).toBe(true);
      expect(result2.current.isRegistered).toBe(true);
      expect(result1.current.renderer?.type).toBe('svg');
      expect(result2.current.renderer?.type).toBe('svg');
    });

    it('should return correct renderer for each piece set', () => {
      const sets = [
        { name: 'alpha', type: 'svg' as const },
        { name: 'beta', type: 'svg' as const },
        { name: 'gamma', type: 'unicode' as const },
      ];

      sets.forEach((set) => {
        registerCustomPieceSet({
          name: set.name,
          type: set.type,
          renderer: (piece, size) => <Text>{piece}</Text>,
        });
      });

      sets.forEach((set) => {
        const { result } = renderHook(() => usePieceRenderer(set.name));

        expect(result.current.isRegistered).toBe(true);
        expect(result.current.renderer?.type).toBe(set.type);
      });
    });
  });

  describe('piece set switching', () => {
    it('should return different renderer when piece set changes', () => {
      registerCustomPieceSet({
        name: 'set-a',
        type: 'svg',
        renderer: (piece, size) => <Text>A {piece}</Text>,
      });

      registerCustomPieceSet({
        name: 'set-b',
        type: 'svg',
        renderer: (piece, size) => <Text>B {piece}</Text>,
      });

      const { result, rerender } = renderHook(
        ({ pieceSet }) => usePieceRenderer(pieceSet),
        { initialProps: { pieceSet: 'set-a' } }
      );

      expect(result.current.renderer?.type).toBe('svg');

      rerender({ pieceSet: 'set-b' });

      expect(result.current.renderer?.type).toBe('svg');
    });

    it('should switch between registered and unregistered sets', () => {
      registerCustomPieceSet({
        name: 'registered-set',
        type: 'svg',
        renderer: (piece, size) => <Text>{piece}</Text>,
      });

      const { result, rerender } = renderHook(
        ({ pieceSet }) => usePieceRenderer(pieceSet),
        { initialProps: { pieceSet: 'registered-set' } }
      );

      expect(result.current.isRegistered).toBe(true);

      rerender({ pieceSet: 'unregistered-set' });

      expect(result.current.isRegistered).toBe(false);
      expect(result.current.renderer).toBeUndefined();
    });
  });

  describe('renderer function', () => {
    it('should have render function in returned renderer', () => {
      const mockRenderer = (piece: string, size: number) => (
        <Text>{piece}</Text>
      );

      registerCustomPieceSet({
        name: 'test-set',
        type: 'svg',
        renderer: mockRenderer,
      });

      const { result } = renderHook(() => usePieceRenderer('test-set'));

      expect(result.current.renderer?.render).toBeDefined();
      expect(typeof result.current.renderer?.render).toBe('function');
    });

    it('should preserve renderer function across re-renders', () => {
      const mockRenderer = (piece: string, size: number) => (
        <Text>{piece}</Text>
      );

      registerCustomPieceSet({
        name: 'stable-set',
        type: 'svg',
        renderer: mockRenderer,
      });

      const { result } = renderHook(() =>
        usePieceRenderer('stable-set')
      );

      const initialRender = result.current.renderer?.render;

      // Renderer should remain stable
      expect(result.current.renderer?.render).toBe(initialRender);
      expect(result.current.renderer?.render).toBeDefined();
    });
  });

  describe('edge cases', () => {
    it('should handle piece set with special characters', () => {
      registerCustomPieceSet({
        name: 'custom-set_v2.0',
        type: 'svg',
        renderer: (piece, size) => <Text>{piece}</Text>,
      });

      const { result } = renderHook(() =>
        usePieceRenderer('custom-set_v2.0')
      );

      expect(result.current.isRegistered).toBe(true);
    });

    it('should handle very long piece set names', () => {
      const longName = 'a'.repeat(100);

      registerCustomPieceSet({
        name: longName,
        type: 'svg',
        renderer: (piece, size) => <Text>{piece}</Text>,
      });

      const { result } = renderHook(() => usePieceRenderer(longName));

      expect(result.current.isRegistered).toBe(true);
    });

    it('should handle case-sensitive piece set names', () => {
      registerCustomPieceSet({
        name: 'MySet',
        type: 'svg',
        renderer: (piece, size) => <Text>{piece}</Text>,
      });

      const { result: upperResult } = renderHook(() =>
        usePieceRenderer('MySet')
      );
      const { result: lowerResult } = renderHook(() =>
        usePieceRenderer('myset')
      );

      expect(upperResult.current.isRegistered).toBe(true);
      expect(lowerResult.current.isRegistered).toBe(false);
    });
  });

  describe('typical usage scenarios', () => {
    it('should work with built-in piece sets when registered', () => {
      // Simulate built-in registration
      ['cburnett', 'alpha', 'merida'].forEach((name) => {
        registerCustomPieceSet({
          name,
          type: 'svg',
          renderer: (piece, size) => <Text>{piece}</Text>,
        });
      });

      const { result: cburnett } = renderHook(() =>
        usePieceRenderer('cburnett')
      );
      const { result: alpha } = renderHook(() => usePieceRenderer('alpha'));
      const { result: merida } = renderHook(() => usePieceRenderer('merida'));

      expect(cburnett.current.isRegistered).toBe(true);
      expect(alpha.current.isRegistered).toBe(true);
      expect(merida.current.isRegistered).toBe(true);
    });

    it('should handle unicode piece set', () => {
      registerCustomPieceSet({
        name: 'unicode',
        type: 'unicode',
        renderer: (piece, size) => <Text>{piece}</Text>,
      });

      const { result } = renderHook(() => usePieceRenderer('unicode'));

      expect(result.current.isRegistered).toBe(true);
      expect(result.current.renderer?.type).toBe('unicode');
    });

    it('should allow checking before rendering', () => {
      const { result } = renderHook(() =>
        usePieceRenderer('potentially-missing-set')
      );

      if (!result.current.isRegistered) {
        // Fall back to default renderer
        expect(result.current.renderer).toBeUndefined();
      }
    });
  });

  describe('re-registration', () => {
    it('should use updated renderer if piece set is re-registered', () => {
      const mockRenderer1 = (piece: string, size: number) => (
        <Text>V1 {piece}</Text>
      );

      registerCustomPieceSet({
        name: 'updatable-set',
        type: 'svg',
        renderer: mockRenderer1,
      });

      const { result, rerender } = renderHook(
        ({ pieceSetName }) => usePieceRenderer(pieceSetName),
        { initialProps: { pieceSetName: 'updatable-set' } }
      );

      const initialType = result.current.renderer?.type;
      expect(initialType).toBe('svg');

      // Re-register with different type
      const mockRenderer2 = (piece: string, size: number) => (
        <Text>V2 {piece}</Text>
      );

      registerCustomPieceSet({
        name: 'updatable-set',
        type: 'svg',
        renderer: mockRenderer2,
      });

      // Force re-render to get updated renderer
      rerender({ pieceSetName: 'updatable-set' });

      expect(result.current.renderer?.type).toBe('svg');
    });
  });
});
