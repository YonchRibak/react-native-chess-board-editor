import React from 'react';
import { View, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import type { EditableBoardProps } from '../types';
import { Piece } from './Piece';
import { BoardRank } from './BoardRank';
import { parseFen, fenToBoardState } from '../utils/fen';
import { useBoardDrag } from '../hooks/useBoardDrag';
import { useBoardTheme } from '../contexts/BoardThemeContext';

/**
 * EditableBoard Component
 * Renders an 8x8 chess board with pieces that can be dragged
 * Supports drag-and-drop interaction
 */
export const EditableBoard: React.FC<EditableBoardProps> = ({
  fen,
  onFenChange,
  pieceStyle,
  boardStyle,
  flipped = false,
}) => {
  // Get theme from context
  const { squareSize, lightSquareColor, darkSquareColor, pieceSet } = useBoardTheme();

  // Use drag state hook
  const {
    draggingPiece,
    translateX,
    translateY,
    isDragging,
    handleDragStart,
    handleDragEnd,
  } = useBoardDrag(fen, onFenChange, squareSize);

  const components = parseFen(fen);
  const board = fenToBoardState(components.piecePlacement);

  return (
    <GestureHandlerRootView style={[styles.container, boardStyle]}>
      <View style={styles.board}>
        {Array.from({ length: 8 }, (_, rankIndex) => (
          <BoardRank
            key={rankIndex}
            rankIndex={rankIndex}
            board={board}
            flipped={flipped}
            draggingPiece={draggingPiece}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            pieceStyle={pieceStyle}
            translateX={translateX}
            translateY={translateY}
          />
        ))}
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
  draggingPiece: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1000,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
