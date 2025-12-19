import React from 'react';
import { View, StyleSheet } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';
import type { PieceSymbol, PieceSet } from '../types';
import { DraggablePiece } from './DraggablePiece';

export interface BoardSquareProps {
  row: number;
  col: number;
  displayRow: number;
  displayCol: number;
  piece: PieceSymbol | null;
  squareSize: number;
  lightSquareColor: string;
  darkSquareColor: string;
  isBeingDragged: boolean;
  onDragStart: (row: number, col: number, piece: PieceSymbol) => void;
  onDragEnd: (x: number, y: number) => void;
  pieceStyle?: any;
  translateX: SharedValue<number>;
  translateY: SharedValue<number>;
  pieceSet?: PieceSet | string;
}

/**
 * BoardSquare Component
 * Renders a single square on the chess board with its piece (if any)
 */
export const BoardSquare: React.FC<BoardSquareProps> = ({
  row,
  col,
  displayRow,
  displayCol,
  piece,
  squareSize,
  lightSquareColor,
  darkSquareColor,
  isBeingDragged,
  onDragStart,
  onDragEnd,
  pieceStyle,
  translateX,
  translateY,
  pieceSet,
}) => {
  const isLight = (row + col) % 2 === 0;

  return (
    <View
      key={`${row}-${col}`}
      style={[
        styles.square,
        {
          width: squareSize,
          height: squareSize,
          backgroundColor: isLight ? lightSquareColor : darkSquareColor,
        },
      ]}
    >
      {/* Always render DraggablePiece to keep hook count constant */}
      <DraggablePiece
        piece={piece}
        row={displayRow}
        col={displayCol}
        squareSize={squareSize}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        pieceStyle={pieceStyle}
        translateX={translateX}
        translateY={translateY}
        isBeingDragged={isBeingDragged}
        pieceSet={pieceSet}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  square: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
