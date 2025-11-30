import React from 'react';
import { View, StyleSheet } from 'react-native';
import type { PieceBankProps, PieceSymbol } from '../types';
import { Piece } from './Piece';
import { ALL_PIECES_ORDERED, DEFAULT_SQUARE_SIZE } from '../utils/constants';

/**
 * PieceBank Component
 * Displays all chess pieces as a source for adding to the board
 * Non-destructive - pieces remain in the bank after being dragged
 */
export const PieceBank: React.FC<PieceBankProps> = ({
  layout = 'horizontal',
  bankStyle,
  pieceStyle,
  pieceSize = DEFAULT_SQUARE_SIZE,
}) => {
  const renderPiece = (piece: PieceSymbol) => (
    <View
      key={piece}
      style={[
        styles.pieceContainer,
        {
          width: pieceSize,
          height: pieceSize,
        },
      ]}
    >
      <Piece piece={piece} size={pieceSize * 0.8} style={pieceStyle} />
    </View>
  );

  return (
    <View
      style={[
        styles.container,
        layout === 'horizontal' ? styles.horizontal : styles.vertical,
        bankStyle,
      ]}
    >
      {ALL_PIECES_ORDERED.map(renderPiece)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  horizontal: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  vertical: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  pieceContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4,
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
});
