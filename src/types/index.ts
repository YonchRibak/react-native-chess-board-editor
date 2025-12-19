import type { StyleProp, ViewStyle, TextStyle } from 'react-native';

/**
 * Chess piece symbols
 * Uppercase = White pieces, Lowercase = Black pieces
 */
export type PieceSymbol = 'P' | 'N' | 'B' | 'R' | 'Q' | 'K' | 'p' | 'n' | 'b' | 'r' | 'q' | 'k';

/**
 * Chess piece colors
 */
export type PieceColor = 'w' | 'b';

/**
 * Chess square notation (e.g., 'a1', 'h8')
 */
export type Square = string;

/**
 * Board coordinates (0-7 for both row and column)
 */
export interface BoardCoordinates {
  row: number;
  col: number;
}

/**
 * Piece placement on a square
 */
export interface PiecePlacement {
  square: Square;
  piece: PieceSymbol | null;
}

/**
 * Complete FEN string components
 */
export interface FenComponents {
  /** Piece placement (e.g., 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR') */
  piecePlacement: string;
  /** Active color (w or b) */
  activeColor: PieceColor;
  /** Castling availability (e.g., 'KQkq' or '-') */
  castlingAvailability: string;
  /** En passant target square (e.g., 'e3' or '-') */
  enPassantTarget: string;
  /** Halfmove clock (number of halfmoves since last capture or pawn move) */
  halfmoveClock: number;
  /** Fullmove number (starts at 1, incremented after Black's move) */
  fullmoveNumber: number;
}

/**
 * Board state as 2D array
 */
export type BoardState = (PieceSymbol | null)[][];

/**
 * Castling rights individual flags
 */
export interface CastlingRights {
  whiteKingSide: boolean;
  whiteQueenSide: boolean;
  blackKingSide: boolean;
  blackQueenSide: boolean;
}

/**
 * Drag event data
 */
export interface DragEventData {
  piece: PieceSymbol;
  sourceSquare: Square | null; // null if from PieceBank
  targetSquare: Square | null; // null if dropped outside board
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
  /** Piece size */
  pieceSize?: number;
  /** Color filter - show only white, black, or all pieces */
  color?: 'white' | 'black';
  /** Whether to show the label above the pieces */
  showLabel?: boolean;
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
}
