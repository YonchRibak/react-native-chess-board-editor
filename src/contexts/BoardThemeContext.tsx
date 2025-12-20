import React, { createContext, useContext } from 'react';
import type { PieceSet } from '../types';
import {
  DEFAULT_SQUARE_SIZE,
  DEFAULT_LIGHT_SQUARE_COLOR,
  DEFAULT_DARK_SQUARE_COLOR,
  DEFAULT_PIECE_SET,
} from '../constants';

/**
 * BoardTheme Interface
 * Defines the presentational/styling properties for the chess board
 */
export interface BoardTheme {
  pieceSet: PieceSet | string;
  squareSize: number;
  lightSquareColor: string;
  darkSquareColor: string;
}

/**
 * Default theme values
 */
const defaultTheme: BoardTheme = {
  pieceSet: DEFAULT_PIECE_SET,
  squareSize: DEFAULT_SQUARE_SIZE,
  lightSquareColor: DEFAULT_LIGHT_SQUARE_COLOR,
  darkSquareColor: DEFAULT_DARK_SQUARE_COLOR,
};

/**
 * BoardThemeContext
 * Provides theme/styling configuration to all board components
 */
const BoardThemeContext = createContext<BoardTheme>(defaultTheme);

/**
 * BoardThemeProvider Props
 */
export interface BoardThemeProviderProps {
  children: React.ReactNode;
  theme: BoardTheme;
}

/**
 * BoardThemeProvider Component
 * Wraps components that need access to board theme
 */
export const BoardThemeProvider: React.FC<BoardThemeProviderProps> = ({
  children,
  theme,
}) => {
  return (
    <BoardThemeContext.Provider value={theme}>
      {children}
    </BoardThemeContext.Provider>
  );
};

/**
 * useBoardTheme Hook
 * Custom hook to access board theme from context
 */
export const useBoardTheme = (): BoardTheme => {
  const context = useContext(BoardThemeContext);
  if (!context) {
    // Return default theme if not in provider (graceful fallback)
    return defaultTheme;
  }
  return context;
};
