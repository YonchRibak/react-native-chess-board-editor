import type { ReactElement } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type { PieceSymbol } from './index';

/**
 * Function that renders a chess piece
 */
export type PieceRendererFunction = (
  piece: PieceSymbol,
  size: number,
  style?: StyleProp<ViewStyle>
) => ReactElement;

/**
 * Configuration for a piece renderer
 */
export interface PieceRenderer {
  /** The render function */
  render: PieceRendererFunction;
  /** Type of renderer (svg or unicode) */
  type: 'svg' | 'unicode';
}

/**
 * Custom piece set renderer function for developers to implement
 */
export type CustomPieceSetRenderer = (
  piece: PieceSymbol,
  size: number,
  style?: StyleProp<ViewStyle>
) => ReactElement;

/**
 * Configuration for registering a custom piece set
 */
export interface PieceSetConfig {
  /** Unique name for the piece set */
  name: string;
  /** Type of rendering (svg or unicode) */
  type: 'svg' | 'unicode';
  /** Renderer function that returns React element */
  renderer: CustomPieceSetRenderer;
}
