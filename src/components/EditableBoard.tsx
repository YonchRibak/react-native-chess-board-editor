import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import type { EditableBoardProps } from '../types';
import { BoardRank } from './BoardRank';
import { RankLabels, FileLabels } from './BoardCoordinates';
import { FloatingPiece } from './FloatingPiece';
import { parseFen, fenToBoardState } from '../utils/fen';
import { useBoardDrag } from '../hooks/useBoardDrag';
import { useBoardTheme } from '../contexts/BoardThemeContext';

/**
 * EditableBoard Component
 * Renders an 8x8 chess board with pieces that can be dragged
 * Supports drag-and-drop interaction
 * Displays rank and file labels by default
 */
export const EditableBoard: React.FC<EditableBoardProps> = ({
  fen,
  onFenChange,
  pieceStyle,
  boardStyle,
  flipped = false,
  coordinateLabels = { show: true },
}) => {
  // Get theme from context
  const { squareSize, lightSquareColor, darkSquareColor, pieceSet } = useBoardTheme();

  // Determine if we should show coordinates
  const showCoordinates = coordinateLabels.show !== false;

  // Calculate rank label width for file label alignment
  const rankLabelWidth = useMemo(() => {
    const fontSize = coordinateLabels.fontSize || squareSize * 0.2;
    return fontSize * 1.8;
  }, [coordinateLabels.fontSize, squareSize]);

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
      <View style={styles.boardWithCoordinates}>
        {/* Main board row: rank labels + board */}
        <View style={styles.boardRow}>
          {/* Rank labels on the left */}
          {showCoordinates && (
            <RankLabels
              squareSize={squareSize}
              flipped={flipped}
              config={coordinateLabels}
            />
          )}
          {/* Chess board */}
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
        </View>
        {/* File labels at the bottom */}
        {showCoordinates && (
          <FileLabels
            squareSize={squareSize}
            flipped={flipped}
            config={coordinateLabels}
            rankLabelWidth={rankLabelWidth}
          />
        )}
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
  boardWithCoordinates: {
    alignItems: 'center',
  },
  boardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  board: {
    borderWidth: 2,
    borderColor: '#333',
    borderRadius: 4,
    overflow: 'hidden',
  },
});
