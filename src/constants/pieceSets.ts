import type { PieceSetConfig } from '../types';

/**
 * Available piece sets configuration
 */
export const PIECE_SETS: PieceSetConfig[] = [
  {
    id: 'unicode',
    name: 'Unicode',
    description: 'Simple Unicode chess symbols',
  },
  {
    id: 'cburnett',
    name: 'CBurnett',
    description: 'Classic professional style (used on Chess.com)',
  },
  {
    id: 'alpha',
    name: 'Alpha',
    description: 'Modern minimalist design',
  },
];
