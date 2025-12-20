import React from 'react';
import { View, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import type { EditableBoardProps } from '../types';
import { BoardRank } from './BoardRank';
import { FloatingPiece } from './FloatingPiece';
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
    scale,
    opacity,
    handleDragStart,
    handleDragEnd,
  } = useBoardDrag(fen, onFenChange, squareSize);

  const components = parseFen(fen);
  const board = fenToBoardState(components.piecePlacement);

  // Match bank piece size calculation
  const floatingPieceSize = squareSize * 0.7 * 0.8;

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
      {/* Floating piece for drag feedback */}
      <FloatingPiece
        piece={draggingPiece?.piece ?? null}
        size={floatingPieceSize}
        translateX={translateX}
        translateY={translateY}
        opacity={opacity}
        scale={scale}
        pieceStyle={pieceStyle}
      />
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
});
