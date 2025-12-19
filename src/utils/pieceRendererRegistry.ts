import type { PieceRenderer, PieceSetConfig } from '../types/pieceRenderer';

/**
 * Registry for managing piece set renderers
 * Allows developers to register custom piece sets
 */
class PieceRendererRegistry {
  private renderers: Map<string, PieceRenderer> = new Map();

  /**
   * Register a piece set renderer
   * @param name - Unique name for the piece set
   * @param renderer - Renderer configuration
   */
  registerPieceSet(name: string, renderer: PieceRenderer): void {
    this.renderers.set(name, renderer);
  }

  /**
   * Get a piece set renderer by name
   * @param name - Name of the piece set
   * @returns The renderer if found, undefined otherwise
   */
  getPieceSet(name: string): PieceRenderer | undefined {
    return this.renderers.get(name);
  }

  /**
   * Check if a piece set exists
   * @param name - Name of the piece set
   * @returns True if the piece set is registered
   */
  hasPieceSet(name: string): boolean {
    return this.renderers.has(name);
  }

  /**
   * Get all registered piece set names
   * @returns Array of piece set names
   */
  getAvailablePieceSets(): string[] {
    return Array.from(this.renderers.keys());
  }
}

// Singleton instance
const registry = new PieceRendererRegistry();

/**
 * Register a custom piece set
 * Public API for developers to add custom piece sets
 * @param config - Piece set configuration
 *
 * @example
 * ```typescript
 * registerCustomPieceSet({
 *   name: 'myCustomSet',
 *   type: 'svg',
 *   renderer: (piece, size) => <MyCustomPiece piece={piece} size={size} />
 * });
 * ```
 */
export const registerCustomPieceSet = (config: PieceSetConfig): void => {
  registry.registerPieceSet(config.name, {
    type: config.type,
    render: config.renderer,
  });
};

/**
 * Get a registered piece set renderer
 * @internal
 */
export const getPieceRenderer = (name: string): PieceRenderer | undefined => {
  return registry.getPieceSet(name);
};

/**
 * Check if a piece set is registered
 * @internal
 */
export const hasPieceRenderer = (name: string): boolean => {
  return registry.hasPieceSet(name);
};

/**
 * Get all available piece set names
 */
export const getAvailablePieceSets = (): string[] => {
  return registry.getAvailablePieceSets();
};

// Export internal registry for built-in piece set registration
export { registry as pieceRendererRegistry };
