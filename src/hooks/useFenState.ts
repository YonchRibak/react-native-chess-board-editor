import { useState } from 'react';
import type { PieceSymbol } from '../types';
import {
  parseFen,
  updateCastlingRights,
  updateEnPassant,
  updateActiveColor,
  updatePieceAt,
} from '../utils';

export interface UseFenStateReturn {
  fen: string;
  components: ReturnType<typeof parseFen>;
  handleFenChange: (newFen: string) => void;
  handleCastlingChange: (castlingRights: string) => void;
  handleEnPassantChange: (enPassantSquare: string) => void;
  handleTurnChange: (turn: 'w' | 'b') => void;
  handlePieceUpdate: (square: string, piece: PieceSymbol | null) => void;
}

/**
 * Custom hook for managing FEN state and updates
 * Centralizes all FEN manipulation logic
 */
export const useFenState = (
  initialFen: string,
  onFenChange?: (fen: string) => void
): UseFenStateReturn => {
  const [fen, setFen] = useState(initialFen);
  const components = parseFen(fen);

  const handleFenChange = (newFen: string) => {
    setFen(newFen);
    onFenChange?.(newFen);
  };

  const handleCastlingChange = (castlingRights: string) => {
    const newFen = updateCastlingRights(fen, castlingRights);
    handleFenChange(newFen);
  };

  const handleEnPassantChange = (enPassantSquare: string) => {
    // Auto-update turn when en passant changes
    const newFen = updateEnPassant(fen, enPassantSquare, true);
    handleFenChange(newFen);
  };

  const handleTurnChange = (turn: 'w' | 'b') => {
    const newFen = updateActiveColor(fen, turn);
    handleFenChange(newFen);
  };

  const handlePieceUpdate = (square: string, piece: PieceSymbol | null) => {
    const newFen = updatePieceAt(fen, square, piece);
    handleFenChange(newFen);
  };

  return {
    fen,
    components,
    handleFenChange,
    handleCastlingChange,
    handleEnPassantChange,
    handleTurnChange,
    handlePieceUpdate,
  };
};
