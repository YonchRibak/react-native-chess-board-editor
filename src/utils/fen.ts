import type {
  PieceSymbol,
  PieceColor,
  Square,
  FenComponents,
  BoardState,
  CastlingRights,
  BoardCoordinates,
} from '../types';

/**
 * Default starting position FEN
 */
export const DEFAULT_FEN =
  'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

/**
 * All valid piece symbols
 */
export const PIECE_SYMBOLS: PieceSymbol[] = [
  'P',
  'N',
  'B',
  'R',
  'Q',
  'K',
  'p',
  'n',
  'b',
  'r',
  'q',
  'k',
];

/**
 * Convert file letter to column index (a=0, h=7)
 */
export function fileToCol(file: string): number {
  return file.charCodeAt(0) - 'a'.charCodeAt(0);
}

/**
 * Convert column index to file letter (0=a, 7=h)
 */
export function colToFile(col: number): string {
  return String.fromCharCode('a'.charCodeAt(0) + col);
}

/**
 * Convert rank number to row index (1=7, 8=0) - inverted because row 0 is rank 8
 */
export function rankToRow(rank: number): number {
  return 8 - rank;
}

/**
 * Convert row index to rank number (0=8, 7=1)
 */
export function rowToRank(row: number): number {
  return 8 - row;
}

/**
 * Convert square notation to board coordinates
 * @param square - Square in algebraic notation (e.g., 'e4')
 * @returns Board coordinates {row, col}
 */
export function squareToCoords(square: Square): BoardCoordinates {
  const file = square[0];
  const rank = parseInt(square[1], 10);
  return {
    row: rankToRow(rank),
    col: fileToCol(file),
  };
}

/**
 * Convert board coordinates to square notation
 * @param coords - Board coordinates {row, col}
 * @returns Square in algebraic notation (e.g., 'e4')
 */
export function coordsToSquare(coords: BoardCoordinates): Square {
  return colToFile(coords.col) + rowToRank(coords.row);
}

/**
 * Parse a FEN string into its components
 * @param fen - FEN string to parse
 * @returns Parsed FEN components
 */
export function parseFen(fen: string): FenComponents {
  const parts = fen.trim().split(/\s+/);

  return {
    piecePlacement: parts[0] || '',
    activeColor: (parts[1] || 'w') as PieceColor,
    castlingAvailability: parts[2] || '-',
    enPassantTarget: parts[3] || '-',
    halfmoveClock: parseInt(parts[4] || '0', 10),
    fullmoveNumber: parseInt(parts[5] || '1', 10),
  };
}

/**
 * Convert FEN components back to a FEN string
 * @param components - FEN components
 * @returns Complete FEN string
 */
export function componentsToFen(components: FenComponents): string {
  return [
    components.piecePlacement,
    components.activeColor,
    components.castlingAvailability,
    components.enPassantTarget,
    components.halfmoveClock.toString(),
    components.fullmoveNumber.toString(),
  ].join(' ');
}

/**
 * Convert FEN piece placement to 2D board array
 * @param piecePlacement - Piece placement string from FEN
 * @returns 2D array representing the board (8x8)
 */
export function fenToBoardState(piecePlacement: string): BoardState {
  const board: BoardState = Array(8)
    .fill(null)
    .map(() => Array(8).fill(null));

  const ranks = piecePlacement.split('/');

  ranks.forEach((rank, rowIndex) => {
    let colIndex = 0;
    for (const char of rank) {
      if (/\d/.test(char)) {
        // Number indicates empty squares
        colIndex += parseInt(char, 10);
      } else {
        // Letter indicates a piece
        board[rowIndex][colIndex] = char as PieceSymbol;
        colIndex++;
      }
    }
  });

  return board;
}

/**
 * Convert 2D board array to FEN piece placement string
 * @param board - 2D array representing the board
 * @returns FEN piece placement string
 */
export function boardStateToFen(board: BoardState): string {
  const ranks: string[] = [];

  for (let row = 0; row < 8; row++) {
    let rankStr = '';
    let emptyCount = 0;

    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];

      if (piece === null) {
        emptyCount++;
      } else {
        if (emptyCount > 0) {
          rankStr += emptyCount.toString();
          emptyCount = 0;
        }
        rankStr += piece;
      }
    }

    // Add remaining empty squares
    if (emptyCount > 0) {
      rankStr += emptyCount.toString();
    }

    ranks.push(rankStr);
  }

  return ranks.join('/');
}

