import React from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import type { PieceSymbol, PieceSet } from '../types';
import { usePieceRenderer } from '../hooks/usePieceRenderer';
import { UnicodePiece } from './pieces/UnicodePiece';
import { useBoardTheme } from '../contexts/BoardThemeContext';
import '../pieceRenderers'; // Initialize built-in piece renderers

interface PieceProps {
  /** The piece to render */
  piece: PieceSymbol;
  /** Size of the piece */
  size?: number;
  /** Custom style */
  style?: StyleProp<ViewStyle>;
  /** Piece set style to use (overrides context if provided) */
  pieceSet?: PieceSet | string;
}

/**
 * Renders a chess piece using registered renderers
 * Supports built-in piece sets (unicode, cburnett, alpha) and custom registered sets
 */
export const Piece: React.FC<PieceProps> = ({
  piece,
  size = 40,
  style,
  pieceSet: pieceSetProp,
}) => {
  // Get pieceSet from context
  const { pieceSet: pieceSetContext } = useBoardTheme();

  // Use prop if provided, otherwise use context
  const pieceSet = pieceSetProp ?? pieceSetContext;

  const { renderer, isRegistered } = usePieceRenderer(pieceSet);

  // Use registered renderer if available
  if (isRegistered && renderer) {
    return renderer.render(piece, size, style);
  }

  // Fallback to unicode if piece set not found
  return <UnicodePiece piece={piece} size={size} style={style} />;
};
