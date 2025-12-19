import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import {
  GestureDetector,
  Gesture,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
  SharedValue,
} from 'react-native-reanimated';
import type { PieceBankProps, PieceSymbol } from '../types';
import { Piece } from './Piece';
import {
  WHITE_PIECES,
  BLACK_PIECES,
  ALL_PIECES_ORDERED,
  DEFAULT_SQUARE_SIZE,
} from '../utils/constants';

interface DraggingState {
  piece: PieceSymbol;
  startX: number;
  startY: number;
}

interface BankLayout {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * PieceBank Component
 * Displays chess pieces as a source for adding to the board
 * Non-destructive - pieces remain in the bank after being dragged
 */
export const PieceBank: React.FC<PieceBankProps> = ({
  layout = 'horizontal',
  bankStyle,
  pieceStyle,
  pieceSize = DEFAULT_SQUARE_SIZE,
  color,
  showLabel = true,
  onPieceDropCoords,
}) => {
  const [dragging, setDragging] = useState<DraggingState | null>(null);
  const [bankLayout, setBankLayout] = useState<BankLayout>({ x: 0, y: 0, width: 0, height: 0 });
  const bankRef = useRef<View>(null);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);

  // Determine which pieces to show based on color filter
  const pieces: PieceSymbol[] = color
    ? color === 'white'
      ? WHITE_PIECES
      : BLACK_PIECES
    : ALL_PIECES_ORDERED;

  const handleBankLayout = () => {
    bankRef.current?.measure((x, y, width, height, pageX, pageY) => {
      setBankLayout({ x: pageX, y: pageY, width, height });
    });
  };

  const handleDragStart = (piece: PieceSymbol, startX: number, startY: number) => {
    // Position floating piece centered on touch point
    // Account for bank position since floating piece is positioned relative to bank
    const actualPieceSize = pieceSize * 0.8;
    translateX.value = startX - bankLayout.x - (actualPieceSize / 2);
    translateY.value = startY - bankLayout.y - (actualPieceSize / 2);
    opacity.value = 1;

    setDragging({ piece, startX, startY });
  };

  const handleDragEnd = (finalX: number, finalY: number) => {
    if (!dragging) return;

    // Hide floating piece immediately
    opacity.value = 0;

    // Call the drop callback with absolute screen coordinates
    onPieceDropCoords?.(dragging.piece, finalX, finalY);

    // Reset dragging state
    setDragging(null);
  };

  const handleDragUpdate = (absoluteX: number, absoluteY: number) => {
    // Update position centered on touch point
    // Account for bank position since floating piece is positioned relative to bank
    const actualPieceSize = pieceSize * 0.8;
    translateX.value = absoluteX - bankLayout.x - (actualPieceSize / 2);
    translateY.value = absoluteY - bankLayout.y - (actualPieceSize / 2);
  };

  const renderPiece = (piece: PieceSymbol) => (
    <DraggableBankPiece
      key={piece}
      piece={piece}
      pieceSize={pieceSize}
      pieceStyle={pieceStyle}
      onDragStart={handleDragStart}
      onDragUpdate={handleDragUpdate}
      onDragEnd={handleDragEnd}
      bankLayout={bankLayout}
      isDragging={dragging?.piece === piece}
    />
  );

  const label = color
    ? color === 'white'
      ? 'White Pieces'
      : 'Black Pieces'
    : 'All Pieces';

  return (
    <View
      ref={bankRef}
      style={[styles.container, bankStyle]}
      onLayout={handleBankLayout}
    >
      {showLabel && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.piecesContainer,
          layout === 'horizontal' ? styles.horizontal : styles.vertical,
        ]}
      >
        {pieces.map(renderPiece)}
      </View>

      {/* Floating dragged piece */}
      <Animated.View
        style={[
          styles.draggingPiece,
          {
            width: pieceSize * 0.8,
            height: pieceSize * 0.8,
          },
          useAnimatedStyle(() => ({
            opacity: opacity.value,
            transform: [
              { translateX: translateX.value },
              { translateY: translateY.value },
            ],
          })),
        ]}
        pointerEvents="none"
      >
        {dragging && (
          <Piece
            piece={dragging.piece}
            size={pieceSize * 0.8}
            style={pieceStyle}
          />
        )}
      </Animated.View>
    </View>
  );
};

interface DraggableBankPieceProps {
  piece: PieceSymbol;
  pieceSize: number;
  pieceStyle: any;
  onDragStart: (piece: PieceSymbol, x: number, y: number) => void;
  onDragUpdate: (x: number, y: number) => void;
  onDragEnd: (x: number, y: number) => void;
  bankLayout: BankLayout;
  isDragging: boolean;
}

const DraggableBankPiece: React.FC<DraggableBankPieceProps> = ({
  piece,
  pieceSize,
  pieceStyle,
  onDragStart,
  onDragUpdate,
  onDragEnd,
  bankLayout,
  isDragging,
}) => {
  const panGesture = Gesture.Pan()
    .onStart((event) => {
      // Get the absolute screen position where the drag started
      const initialX = event.absoluteX;
      const initialY = event.absoluteY;

      runOnJS(onDragStart)(piece, initialX, initialY);
    })
    .onUpdate((event) => {
      // Update floating piece position during drag
      runOnJS(onDragUpdate)(event.absoluteX, event.absoluteY);
    })
    .onEnd((event) => {
      // Report final absolute position for drop calculation
      const finalX = event.absoluteX;
      const finalY = event.absoluteY;

      runOnJS(onDragEnd)(finalX, finalY);
    });

  return (
    <View
      style={[
        styles.pieceContainer,
        {
          width: pieceSize,
          height: pieceSize,
        },
      ]}
    >
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            styles.pieceWrapper,
            { opacity: isDragging ? 0.3 : 1 },
          ]}
        >
          <Piece piece={piece} size={pieceSize * 0.8} style={pieceStyle} />
        </Animated.View>
      </GestureDetector>
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
  pieceContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4,
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  pieceWrapper: {
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
