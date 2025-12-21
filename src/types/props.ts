import type { StyleProp, ViewStyle, TextStyle } from 'react-native';
import type { PieceSymbol, PieceColor, PieceSet } from './piece';
import type { Square } from './board';
import type { DefaultEditorTools, EditorToolsLayout } from './editor';

/**
 * Configuration for board coordinate labels (rank and file labels)
 */
export interface CoordinateLabelsConfig {
  /** Whether to show coordinate labels */
  show?: boolean;
  /** Text style for coordinate labels */
  textStyle?: StyleProp<TextStyle>;
  /** Font size for coordinate labels */
  fontSize?: number;
  /** Color for coordinate labels */
  color?: string;
  /** Font family for coordinate labels */
  fontFamily?: string;
  /** Font weight for coordinate labels */
  fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
}

/**
 * Props for EditableBoard component
 */
export interface EditableBoardProps {
  /** Current FEN string */
  fen: string;
  /** Callback when FEN changes */
  onFenChange: (newFen: string) => void;
  /** Size of each square in pixels */
  squareSize?: number;
  /** Light square color */
  lightSquareColor?: string;
  /** Dark square color */
  darkSquareColor?: string;
  /** Style for chess pieces */
  pieceStyle?: StyleProp<ViewStyle>;
  /** Custom style for the board container */
  boardStyle?: StyleProp<ViewStyle>;
  /** Whether to flip the board (show from black's perspective) */
  flipped?: boolean;
  /** Piece set style to use (built-in or custom registered) */
  pieceSet?: PieceSet | string;
  /** Configuration for rank and file coordinate labels */
  coordinateLabels?: CoordinateLabelsConfig;
}

/**
 * Configuration for piece bank label styling
 */
export interface BankLabelConfig {
  /** Text style for bank label */
  textStyle?: StyleProp<TextStyle>;
  /** Font size for bank label */
  fontSize?: number;
  /** Color for bank label */
  color?: string;
  /** Font family for bank label */
  fontFamily?: string;
  /** Font weight for bank label */
  fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
}

/**
 * Props for PieceBank component
 */
export interface PieceBankProps {
  /** Callback when a piece is dropped from the bank */
  onPieceDrop?: (piece: PieceSymbol, targetSquare: Square) => void;
  /** Callback when a piece is dropped with screen coordinates */
  onPieceDropCoords?: (piece: PieceSymbol, x: number, y: number) => void;
  /** Layout orientation */
  layout?: 'horizontal' | 'vertical';
  /** Style for the bank container */
  bankStyle?: StyleProp<ViewStyle>;
  /** Style for individual pieces */
  pieceStyle?: StyleProp<ViewStyle>;
  /** Piece size in pixels */
  pieceSize?: number;
  /** Color filter - show only white, black, or all pieces */
  color?: 'white' | 'black';
  /** Whether to show the label above the pieces (default: false) */
  showLabel?: boolean;
  /** Configuration for label styling */
  labelConfig?: BankLabelConfig;
  /** Piece set style to use (built-in or custom registered) */
  pieceSet?: PieceSet | string;
}

/**
 * Props for FenDisplay component
 */
export interface FenDisplayProps {
  /** Current FEN string */
  fen: string;
  /** Callback when FEN is manually changed */
  onFenChange?: (newFen: string) => void;
  /** Whether the FEN is editable */
  editable?: boolean;
  /** Style for the input field */
  inputStyle?: StyleProp<TextStyle>;
  /** Style for the container */
  containerStyle?: StyleProp<ViewStyle>;
}

/**
 * Props for CastlingRightsTogglers component
 */
export interface CastlingRightsTogglersProps {
  /** Current castling rights string (e.g., 'KQkq') */
  castlingRights: string;
  /** Callback when castling rights change */
  onCastlingChange: (newCastlingRights: string) => void;
  /** Container style */
  containerStyle?: StyleProp<ViewStyle>;
  /** Style for individual toggles */
  toggleStyle?: StyleProp<ViewStyle>;
}

/**
 * Props for EnPassantInput component
 */
