import { useState } from 'react';
import type { PieceSet } from '../types';
import { DEFAULT_PIECE_SET } from '../constants';

export interface UsePieceSetReturn {
  pieceSet: PieceSet | string;
  handlePieceSetChange: (newPieceSet: PieceSet | string) => void;
}

/**
 * Custom hook for managing piece set state
 * Handles piece set selection and change notifications
 * Supports both built-in piece sets and custom registered sets
 */
export const usePieceSet = (
  initialPieceSet: PieceSet | string = DEFAULT_PIECE_SET,
  onPieceSetChange?: (pieceSet: PieceSet | string) => void
): UsePieceSetReturn => {
  const [pieceSet, setPieceSet] = useState<PieceSet | string>(initialPieceSet);

  const handlePieceSetChange = (newPieceSet: PieceSet | string) => {
    setPieceSet(newPieceSet);
    onPieceSetChange?.(newPieceSet);
  };

  return {
    pieceSet,
    handlePieceSetChange,
  };
};
