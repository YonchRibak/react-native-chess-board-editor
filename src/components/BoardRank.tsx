import React from 'react';
import { View, StyleSheet } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';
import type { PieceSymbol, PieceSet } from '../types';
import { BoardSquare } from './BoardSquare';
import type { DraggingPiece } from '../hooks/useBoardDrag';

export interface BoardRankProps {
  rankIndex: number;
  board: (PieceSymbol | null)[][];
  squareSize: number;
  lightSquareColor: string;
  darkSquareColor: string;
  flipped: boolean;
  draggingPiece: DraggingPiece | null;
  onDragStart: (row: number, col: number, piece: PieceSymbol) => void;
  onDragEnd: (x: number, y: number) => void;
  pieceStyle?: any;
  translateX: SharedValue<number>;
  translateY: SharedValue<number>;
  pieceSet?: PieceSet | string;
}

/**
 * BoardRank Component
 * Renders a single rank (row) of the chess board
 */
export const BoardRank: React.FC<BoardRankProps> = ({
  rankIndex,
  board,
  squareSize,
  lightSquareColor,
  darkSquareColor,
  flipped,
  draggingPiece,
  onDragStart,
  onDragEnd,
  pieceStyle,
  translateX,
  translateY,
  pieceSet,
}) => {
  const renderSquare = (colIndex: number) => {
    const displayRow = flipped ? 7 - rankIndex : rankIndex;
    const displayCol = flipped ? 7 - colIndex : colIndex;
    const piece = board[displayRow][displayCol];

    // Check if this piece is being dragged
    const isBeingDragged = !!(
      draggingPiece &&
      draggingPiece.sourceRow === displayRow &&
      draggingPiece.sourceCol === displayCol
    );

    return (
      <BoardSquare
        key={`${rankIndex}-${colIndex}`}
        row={rankIndex}
        col={colIndex}
        displayRow={displayRow}
        displayCol={displayCol}
        piece={piece}
        squareSize={squareSize}
        lightSquareColor={lightSquareColor}
        darkSquareColor={darkSquareColor}
        isBeingDragged={isBeingDragged}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        pieceStyle={pieceStyle}
        translateX={translateX}
        translateY={translateY}
        pieceSet={pieceSet}
      />
    );
  };

  return (
    <View style={styles.rank}>
      {Array.from({ length: 8 }, (_, colIndex) => renderSquare(colIndex))}
    </View>
  );
};

const styles = StyleSheet.create({
  rank: {
    flexDirection: 'row',
  },
});