/**
 * Get piece at a specific square
 * @param fen - FEN string
 * @param square - Square to check
 * @returns Piece symbol or null if empty
 */
export function getPieceAt(fen: string, square: Square): PieceSymbol | null {
  const components = parseFen(fen);
  const board = fenToBoardState(components.piecePlacement);
  const coords = squareToCoords(square);
  return board[coords.row][coords.col];
}

/**
 * Update a piece at a specific square
 * @param fen - Current FEN string
 * @param square - Square to update
 * @param piece - Piece to place (null to remove)
 * @returns Updated FEN string
 */
export function updatePieceAt(
  fen: string,
  square: Square,
  piece: PieceSymbol | null
): string {
  const components = parseFen(fen);
  const board = fenToBoardState(components.piecePlacement);
  const coords = squareToCoords(square);

  board[coords.row][coords.col] = piece;

  components.piecePlacement = boardStateToFen(board);
  return componentsToFen(components);
}

/**
 * Move a piece from one square to another
 * @param fen - Current FEN string
 * @param from - Source square
 * @param to - Target square
 * @returns Updated FEN string
 */
export function movePiece(fen: string, from: Square, to: Square): string {
  const piece = getPieceAt(fen, from);
  if (!piece) {
    return fen; // No piece to move
  }

  // Remove from source
  let newFen = updatePieceAt(fen, from, null);
  // Add to target
  newFen = updatePieceAt(newFen, to, piece);

  return newFen;
}

/**
 * Parse castling rights string into individual flags
 * @param castlingString - Castling availability string (e.g., 'KQkq')
 * @returns Object with individual castling rights
 */
export function parseCastlingRights(castlingString: string): CastlingRights {
  return {
    whiteKingSide: castlingString.includes('K'),
    whiteQueenSide: castlingString.includes('Q'),
    blackKingSide: castlingString.includes('k'),
    blackQueenSide: castlingString.includes('q'),
  };
}

/**
 * Convert castling rights object to string
 * @param rights - Castling rights object
 * @returns Castling string (e.g., 'KQkq' or '-')
 */
export function castlingRightsToString(rights: CastlingRights): string {
  let str = '';
  if (rights.whiteKingSide) str += 'K';
  if (rights.whiteQueenSide) str += 'Q';
  if (rights.blackKingSide) str += 'k';
  if (rights.blackQueenSide) str += 'q';
  return str || '-';
}

/**
 * Update castling rights in FEN
 * @param fen - Current FEN string
 * @param castlingRights - New castling rights string
 * @returns Updated FEN string
 */
export function updateCastlingRights(
  fen: string,
  castlingRights: string
): string {
  const components = parseFen(fen);
  components.castlingAvailability = castlingRights || '-';
  return componentsToFen(components);
}

/**
 * Update en passant target square in FEN
 * @param fen - Current FEN string
 * @param enPassantSquare - New en passant square (or '-')
 * @param autoUpdateTurn - Whether to automatically update the turn based on en passant (default: true)
 * @returns Updated FEN string
 */
export function updateEnPassant(
  fen: string,
  enPassantSquare: string,
  autoUpdateTurn: boolean = true
): string {
  const components = parseFen(fen);
  components.enPassantTarget = enPassantSquare || '-';

  // Automatically set the turn based on en passant square
  if (autoUpdateTurn && enPassantSquare !== '-') {
    components.activeColor = getTurnFromEnPassant(enPassantSquare);
  }

  return componentsToFen(components);
}

/**
 * Update active color (turn) in FEN
 * @param fen - Current FEN string
 * @param color - New active color
 * @returns Updated FEN string
 */
export function updateActiveColor(fen: string, color: PieceColor): string {
  const components = parseFen(fen);
  components.activeColor = color;
  return componentsToFen(components);
}

/**
 * Validate en passant square format (must be on rank 3 or 6)
 * @param square - Square to validate
 * @returns True if valid en passant square format
 */
export function isValidEnPassantSquareFormat(square: string): boolean {
  if (square === '-') {
    return true;
  }

  if (square.length !== 2) {
    return false;
  }

  const file = square[0];
  const rank = square[1];

  // Must be a-h and rank 3 or 6
  return /[a-h]/.test(file) && (rank === '3' || rank === '6');
}

