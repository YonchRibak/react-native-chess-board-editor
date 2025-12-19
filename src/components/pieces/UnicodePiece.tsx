import React from 'react';
import { Text, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import type { PieceSymbol } from '../../types';
import { PIECE_UNICODE } from '../../constants';

export interface UnicodePieceProps {
  /** The piece to render */
  piece: PieceSymbol;
  /** Size of the piece */
  size: number;
  /** Custom style */
  style?: StyleProp<ViewStyle>;
}

/**
 * UnicodePiece Component
 * Renders a chess piece using Unicode symbols
 */
export const UnicodePiece: React.FC<UnicodePieceProps> = ({
  piece,
  size,
  style,
}) => {
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