export interface EnPassantInputProps {
  /** Current en passant target square (e.g., 'e3' or '-') */
  enPassantSquare: string;
  /** Callback when en passant square changes */
  onEnPassantChange: (square: string) => void;
  /** Current FEN string for validation */
  fen?: string;
  /** Container style */
  containerStyle?: StyleProp<ViewStyle>;
  /** Input style */
  inputStyle?: StyleProp<TextStyle>;
}

/**
 * Props for TurnToggler component
 */
export interface TurnTogglerProps {
  /** Current turn ('w' or 'b') */
  turn: PieceColor;
  /** Callback when turn changes */
  onTurnChange: (newTurn: PieceColor) => void;
  /** Container style */
  containerStyle?: StyleProp<ViewStyle>;
  /** Style for toggle buttons */
  toggleStyle?: StyleProp<ViewStyle>;
}

/**
 * Props for FlipBoardButton component
 */
export interface FlipBoardButtonProps {
  /** Current flipped state */
  flipped: boolean;
  /** Callback when flip state changes */
  onFlipChange: (flipped: boolean) => void;
  /** Container style */
  containerStyle?: StyleProp<ViewStyle>;
  /** Button style */
  buttonStyle?: StyleProp<ViewStyle>;
  /** Variant: 'overlay' for floating button, 'inline' for panel */
  variant?: 'overlay' | 'inline';
}

/**
 * Props for EditorToolsPanel component
 */
export interface EditorToolsPanelProps {
  /** Panel title */
  title?: string;
  /** Whether the panel starts expanded */
  initialExpanded?: boolean;
  /** Render function for panel content */
  renderContent?: () => React.ReactNode;
  /** Container style */
  containerStyle?: StyleProp<ViewStyle>;
  /** Header style */
  headerStyle?: StyleProp<ViewStyle>;
  /** Content style */
  contentStyle?: StyleProp<ViewStyle>;
}

/**
 * UI configuration for BoardEditor
 */
export interface BoardEditorUIConfig {
  /** Layout for piece bank */
  bankLayout?: 'horizontal' | 'vertical';
  /** Whether to show FEN display */
  showFenDisplay?: boolean;
  /** Whether FEN display is editable */
  fenEditable?: boolean;
  /** Whether to show castling rights togglers */
  showCastlingRights?: boolean;
  /** Whether to show en passant input */
  showEnPassantInput?: boolean;
  /** Whether to show turn toggler */
  showTurnToggler?: boolean;
  /** Whether to show piece bank */
  showPieceBank?: boolean;
  /** Board orientation */
  flipped?: boolean;
  /** Whether to show editor tools panel */
  showEditorToolsPanel?: boolean;
  /** Initial expanded state for editor tools panel */
  editorToolsPanelExpanded?: boolean;
  /** Whether to show piece set selector */
  showPieceSetSelector?: boolean;
  /** Whether to show flip board button */
  showFlipBoardButton?: boolean;
  /** Where to show flip board button: 'overlay' for bottom-right corner of board, 'panel' for editor tools panel */
  flipBoardButtonLocation?: 'overlay' | 'panel';
}

/**
 * Props for unified BoardEditor component
 */
export interface BoardEditorProps {
  /** Initial FEN string (defaults to starting position) */
  initialFen?: string;
  /** Callback when FEN changes */
  onFenChange?: (newFen: string) => void;
  /** Main container style */
  containerStyle?: StyleProp<ViewStyle>;
  /** UI configuration */
  uiConfig?: BoardEditorUIConfig;
  /** Square size */
  squareSize?: number;
  /** Light square color */
  lightSquareColor?: string;
  /** Dark square color */
  darkSquareColor?: string;
  /** Custom render function for editor tools - return object with 'inPanel' and 'outside' content */
  renderEditorTools?: (defaultTools: DefaultEditorTools) => EditorToolsLayout;
  /** Initial piece set style (built-in or custom registered) */
  initialPieceSet?: PieceSet | string;
  /** Callback when piece set changes */
  onPieceSetChange?: (pieceSet: PieceSet | string) => void;
}
