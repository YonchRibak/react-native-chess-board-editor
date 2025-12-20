import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { PieceBankProps } from '../types';
import { getPiecesByColor, getBankLabel } from '../utils/pieceFilters';
import { useComponentLayout } from '../hooks/useComponentLayout';
import { useBankDrag } from '../hooks/useBankDrag';
import { DraggableBankPiece } from './DraggableBankPiece';
import { FloatingPiece } from './FloatingPiece';
import { useBoardTheme } from '../contexts/BoardThemeContext';

/**
 * PieceBank Component
 * Displays chess pieces as a source for adding to the board
 * Non-destructive - pieces remain in the bank after being dragged
 */
export const PieceBank: React.FC<PieceBankProps> = ({
  layout = 'horizontal',
  bankStyle,
  pieceStyle,
  color,
  showLabel = true,
  onPieceDropCoords,
}) => {
  // Get theme from context
  const { squareSize } = useBoardTheme();
  const pieceSize = squareSize * 0.7;

  const { ref, layout: bankLayout, handleLayout } = useComponentLayout();

  const {
    dragging,
    translateX,
    translateY,
    opacity,
    scale,
    handleDragStart,
    handleDragUpdate,
    handleDragEnd,
  } = useBankDrag({
    pieceSize,
    bankLayout,
    onPieceDropCoords,
  });

  const pieces = getPiecesByColor(color);
  const label = getBankLabel(color);

  return (
    <View
      ref={ref}
      style={[styles.container, bankStyle]}
      onLayout={handleLayout}
    >
      {showLabel && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.piecesContainer,
          layout === 'horizontal' ? styles.horizontal : styles.vertical,
        ]}
      >
        {pieces.map((piece) => (
          <DraggableBankPiece
            key={piece}
            piece={piece}
            pieceStyle={pieceStyle}
            onDragStart={handleDragStart}
            onDragUpdate={handleDragUpdate}
            onDragEnd={handleDragEnd}
            isDragging={dragging?.piece === piece}
          />
        ))}
      </View>

      <FloatingPiece
        piece={dragging?.piece ?? null}
        size={pieceSize * 0.8}
        translateX={translateX}
        translateY={translateY}
        opacity={opacity}
        scale={scale}
        pieceStyle={pieceStyle}
      />
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
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  piecesContainer: {
    flexWrap: 'wrap',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  vertical: {
    flexDirection: 'column',
    alignItems: 'center',
  },
});