/**
 * Validate en passant square with board context (checks pawn positioning)
 * @param fen - Current FEN string
 * @param enPassantSquare - En passant square to validate
 * @returns True if valid en passant square with proper pawn setup
 */
export function isValidEnPassantSquare(
  fen: string,
  enPassantSquare: string
): boolean {
  if (enPassantSquare === '-') {
    return true;
  }

  // First check format
  if (!isValidEnPassantSquareFormat(enPassantSquare)) {
    return false;
  }

  const components = parseFen(fen);
  const board = fenToBoardState(components.piecePlacement);
  const epCoords = squareToCoords(enPassantSquare);
  const file = enPassantSquare[0];
  const rank = parseInt(enPassantSquare[1], 10);

  // Rank 3 means black just moved (white to play), rank 6 means white just moved (black to play)
  if (rank === 3) {
    // Black pawn should be on rank 4 (row 4)
    const blackPawnRow = 4;
    const blackPawnCol = fileToCol(file);
    const blackPawn = board[blackPawnRow][blackPawnCol];

    if (blackPawn !== 'p') {
      return false; // No black pawn at expected position
    }

    // Check for white pawns on adjacent files on rank 4
    const hasWhitePawnLeft =
      blackPawnCol > 0 && board[blackPawnRow][blackPawnCol - 1] === 'P';
    const hasWhitePawnRight =
      blackPawnCol < 7 && board[blackPawnRow][blackPawnCol + 1] === 'P';

    return hasWhitePawnLeft || hasWhitePawnRight;
  } else if (rank === 6) {
    // White pawn should be on rank 5 (row 3)
    const whitePawnRow = 3;
    const whitePawnCol = fileToCol(file);
    const whitePawn = board[whitePawnRow][whitePawnCol];

    if (whitePawn !== 'P') {
      return false; // No white pawn at expected position
    }

    // Check for black pawns on adjacent files on rank 5
    const hasBlackPawnLeft =
      whitePawnCol > 0 && board[whitePawnRow][whitePawnCol - 1] === 'p';
    const hasBlackPawnRight =
      whitePawnCol < 7 && board[whitePawnRow][whitePawnCol + 1] === 'p';

    return hasBlackPawnLeft || hasBlackPawnRight;
  }

  return false;
}

/**
 * Get the required turn based on en passant square
 * @param enPassantSquare - En passant square
 * @returns Required active color
 */
export function getTurnFromEnPassant(enPassantSquare: string): PieceColor {
  if (enPassantSquare === '-') {
    return 'w'; // Default to white
  }

  const rank = enPassantSquare[1];
  // Rank 3 = black just moved, so white to play
  // Rank 6 = white just moved, so black to play
  return rank === '3' ? 'w' : 'b';
}

/**
 * Validate FEN structure (not chess rules, just format)
 * @param fen - FEN string to validate
 * @returns True if FEN structure is valid
 */
export function isValidFenStructure(fen: string): boolean {
  try {
    const parts = fen.trim().split(/\s+/);

    if (parts.length !== 6) {
      return false;
    }

    // Validate piece placement
    const ranks = parts[0].split('/');
    if (ranks.length !== 8) {
      return false;
    }

    for (const rank of ranks) {
      let sum = 0;
      for (const char of rank) {
        if (/\d/.test(char)) {
          sum += parseInt(char, 10);
        } else if (PIECE_SYMBOLS.includes(char as PieceSymbol)) {
          sum += 1;
        } else {
          return false; // Invalid character
        }
      }
      if (sum !== 8) {
        return false; // Rank doesn't sum to 8
      }
    }

    // Validate active color
    if (parts[1] !== 'w' && parts[1] !== 'b') {
      return false;
    }

    // Validate castling (allow any combination of KQkq or -)
    if (!/^(-|[KQkq]{1,4})$/.test(parts[2])) {
      return false;
    }

    // Validate en passant format
    if (!isValidEnPassantSquareFormat(parts[3])) {
      return false;
    }

    // Validate halfmove and fullmove clocks
    if (isNaN(parseInt(parts[4], 10)) || isNaN(parseInt(parts[5], 10))) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Check if a square is valid (a1-h8)
 * @param square - Square to check
 * @returns True if square is valid
 */
export function isValidSquare(square: string): boolean {
  return /^[a-h][1-8]$/.test(square);
}
