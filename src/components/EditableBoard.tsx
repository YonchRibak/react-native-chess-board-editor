import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import type { EditableBoardProps, PieceSymbol, Square } from '../types';
import { Piece } from './Piece';
import {
  parseFen,
  fenToBoardState,
  coordsToSquare,
  movePiece,
  updatePieceAt,
} from '../utils/fen';
import {
  DEFAULT_SQUARE_SIZE,
  DEFAULT_LIGHT_SQUARE_COLOR,
  DEFAULT_DARK_SQUARE_COLOR,
  FILES,
  RANKS,
} from '../utils/constants';

/**
 * EditableBoard Component
 * Renders an 8x8 chess board with pieces that can be moved
 * Supports tap-to-select and tap-to-move interaction
 */
export const EditableBoard: React.FC<EditableBoardProps> = ({
  fen,
  onFenChange,
  squareSize = DEFAULT_SQUARE_SIZE,
  lightSquareColor = DEFAULT_LIGHT_SQUARE_COLOR,
  darkSquareColor = DEFAULT_DARK_SQUARE_COLOR,
  pieceStyle,
  boardStyle,
  flipped = false,
}) => {
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);

  const components = parseFen(fen);
  const board = fenToBoardState(components.piecePlacement);

  const handleSquarePress = (row: number, col: number) => {
    const square = coordsToSquare({ row, col });
    const piece = board[row][col];

    if (selectedSquare) {
      // A square is already selected
      if (selectedSquare === square) {
        // Deselect if tapping same square
        setSelectedSquare(null);
      } else {
        // Move piece from selected square to this square
        const newFen = movePiece(fen, selectedSquare, square);
        onFenChange(newFen);
        setSelectedSquare(null);
      }
    } else {
      // No square selected
      if (piece) {
        // Select this square if it has a piece
        setSelectedSquare(square);
      }
    }
  };

  const handleSquareLongPress = (row: number, col: number) => {
    // Long press to remove piece
    const square = coordsToSquare({ row, col });
    const newFen = updatePieceAt(fen, square, null);
    onFenChange(newFen);
    setSelectedSquare(null);
  };

  const renderSquare = (row: number, col: number) => {
    const displayRow = flipped ? 7 - row : row;
    const displayCol = flipped ? 7 - col : col;
    const piece = board[displayRow][displayCol];
    const square = coordsToSquare({ row: displayRow, col: displayCol });
    const isLight = (row + col) % 2 === 0;
    const isSelected = selectedSquare === square;

    return (
      <TouchableOpacity
        key={`${row}-${col}`}
        style={[
          styles.square,
          {
            width: squareSize,
            height: squareSize,
            backgroundColor: isSelected
              ? '#ffeb3b'
              : isLight
              ? lightSquareColor
              : darkSquareColor,
          },
        ]}
        onPress={() => handleSquarePress(displayRow, displayCol)}
        onLongPress={() => handleSquareLongPress(displayRow, displayCol)}
        accessibilityLabel={`Square ${square}${piece ? ` with ${piece}` : ' empty'}`}
        accessibilityHint={
          selectedSquare
            ? `Move piece from ${selectedSquare} to ${square}`
            : piece
            ? 'Tap to select this piece'
            : 'Empty square'
        }
      >
        {piece && (
          <Piece piece={piece} size={squareSize * 0.85} style={pieceStyle} />
        )}
      </TouchableOpacity>
    );
  };

  const renderRank = (rankIndex: number) => {
    return (
      <View key={rankIndex} style={styles.rank}>
        {Array.from({ length: 8 }, (_, colIndex) =>
          renderSquare(rankIndex, colIndex)
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, boardStyle]}>
      <View style={styles.board}>
        {Array.from({ length: 8 }, (_, rankIndex) => renderRank(rankIndex))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  board: {
    borderWidth: 2,
    borderColor: '#333',
    borderRadius: 4,
    overflow: 'hidden',
  },
  rank: {
    flexDirection: 'row',
  },
  square: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
