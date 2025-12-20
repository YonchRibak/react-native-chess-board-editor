import React from 'react';
import { StyleSheet } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated, { SharedValue } from 'react-native-reanimated';
import type { PieceSymbol } from '../types';
import { Piece } from './Piece';
import { usePieceGesture } from '../hooks/usePieceGesture';
import { useBoardTheme } from '../contexts/BoardThemeContext';

export interface DraggablePieceProps {
  piece: PieceSymbol | null;
  row: number;
  col: number;
  onDragStart: (row: number, col: number, piece: PieceSymbol) => void;
  onDragEnd: (x: number, y: number) => void;
  pieceStyle?: any;
  translateX: SharedValue<number>;
  translateY: SharedValue<number>;
  isBeingDragged: boolean;
}

/**
 * DraggablePiece Component
 * A piece that can be dragged around the board using pan gestures
 */
export const DraggablePiece: React.FC<DraggablePieceProps> = ({
  piece,
  row,
  col,
  onDragStart,
  onDragEnd,
  pieceStyle,
  translateX,
  translateY,
  isBeingDragged,
}) => {
  // Get theme from context
  const { squareSize } = useBoardTheme();

  const panGesture = usePieceGesture({
    piece,
    row,
    col,
    squareSize,
    onDragStart,
    onDragEnd,
    translateX,
    translateY,
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
  pieceContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
