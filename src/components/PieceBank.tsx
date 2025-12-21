import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { PieceBankProps } from '../types';
import { getPiecesByColor, getBankLabel } from '../utils/pieceFilters';
import { useComponentLayout } from '../hooks/useComponentLayout';
import { useBankDrag } from '../hooks/useBankDrag';
import { DraggableBankPiece } from './DraggableBankPiece';
import { FloatingPiece } from './FloatingPiece';
import { useBoardTheme } from '../contexts/BoardThemeContext';
import { DEFAULT_BANK_PIECE_SCALE } from '../constants';

/**
 * PieceBank Component
 * Displays chess pieces as a source for adding to the board
 * Non-destructive - pieces remain in the bank after being dragged
 */
export const PieceBank: React.FC<PieceBankProps> = ({
  layout = 'horizontal',
  bankStyle,
  pieceStyle,
  pieceSize,
  color,
  showLabel = false,
  labelConfig,
  onPieceDropCoords,
}) => {
  // Get theme from context
  const { squareSize } = useBoardTheme();
  // Use provided pieceSize or default to scale factor of square size
  const actualPieceSize = pieceSize ?? squareSize * DEFAULT_BANK_PIECE_SCALE;
  // Match board piece floating size when dragging
  const floatingPieceSize = squareSize * 0.7 * 0.8;

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
    floatingPieceSize,
    bankLayout,
    onPieceDropCoords,
  });

  const pieces = getPiecesByColor(color);
  const label = getBankLabel(color);

  // Label styling
  const {
    fontSize = 14,
    color: labelColor = '#333',
    fontFamily,
    fontWeight = '600',
    textStyle,
  } = labelConfig || {};

  const labelTextStyle = [
    styles.label,
    {
      fontSize,
      color: labelColor,
      fontFamily,
      fontWeight,
    },
    textStyle,
  ];

  return (
    <View
      ref={ref}
      style={[styles.container, bankStyle]}
      onLayout={handleLayout}
    >
      {showLabel && <Text style={labelTextStyle}>{label}</Text>}
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
            pieceSize={actualPieceSize}
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
        size={floatingPieceSize}
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
