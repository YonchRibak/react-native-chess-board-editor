import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  SharedValue,
} from 'react-native-reanimated';
import type { PieceSymbol } from '../types';
import { Piece } from './Piece';

export interface FloatingPieceProps {
  piece: PieceSymbol | null;
  size: number;
  translateX: SharedValue<number>;
  translateY: SharedValue<number>;
  opacity: SharedValue<number>;
  scale: SharedValue<number>;
  pieceStyle?: any;
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
  scale,
  pieceStyle,
}) => {
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
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
        <>
          <View
            style={[
              styles.circleBackground,
              {
                width: size * 1.3,
                height: size * 1.3,
                borderRadius: (size * 1.3) / 2,
              },
            ]}
          />
          <Piece
            piece={piece}
            size={size}
            style={pieceStyle}
          />
        </>
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
  circleBackground: {
    position: 'absolute',
    backgroundColor: 'rgba(128, 128, 128, 0.5)',
    zIndex: -1,
  },
});
