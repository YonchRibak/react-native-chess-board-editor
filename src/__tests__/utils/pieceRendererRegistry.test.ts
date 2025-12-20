import React from 'react';
import { Text } from 'react-native';
import {
  registerCustomPieceSet,
  getPieceRenderer,
  hasPieceRenderer,
  getAvailablePieceSets,
  pieceRendererRegistry,
} from '../../utils/pieceRendererRegistry';
import type { PieceSetConfig } from '../../types/pieceRenderer';
import type { PieceSymbol } from '../../types';

describe('pieceRendererRegistry', () => {
  // Helper function to create a mock renderer
  const createMockRenderer = (name: string) => {
    return (piece: PieceSymbol, size: number) => {
      return React.createElement(Text, { testID: `${name}-${piece}` }, piece);
    };
  };

  // Clear registry before each test to ensure clean state
  beforeEach(() => {
    // Clear all registered piece sets by getting the list and clearing the internal map
    const registry = pieceRendererRegistry as any;
    registry.renderers.clear();
  });

  describe('registerCustomPieceSet', () => {
    it('should register a custom piece set', () => {
      const config: PieceSetConfig = {
        name: 'custom1',
        type: 'svg',
        renderer: createMockRenderer('custom1'),
      };

      registerCustomPieceSet(config);

      expect(hasPieceRenderer('custom1')).toBe(true);
    });

    it('should register multiple custom piece sets', () => {
      const config1: PieceSetConfig = {
        name: 'custom1',
        type: 'svg',
        renderer: createMockRenderer('custom1'),
      };

      const config2: PieceSetConfig = {
        name: 'custom2',
        type: 'unicode',
        renderer: createMockRenderer('custom2'),
      };

      registerCustomPieceSet(config1);
      registerCustomPieceSet(config2);

      expect(hasPieceRenderer('custom1')).toBe(true);
      expect(hasPieceRenderer('custom2')).toBe(true);
    });

    it('should allow overwriting an existing piece set', () => {
      const config1: PieceSetConfig = {
        name: 'custom1',
        type: 'svg',
        renderer: createMockRenderer('custom1-v1'),
      };

      const config2: PieceSetConfig = {
        name: 'custom1',
        type: 'unicode',
        renderer: createMockRenderer('custom1-v2'),
      };

      registerCustomPieceSet(config1);
      registerCustomPieceSet(config2);

      const renderer = getPieceRenderer('custom1');
      expect(renderer).toBeDefined();
      expect(renderer?.type).toBe('unicode');
    });
  });

  describe('getPieceRenderer', () => {
    it('should return undefined for non-existent piece set', () => {
      const result = getPieceRenderer('nonexistent');
      expect(result).toBeUndefined();
    });

    it('should return the registered renderer', () => {
      const config: PieceSetConfig = {
        name: 'custom1',
        type: 'svg',
        renderer: createMockRenderer('custom1'),
      };

      registerCustomPieceSet(config);
      const renderer = getPieceRenderer('custom1');

      expect(renderer).toBeDefined();
      expect(renderer?.type).toBe('svg');
      expect(typeof renderer?.render).toBe('function');
    });

    it('should return renderer with correct type for svg', () => {
      const config: PieceSetConfig = {
        name: 'svgSet',
        type: 'svg',
        renderer: createMockRenderer('svgSet'),
      };

      registerCustomPieceSet(config);
      const renderer = getPieceRenderer('svgSet');

      expect(renderer?.type).toBe('svg');
    });

    it('should return renderer with correct type for unicode', () => {
      const config: PieceSetConfig = {
        name: 'unicodeSet',
        type: 'unicode',
        renderer: createMockRenderer('unicodeSet'),
      };

      registerCustomPieceSet(config);
      const renderer = getPieceRenderer('unicodeSet');

      expect(renderer?.type).toBe('unicode');
    });

    it('should return renderer with working render function', () => {
      const mockRenderer = jest.fn(createMockRenderer('custom1'));
      const config: PieceSetConfig = {
        name: 'custom1',
        type: 'svg',
        renderer: mockRenderer,
      };

      registerCustomPieceSet(config);
      const renderer = getPieceRenderer('custom1');

      expect(renderer).toBeDefined();
      const result = renderer?.render('P', 50);
      expect(result).toBeDefined();
      expect(mockRenderer).toHaveBeenCalledWith('P', 50);
    });
  });

  describe('hasPieceRenderer', () => {
    it('should return false for non-existent piece set', () => {
      expect(hasPieceRenderer('nonexistent')).toBe(false);
    });

    it('should return true for registered piece set', () => {
      const config: PieceSetConfig = {
        name: 'custom1',
        type: 'svg',
        renderer: createMockRenderer('custom1'),
      };

      registerCustomPieceSet(config);
      expect(hasPieceRenderer('custom1')).toBe(true);
    });

    it('should return false after registry is cleared', () => {
      const config: PieceSetConfig = {
        name: 'custom1',
        type: 'svg',
        renderer: createMockRenderer('custom1'),
      };

      registerCustomPieceSet(config);
      expect(hasPieceRenderer('custom1')).toBe(true);

      // Clear the registry
      const registry = pieceRendererRegistry as any;
      registry.renderers.clear();

      expect(hasPieceRenderer('custom1')).toBe(false);
    });
  });

  describe('getAvailablePieceSets', () => {
    it('should return empty array when no piece sets are registered', () => {
      const result = getAvailablePieceSets();
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should return array with single piece set name', () => {
      const config: PieceSetConfig = {
        name: 'custom1',
        type: 'svg',
        renderer: createMockRenderer('custom1'),
      };

      registerCustomPieceSet(config);
      const result = getAvailablePieceSets();

      expect(result).toEqual(['custom1']);
      expect(result).toHaveLength(1);
    });

    it('should return array with multiple piece set names', () => {
      const configs: PieceSetConfig[] = [
        { name: 'custom1', type: 'svg', renderer: createMockRenderer('custom1') },
        { name: 'custom2', type: 'unicode', renderer: createMockRenderer('custom2') },
        { name: 'custom3', type: 'svg', renderer: createMockRenderer('custom3') },
      ];

      configs.forEach(config => registerCustomPieceSet(config));
      const result = getAvailablePieceSets();

      expect(result).toHaveLength(3);
      expect(result).toContain('custom1');
      expect(result).toContain('custom2');
      expect(result).toContain('custom3');
    });

    it('should not include duplicate names when piece set is overwritten', () => {
      const config1: PieceSetConfig = {
        name: 'custom1',
        type: 'svg',
        renderer: createMockRenderer('custom1-v1'),
      };

      const config2: PieceSetConfig = {
        name: 'custom1',
        type: 'unicode',
        renderer: createMockRenderer('custom1-v2'),
      };

      registerCustomPieceSet(config1);
      registerCustomPieceSet(config2);

      const result = getAvailablePieceSets();
      expect(result).toEqual(['custom1']);
      expect(result).toHaveLength(1);
    });
  });

  describe('PieceRendererRegistry class (internal)', () => {
    it('should maintain separate instances when accessed directly', () => {
      const registry1 = pieceRendererRegistry;
      const registry2 = pieceRendererRegistry;

      expect(registry1).toBe(registry2); // Should be singleton
    });

    it('should handle special characters in piece set names', () => {
      const config: PieceSetConfig = {
        name: 'custom-set_v1.2',
        type: 'svg',
        renderer: createMockRenderer('custom-set_v1.2'),
      };

      registerCustomPieceSet(config);
      expect(hasPieceRenderer('custom-set_v1.2')).toBe(true);
    });

    it('should handle empty string as piece set name', () => {
      const config: PieceSetConfig = {
        name: '',
        type: 'svg',
        renderer: createMockRenderer('empty'),
      };

      registerCustomPieceSet(config);
      expect(hasPieceRenderer('')).toBe(true);
      expect(getPieceRenderer('')).toBeDefined();
    });
  });

  describe('integration tests', () => {
    it('should properly manage lifecycle of multiple piece sets', () => {
      // Register sets
      const config1: PieceSetConfig = {
        name: 'set1',
        type: 'svg',
        renderer: createMockRenderer('set1'),
      };
      const config2: PieceSetConfig = {
        name: 'set2',
        type: 'unicode',
        renderer: createMockRenderer('set2'),
      };

      registerCustomPieceSet(config1);
      registerCustomPieceSet(config2);

      // Verify both exist
      expect(getAvailablePieceSets()).toHaveLength(2);
      expect(hasPieceRenderer('set1')).toBe(true);
      expect(hasPieceRenderer('set2')).toBe(true);

      // Overwrite one
      const config1Updated: PieceSetConfig = {
        name: 'set1',
        type: 'unicode',
        renderer: createMockRenderer('set1-updated'),
      };
      registerCustomPieceSet(config1Updated);

      // Should still have 2 sets, but set1 should be updated
      expect(getAvailablePieceSets()).toHaveLength(2);
      expect(getPieceRenderer('set1')?.type).toBe('unicode');
      expect(getPieceRenderer('set2')?.type).toBe('unicode');
    });

    it('should allow rendering pieces after registration', () => {
      const mockRenderer = jest.fn((piece: PieceSymbol, size: number) => {
        return React.createElement(Text, {}, `${piece}-${size}`);
      });

      const config: PieceSetConfig = {
        name: 'testSet',
        type: 'svg',
        renderer: mockRenderer,
      };

      registerCustomPieceSet(config);
      const renderer = getPieceRenderer('testSet');

      // Test rendering various pieces
      renderer?.render('P', 50);
      renderer?.render('k', 60);
      renderer?.render('Q', 70);

      expect(mockRenderer).toHaveBeenCalledTimes(3);
      expect(mockRenderer).toHaveBeenNthCalledWith(1, 'P', 50);
      expect(mockRenderer).toHaveBeenNthCalledWith(2, 'k', 60);
      expect(mockRenderer).toHaveBeenNthCalledWith(3, 'Q', 70);
    });
  });
});
