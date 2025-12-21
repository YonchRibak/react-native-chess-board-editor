import React from 'react';
import { View, StyleSheet } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import type { PieceSymbol } from '../types';
import { Piece } from './Piece';
import { useBankPieceGesture } from '../hooks/useBankPieceGesture';
import { useBoardTheme } from '../contexts/BoardThemeContext';

export interface DraggableBankPieceProps {
  piece: PieceSymbol;
  pieceStyle?: any;
  pieceSize?: number;
  onDragStart: (piece: PieceSymbol, x: number, y: number) => void;
  onDragUpdate: (x: number, y: number) => void;
  onDragEnd: (x: number, y: number) => void;
  isDragging: boolean;
}

/**
 * DraggableBankPiece Component
 * A piece in the piece bank that can be dragged onto the board
 * Non-destructive - the piece remains in the bank after dragging
 */
export const DraggableBankPiece: React.FC<DraggableBankPieceProps> = ({
  piece,
  pieceStyle,
  pieceSize: propPieceSize,
  onDragStart,
  onDragUpdate,
  onDragEnd,
  isDragging,
}) => {
  // Get theme from context
  const { squareSize } = useBoardTheme();
  const pieceSize = propPieceSize ?? squareSize * 0.7;
  const panGesture = useBankPieceGesture({
    piece,
    onDragStart,
    onDragUpdate,
    onDragEnd,
  });

  return (
    <View
      style={[
        styles.pieceContainer,
        {
          width: pieceSize,
          height: pieceSize,
        },
      ]}
    >
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            styles.pieceWrapper,
            { opacity: isDragging ? 0.3 : 1 },
          ]}
        >
          <Piece
            piece={piece}
            size={pieceSize * 0.8}
            style={pieceStyle}
          />
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  pieceContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4,
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  pieceWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
