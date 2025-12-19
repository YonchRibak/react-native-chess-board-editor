import React, { type ReactElement } from 'react';
import { View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

export interface SvgPieceProps {
  /** The SVG element to render */
  children: ReactElement;
  /** Custom style */
  style?: StyleProp<ViewStyle>;
}

/**
 * SvgPiece Component
 * Wrapper component for SVG-rendered chess pieces
 */
export const SvgPiece: React.FC<SvgPieceProps> = ({ children, style }) => {
  return <View style={[styles.svgContainer, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  svgContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
