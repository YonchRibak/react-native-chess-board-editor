import React from 'react';
import { Text, StyleSheet, type StyleProp, type TextStyle } from 'react-native';
import type { PieceSymbol } from '../types';
import { PIECE_UNICODE } from '../utils/constants';

interface PieceProps {
  /** The piece to render */
  piece: PieceSymbol;
  /** Size of the piece */
  size?: number;
  /** Custom style */
  style?: StyleProp<TextStyle>;
}

/**
 * Renders a chess piece using Unicode symbols
 * This is a simple implementation - can be extended to use SVG or images
 */
export const Piece: React.FC<PieceProps> = ({ piece, size = 40, style }) => {
  return (
    <Text
      style={[
        styles.piece,
        {
          fontSize: size,
          lineHeight: size * 1.2,
        },
        style,
      ]}
    >
      {PIECE_UNICODE[piece]}
    </Text>
  );
};

const styles = StyleSheet.create({
  piece: {
    textAlign: 'center',
    userSelect: 'none',
  },
});
