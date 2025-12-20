// Piece types
export type { PieceSymbol, PieceColor, PieceSet, PieceSetConfig } from './piece';

// Board types
export type { Square, BoardCoordinates, PiecePlacement, BoardState, CastlingRights } from './board';

// FEN types
export type { FenComponents } from './fen';

// Event types
export type { DragEventData } from './events';

// Editor types
export type { DefaultEditorTools, EditorToolsLayout } from './editor';

// Component props
export type {
  EditableBoardProps,
  PieceBankProps,
  FenDisplayProps,
  CastlingRightsTogglersProps,
  EnPassantInputProps,
  TurnTogglerProps,
  EditorToolsPanelProps,
  BoardEditorUIConfig,
  BoardEditorProps,
} from './props';

// Re-export bank-related types
export type { DraggingState, ComponentLayout } from './bank';
