import type { PieceRenderer } from '../types/pieceRenderer';
import { getPieceRenderer } from '../utils/pieceRendererRegistry';

export interface UsePieceRendererReturn {
  renderer: PieceRenderer | undefined;
  isRegistered: boolean;
}

/**
 * Custom hook for getting a piece renderer
 * @param pieceSet - Name of the piece set
 * @returns Object with renderer and registration status
 */
export const usePieceRenderer = (
  pieceSet: string
): UsePieceRendererReturn => {
  const renderer = getPieceRenderer(pieceSet);

  return {
    renderer,
    isRegistered: renderer !== undefined,
  };
};
