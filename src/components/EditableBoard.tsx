import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  GestureHandlerRootView,
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
  SharedValue,
} from 'react-native-reanimated';
import type { EditableBoardProps, PieceSymbol, Square } from '../types';
import { Piece } from './Piece';
import {
  parseFen,
  fenToBoardState,
  coordsToSquare,
  squareToCoords,
  movePiece,
  updatePieceAt,
} from '../utils/fen';
import {
  DEFAULT_SQUARE_SIZE,
  DEFAULT_LIGHT_SQUARE_COLOR,
  DEFAULT_DARK_SQUARE_COLOR,
} from '../utils/constants';

interface DraggingPiece {
  piece: PieceSymbol;
  sourceSquare: Square;
  sourceRow: number;
  sourceCol: number;
}

/**
 * EditableBoard Component
 * Renders an 8x8 chess board with pieces that can be dragged
 * Supports drag-and-drop interaction
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
  const [draggingPiece, setDraggingPiece] = useState<DraggingPiece | null>(
    null
  );

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const isDragging = useSharedValue(false);

  const components = parseFen(fen);
  const board = fenToBoardState(components.piecePlacement);

  const handleDragStart = (row: number, col: number, piece: PieceSymbol) => {
    const square = coordsToSquare({ row, col });
    setDraggingPiece({
      piece,
      sourceSquare: square,
      sourceRow: row,
      sourceCol: col,
    });
    isDragging.value = true;
  };

  const handleDragEnd = (absoluteX: number, absoluteY: number) => {
    if (!draggingPiece) return;

    // Hide floating piece immediately
    isDragging.value = false;

    // Calculate which square the piece was dropped on
    // Center the calculation on the piece's center point, not top-left
    const col = Math.floor((absoluteX + squareSize / 2) / squareSize);
    const row = Math.floor((absoluteY + squareSize / 2) / squareSize);

    // Check if dropped within board bounds
    if (row >= 0 && row < 8 && col >= 0 && col < 8) {
      const targetSquare = coordsToSquare({ row, col });
      const newFen = movePiece(fen, draggingPiece.sourceSquare, targetSquare);
      onFenChange(newFen);
    } else {
      // Dropped outside board - remove piece
      const newFen = updatePieceAt(fen, draggingPiece.sourceSquare, null);
      onFenChange(newFen);
    }

    // Reset dragging state
    setDraggingPiece(null);
  };

  const renderSquare = (row: number, col: number) => {
    const displayRow = flipped ? 7 - row : row;
    const displayCol = flipped ? 7 - col : col;
    const piece = board[displayRow][displayCol];
    const isLight = (row + col) % 2 === 0;

    // Check if this piece is being dragged
    const isBeingDragged = !!(
      draggingPiece &&
      draggingPiece.sourceRow === displayRow &&
      draggingPiece.sourceCol === displayCol
    );

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
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          pieceStyle={pieceStyle}
          translateX={translateX}
          translateY={translateY}
          isBeingDragged={isBeingDragged}
        />
      </View>
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
    <GestureHandlerRootView style={[styles.container, boardStyle]}>
      <View style={styles.board}>
        {Array.from({ length: 8 }, (_, rankIndex) => renderRank(rankIndex))}
      </View>
      {/* Always render floating piece container to keep hook count constant */}
      <Animated.View
        style={[
          styles.draggingPiece,
          {
            width: squareSize,
            height: squareSize,
          },
          useAnimatedStyle(() => ({
            opacity: isDragging.value ? 1 : 0,
            transform: [
              { translateX: translateX.value },
              { translateY: translateY.value },
            ],
          })),
        ]}
        pointerEvents="none"
      >
        {draggingPiece && (
          <Piece
            piece={draggingPiece.piece}
            size={squareSize * 0.85}
            style={pieceStyle}
          />
        )}
      </Animated.View>
    </GestureHandlerRootView>
  );
};

interface DraggablePieceProps {
  piece: PieceSymbol | null;
  row: number;
  col: number;
  squareSize: number;
  onDragStart: (row: number, col: number, piece: PieceSymbol) => void;
  onDragEnd: (x: number, y: number) => void;
  pieceStyle: any;
  translateX: SharedValue<number>;
  translateY: SharedValue<number>;
  isBeingDragged: boolean;
}

const DraggablePiece: React.FC<DraggablePieceProps> = ({
  piece,
  row,
  col,
  squareSize,
  onDragStart,
  onDragEnd,
  pieceStyle,
  translateX,
  translateY,
  isBeingDragged,
}) => {
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .enabled(!!piece) // Only enable gesture if piece exists
    .onStart(() => {
      if (!piece) return;
      // Calculate the piece's actual position on the board (center of square)
      const initialX = col * squareSize + squareSize / 2;
      const initialY = row * squareSize + squareSize / 2;

      startX.value = initialX;
      startY.value = initialY;
      translateX.value = initialX - squareSize / 2;
      translateY.value = initialY - squareSize / 2;

      runOnJS(onDragStart)(row, col, piece);
    })
    .onUpdate((event) => {
      if (!piece) return;
      // Center the floating piece on the touch point
      translateX.value = startX.value + event.translationX - squareSize / 2;
      translateY.value = startY.value + event.translationY - squareSize / 2;
    })
    .onEnd((event) => {
      if (!piece) return;
      const finalX = startX.value + event.translationX;
      const finalY = startY.value + event.translationY;

      runOnJS(onDragEnd)(finalX, finalY);

      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        style={[
          styles.pieceContainer,
          { opacity: isBeingDragged ? 0 : 1 },
        ]}
      >
        {piece && (
          <Piece piece={piece} size={squareSize * 0.85} style={pieceStyle} />
        )}
      </Animated.View>
    </GestureDetector>
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
  pieceContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  draggingPiece: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1000,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
