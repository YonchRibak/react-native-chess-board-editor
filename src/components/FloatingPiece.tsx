import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  SharedValue,
} from 'react-native-reanimated';
import type { PieceSymbol, PieceSet } from '../types';
import { Piece } from './Piece';

export interface FloatingPieceProps {
  piece: PieceSymbol | null;
  size: number;
  translateX: SharedValue<number>;
  translateY: SharedValue<number>;
  opacity: SharedValue<number>;
  pieceStyle?: any;
  pieceSet?: PieceSet | string;
}

/**
 * FloatingPiece Component
 * Renders an animated floating piece that follows the user's drag gesture
 * Used for visual feedback during drag operations
 */
export const FloatingPiece: React.FC<FloatingPieceProps> = ({
  piece,
  size,
  translateX,
  translateY,
  opacity,
  pieceStyle,
  pieceSet,
}) => {
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <Animated.View
      style={[
        styles.container,
        {
          width: size,
          height: size,
        },
        animatedStyle,
      ]}
      pointerEvents="none"
    >
      {piece && (
        <Piece
          piece={piece}
          size={size}
          style={pieceStyle}
          pieceSet={pieceSet}
        />
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1000,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
