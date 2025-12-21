// Export types
export * from './types';
export type {
  PieceRenderer,
  PieceRendererFunction,
  CustomPieceSetRenderer,
  PieceSetConfig,
} from './types/pieceRenderer';

// Export utilities
export * from './utils';

// Export constants
export * from './constants';

// Export piece renderer API
export {
  registerCustomPieceSet,
  getAvailablePieceSets,
} from './utils/pieceRendererRegistry';

// Export components
export { Piece } from './components/Piece';
export { EditableBoard } from './components/EditableBoard';
export { PieceBank } from './components/PieceBank';
export { FenDisplay } from './components/FenDisplay';
export { CastlingRightsTogglers } from './components/CastlingRightsTogglers';
export { EnPassantInput } from './components/EnPassantInput';
export { TurnToggler } from './components/TurnToggler';
export { EditorToolsPanel } from './components/EditorToolsPanel';
export { PieceSetSelector } from './components/PieceSetSelector';
export { FlipBoardButton } from './components/FlipBoardButton';
export { BoardEditor } from './components/BoardEditor';
export { RankLabels, FileLabels } from './components/BoardCoordinates';

// Export context and hooks
export {
  BoardThemeProvider,
  useBoardTheme,
  type BoardTheme,
  type BoardThemeProviderProps,
} from './contexts/BoardThemeContext';
