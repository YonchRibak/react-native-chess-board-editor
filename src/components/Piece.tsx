import React from 'react';
import { Text, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import type { PieceSymbol, PieceSet } from '../types';
import { PIECE_UNICODE } from '../utils/constants';
import { renderCburnettPiece } from '../assets/pieces/cburnett';
import { renderAlphaPiece } from '../assets/pieces/alpha';

interface PieceProps {
  /** The piece to render */
  piece: PieceSymbol;
  /** Size of the piece */
  size?: number;
  /** Custom style */
  style?: StyleProp<ViewStyle>;
  /** Piece set style to use */
  pieceSet?: PieceSet;
}

/**
 * Renders a chess piece using either Unicode symbols or SVG graphics
 */
export const Piece: React.FC<PieceProps> = ({
  piece,
  size = 40,
  style,
  pieceSet = 'cburnett',
}) => {
  // Unicode rendering
  if (pieceSet === 'unicode') {
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
  }

  // SVG rendering for different piece sets
  if (pieceSet === 'cburnett') {
    return (
      <View style={[styles.svgContainer, style]}>
        {renderCburnettPiece(piece, size)}
      </View>
    );
  }

  if (pieceSet === 'alpha') {
    return (
      <View style={[styles.svgContainer, style]}>
        {renderAlphaPiece(piece, size)}
      </View>
    );
  }

  // Fallback to unicode if unknown piece set
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
  svgContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
  },
  placeholderText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
});
