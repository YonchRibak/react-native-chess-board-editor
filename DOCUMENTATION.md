# React Native Chess Board Editor - Documentation

A comprehensive React Native library for creating and editing chess board positions (FEN strings) without enforcing chess rules.

**Version:** 0.1.0
**License:** MIT

---

## Table of Contents

1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Quick Start](#quick-start)
4. [Core Concepts](#core-concepts)
5. [Components](#components)
6. [Utility Functions](#utility-functions)
7. [TypeScript Support](#typescript-support)
8. [Advanced Usage](#advanced-usage)
9. [Examples](#examples)
10. [API Reference](#api-reference)
11. [Contributing](#contributing)

---

## Introduction

`react-native-chess-board-editor` is a flexible React Native library designed for creating and editing chess positions using FEN (Forsyth-Edwards Notation) strings. Unlike traditional chess libraries, this one **does not enforce chess rules**, allowing you to create any arbitrary board position - perfect for:

- Chess puzzle creators
- Position analysis tools
- Chess training applications
- Board setup utilities
- Custom chess variants

### Key Features

✅ **No Rule Enforcement** - Create any position, including illegal ones
✅ **Drag-and-Drop Interface** - Intuitive gesture-based piece movement on board and from piece banks
✅ **Complete Component Suite** - 8 ready-to-use components
✅ **Smart FEN Management** - Automatic turn updates and validation
✅ **Full TypeScript Support** - Complete type definitions
✅ **Highly Customizable** - Style every aspect via props
✅ **Smooth Animations** - Powered by Reanimated for fluid interactions
✅ **Well Tested** - 200+ tests ensuring reliability

---

## Installation

### Install the Package

```bash
npm install react-native-chess-board-editor
# or
yarn add react-native-chess-board-editor
```

### Install Peer Dependencies

```bash
npm install react-native-gesture-handler react-native-reanimated react-native-svg
# or
yarn add react-native-gesture-handler react-native-reanimated react-native-svg
```

### Additional Setup for iOS

```bash
cd ios && pod install && cd ..
```

### Configure Reanimated

Add the Reanimated plugin to your `babel.config.js`:

```javascript
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: ['react-native-reanimated/plugin'], // Add this line
};
```

---

## Quick Start

### Basic Usage

```typescript
import React, { useState } from 'react';
import { View } from 'react-native';
import { BoardEditor, DEFAULT_FEN } from 'react-native-chess-board-editor';

export default function App() {
  const [fen, setFen] = useState(DEFAULT_FEN);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <BoardEditor
        initialFen={fen}
        onFenChange={(newFen) => {
          console.log('FEN changed:', newFen);
          setFen(newFen);
        }}
      />
    </View>
  );
}
```

That's it! You now have a fully functional chess board editor.

---

## Core Concepts

### FEN (Forsyth-Edwards Notation)

FEN is a standard notation for describing chess positions. A FEN string consists of 6 fields:

```
rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
```

1. **Piece Placement** - `rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR`
2. **Active Color** - `w` (white) or `b` (black)
3. **Castling Rights** - `KQkq` (K=white kingside, Q=white queenside, k=black kingside, q=black queenside)
4. **En Passant Square** - `e3` or `-` (target square for en passant)
5. **Halfmove Clock** - `0` (moves since last capture or pawn move)
6. **Fullmove Number** - `1` (increments after black's move)

### Piece Symbols

- **White Pieces**: `P` (pawn), `N` (knight), `B` (bishop), `R` (rook), `Q` (queen), `K` (king)
- **Black Pieces**: `p` (pawn), `n` (knight), `b` (bishop), `r` (rook), `q` (queen), `k` (king)

### Square Notation

Squares are represented using algebraic notation: `a1` to `h8`
- Files (columns): `a` through `h` (left to right)
- Ranks (rows): `1` through `8` (bottom to top from white's perspective)

---

## Components

### 1. BoardEditor (Unified Component)

The main component that integrates all functionality into a single, cohesive unit. Includes separate piece banks for white and black pieces positioned above and below the board.

```typescript
import { BoardEditor } from 'react-native-chess-board-editor';

<BoardEditor
  initialFen={DEFAULT_FEN}
  onFenChange={(newFen) => console.log(newFen)}
  squareSize={50}
  lightSquareColor="#F0D9B5"
  darkSquareColor="#B58863"
  uiConfig={{
    showFenDisplay: true,
    fenEditable: true,
    showCastlingRights: true,
    showEnPassantInput: true,
    showTurnToggler: true,
    showPieceBank: true,
    bankLayout: 'horizontal',
    flipped: false,
  }}
/>
```

**Layout:**
- Black piece bank (above the board)
- Editable chess board with drag-and-drop
- White piece bank (below the board)
- FEN display, controls, and settings

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialFen` | `string` | `DEFAULT_FEN` | Starting FEN position |
| `onFenChange` | `(fen: string) => void` | - | Callback when FEN changes |
| `containerStyle` | `StyleProp<ViewStyle>` | - | Container style |
| `uiConfig` | `BoardEditorUIConfig` | `{}` | UI configuration options |
| `squareSize` | `number` | `45` | Size of each square in pixels |
| `lightSquareColor` | `string` | `#F0D9B5` | Light square color |
| `darkSquareColor` | `string` | `#B58863` | Dark square color |

#### UI Configuration Options

```typescript
interface BoardEditorUIConfig {
  bankLayout?: 'horizontal' | 'vertical';  // Piece bank layout
  showFenDisplay?: boolean;                // Show FEN display
  fenEditable?: boolean;                   // Allow FEN editing
  showCastlingRights?: boolean;            // Show castling toggles
  showEnPassantInput?: boolean;            // Show en passant input
  showTurnToggler?: boolean;               // Show turn toggle
  showPieceBank?: boolean;                 // Show piece bank
  flipped?: boolean;                       // Flip board (black perspective)
}
```

---

### 2. EditableBoard

Interactive chess board with drag-and-drop functionality.

```typescript
import { EditableBoard } from 'react-native-chess-board-editor';

<EditableBoard
  fen={fen}
  onFenChange={setFen}
  squareSize={50}
  lightSquareColor="#F0D9B5"
  darkSquareColor="#B58863"
  flipped={false}
/>
```

#### Features

- **Drag and Drop** - Drag pieces to move them anywhere on the board
- **Smooth Animations** - Powered by React Native Reanimated for fluid gestures
- **Drop to Remove** - Drag pieces off the board to remove them
- **Visual Feedback** - Piece hides from source square during drag
- **Gesture Support** - Modern gesture handling with React Native Gesture Handler

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `fen` | `string` | Required | Current FEN position |
| `onFenChange` | `(fen: string) => void` | Required | Callback when position changes |
| `squareSize` | `number` | `45` | Square size in pixels |
| `lightSquareColor` | `string` | `#F0D9B5` | Light square color |
| `darkSquareColor` | `string` | `#B58863` | Dark square color |
| `pieceStyle` | `StyleProp<ViewStyle>` | - | Custom piece style |
| `boardStyle` | `StyleProp<ViewStyle>` | - | Board container style |
| `flipped` | `boolean` | `false` | Show from black's perspective |

---

### 3. PieceBank

Displays chess pieces as a draggable source for adding to the board.

```typescript
import { PieceBank } from 'react-native-chess-board-editor';

<PieceBank
  layout="horizontal"
  pieceSize={40}
  color="white"
  showLabel={true}
  onPieceDropCoords={(piece, x, y) => {
    console.log(`Piece ${piece} dropped at screen coordinates: ${x}, ${y}`);
  }}
/>
```

#### Features

- **Drag-and-Drop** - Drag pieces from the bank onto the board
- Shows all 12 pieces (6 white + 6 black) or filtered by color
- Non-destructive (pieces stay in bank after use)
- Smooth gesture-based dragging with visual feedback
- Horizontal or vertical layout
- Optional color filtering (white pieces only, black pieces only, or all)
- Labeled banks for easy identification

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `layout` | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout orientation |
| `bankStyle` | `StyleProp<ViewStyle>` | - | Container style |
| `pieceStyle` | `StyleProp<ViewStyle>` | - | Individual piece style |
| `pieceSize` | `number` | `45` | Piece size in pixels |
| `color` | `'white' \| 'black'` | - | Filter to show only white or black pieces |
| `showLabel` | `boolean` | `true` | Show label above pieces (e.g., "White Pieces") |
| `onPieceDropCoords` | `(piece: PieceSymbol, x: number, y: number) => void` | - | Callback when piece is dropped (receives screen coordinates) |

---

### 4. FenDisplay

Displays and optionally allows editing the FEN string.

```typescript
import { FenDisplay } from 'react-native-chess-board-editor';

<FenDisplay
  fen={fen}
  onFenChange={setFen}
  editable={true}
/>
```

#### Features

- Read-only or editable mode
- FEN validation with error messages
- Apply/Cancel buttons when editing
- Monospace font for clarity

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `fen` | `string` | Required | Current FEN string |
| `onFenChange` | `(fen: string) => void` | - | Callback when FEN is edited |
| `editable` | `boolean` | `false` | Enable editing |
| `inputStyle` | `StyleProp<TextStyle>` | - | Input field style |
| `containerStyle` | `StyleProp<ViewStyle>` | - | Container style |

---

### 5. TurnToggler

Toggle between white's turn and black's turn.

```typescript
import { TurnToggler } from 'react-native-chess-board-editor';

<TurnToggler
  turn="w"
  onTurnChange={(newTurn) => console.log(newTurn)}
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `turn` | `'w' \| 'b'` | Required | Current turn |
| `onTurnChange` | `(turn: 'w' \| 'b') => void` | Required | Callback when turn changes |
| `containerStyle` | `StyleProp<ViewStyle>` | - | Container style |
| `toggleStyle` | `StyleProp<ViewStyle>` | - | Toggle button style |

---

### 6. CastlingRightsTogglers

Four independent toggles for castling rights.

```typescript
import { CastlingRightsTogglers } from 'react-native-chess-board-editor';

<CastlingRightsTogglers
  castlingRights="KQkq"
  onCastlingChange={(rights) => console.log(rights)}
/>
```

#### Features

- White King-side (K)
- White Queen-side (Q)
- Black King-side (k)
- Black Queen-side (q)
- Shows "No castling rights" when all disabled

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `castlingRights` | `string` | Required | Castling string (e.g., 'KQkq') |
| `onCastlingChange` | `(rights: string) => void` | Required | Callback when rights change |
| `containerStyle` | `StyleProp<ViewStyle>` | - | Container style |
| `toggleStyle` | `StyleProp<ViewStyle>` | - | Individual toggle style |

---

### 7. EnPassantInput

Input field for en passant square with smart validation.

```typescript
import { EnPassantInput } from 'react-native-chess-board-editor';

<EnPassantInput
  enPassantSquare="e3"
  onEnPassantChange={(square) => console.log(square)}
/>
```

#### Features

- Format validation (rank 3 or 6 only)
- **Pawn position validation** - Checks if pawns are positioned correctly
- **Capturing pawn validation** - Ensures adjacent pawns exist
- Clear button
- Help text with valid squares

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `enPassantSquare` | `string` | Required | En passant square or '-' |
| `onEnPassantChange` | `(square: string) => void` | Required | Callback when square changes |
| `containerStyle` | `StyleProp<ViewStyle>` | - | Container style |
| `inputStyle` | `StyleProp<TextStyle>` | - | Input field style |

---

### 8. Piece

Basic component for rendering individual chess pieces.

```typescript
import { Piece } from 'react-native-chess-board-editor';

<Piece piece="K" size={50} />
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `piece` | `PieceSymbol` | Required | Piece to render (P, N, B, R, Q, K, p, n, b, r, q, k) |
| `size` | `number` | `40` | Piece size in pixels |
| `style` | `StyleProp<TextStyle>` | - | Custom style |

---

## Utility Functions

All utility functions are exported from the main package and can be used for custom FEN manipulation.

### Coordinate Conversion

```typescript
import {
  squareToCoords,
  coordsToSquare,
  fileToCol,
  colToFile,
  rankToRow,
  rowToRank,
} from 'react-native-chess-board-editor';

// Square to coordinates
const coords = squareToCoords('e4'); // { row: 4, col: 4 }

// Coordinates to square
const square = coordsToSquare({ row: 4, col: 4 }); // 'e4'

// File conversions
const col = fileToCol('e'); // 4
const file = colToFile(4); // 'e'

// Rank conversions
const row = rankToRow(5); // 3
const rank = rowToRank(3); // 5
```

### FEN Parsing and Conversion

```typescript
import {
  parseFen,
  componentsToFen,
  fenToBoardState,
  boardStateToFen,
} from 'react-native-chess-board-editor';

// Parse FEN into components
const components = parseFen(fen);
// Returns: {
//   piecePlacement: string,
//   activeColor: 'w' | 'b',
//   castlingAvailability: string,
//   enPassantTarget: string,
//   halfmoveClock: number,
//   fullmoveNumber: number
// }

// Build FEN from components
const fen = componentsToFen(components);

// Convert to 2D board array
const board = fenToBoardState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');
// Returns: (PieceSymbol | null)[][] (8x8 array)

// Convert board array to FEN piece placement
const placement = boardStateToFen(board);
```

### Piece Manipulation

```typescript
import {
  getPieceAt,
  updatePieceAt,
  movePiece,
} from 'react-native-chess-board-editor';

// Get piece at a square
const piece = getPieceAt(fen, 'e2'); // 'P' or null

// Update piece at a square
const newFen = updatePieceAt(fen, 'e4', 'P'); // Place white pawn on e4
const emptyFen = updatePieceAt(fen, 'e4', null); // Remove piece from e4

// Move a piece
const movedFen = movePiece(fen, 'e2', 'e4'); // Move piece from e2 to e4
```

### FEN Field Updates

```typescript
import {
  updateCastlingRights,
  updateEnPassant,
  updateActiveColor,
} from 'react-native-chess-board-editor';

// Update castling rights
const newFen = updateCastlingRights(fen, 'Kq');

// Update en passant square (auto-updates turn!)
const fenWithEP = updateEnPassant(fen, 'e3'); // Also sets turn to white
const fenWithEP2 = updateEnPassant(fen, 'e3', false); // Don't auto-update turn

// Update active color
const blackToMove = updateActiveColor(fen, 'b');
```

### Validation

```typescript
import {
  isValidFenStructure,
  isValidEnPassantSquare,
  isValidEnPassantSquareFormat,
  isValidSquare,
} from 'react-native-chess-board-editor';

// Validate FEN structure (format only, not chess rules)
const valid = isValidFenStructure(fen); // true/false

// Validate en passant with pawn context
const validEP = isValidEnPassantSquare(fen, 'e3'); // Checks pawn positions!

// Validate en passant format only
const validFormat = isValidEnPassantSquareFormat('e3'); // true (rank 3 or 6)

// Validate square notation
const validSquare = isValidSquare('e4'); // true
```

### Helper Functions

```typescript
import {
  parseCastlingRights,
  castlingRightsToString,
  getTurnFromEnPassant,
} from 'react-native-chess-board-editor';

// Parse castling rights
const rights = parseCastlingRights('KQkq');
// Returns: {
//   whiteKingSide: true,
//   whiteQueenSide: true,
//   blackKingSide: true,
//   blackQueenSide: true
// }

// Convert rights to string
const str = castlingRightsToString(rights); // 'KQkq'

// Get required turn from en passant square
const turn = getTurnFromEnPassant('e3'); // 'w' (white to move)
const turn2 = getTurnFromEnPassant('e6'); // 'b' (black to move)
```

### Constants

```typescript
import {
  DEFAULT_FEN,
  PIECE_SYMBOLS,
  WHITE_PIECES,
  BLACK_PIECES,
  ALL_PIECES_ORDERED,
  DEFAULT_SQUARE_SIZE,
  DEFAULT_LIGHT_SQUARE_COLOR,
  DEFAULT_DARK_SQUARE_COLOR,
  PIECE_UNICODE,
  PIECE_NAMES,
} from 'react-native-chess-board-editor';

// Default starting position
console.log(DEFAULT_FEN);
// 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

// All piece symbols
console.log(PIECE_SYMBOLS); // ['P', 'N', 'B', 'R', 'Q', 'K', 'p', 'n', 'b', 'r', 'q', 'k']

// Unicode symbols
console.log(PIECE_UNICODE.K); // '♔'
```

---

## TypeScript Support

The library is fully typed with TypeScript. All components and utilities have complete type definitions.

### Type Definitions

```typescript
import type {
  PieceSymbol,
  PieceColor,
  Square,
  BoardCoordinates,
  FenComponents,
  BoardState,
  CastlingRights,
  // Component Props
  BoardEditorProps,
  EditableBoardProps,
  PieceBankProps,
  FenDisplayProps,
  CastlingRightsTogglersProps,
  EnPassantInputProps,
  TurnTogglerProps,
} from 'react-native-chess-board-editor';
```

### Usage with TypeScript

```typescript
import React, { useState } from 'react';
import { BoardEditor, DEFAULT_FEN } from 'react-native-chess-board-editor';
import type { BoardEditorUIConfig } from 'react-native-chess-board-editor';

const App: React.FC = () => {
  const [fen, setFen] = useState<string>(DEFAULT_FEN);

  const uiConfig: BoardEditorUIConfig = {
    showFenDisplay: true,
    fenEditable: true,
    showPieceBank: true,
    bankLayout: 'horizontal',
  };

  const handleFenChange = (newFen: string): void => {
    console.log('FEN changed:', newFen);
    setFen(newFen);
  };

  return (
    <BoardEditor
      initialFen={fen}
      onFenChange={handleFenChange}
      uiConfig={uiConfig}
    />
  );
};
```

---

## Advanced Usage

### Drag-and-Drop Interaction

The library supports two types of drag-and-drop interactions:

#### 1. Board-to-Board Dragging

The `EditableBoard` component uses React Native Gesture Handler and Reanimated for smooth drag-and-drop interactions:

```typescript
import { EditableBoard } from 'react-native-chess-board-editor';

function DragDropExample() {
  const [fen, setFen] = useState(DEFAULT_FEN);

  return (
    <EditableBoard
      fen={fen}
      onFenChange={(newFen) => {
        console.log('Position changed:', newFen);
        setFen(newFen);
      }}
      squareSize={50}
    />
  );
}
```

**Board-to-Board Features:**
- Drag any piece to move it to a new square
- Drag a piece off the board to remove it
- Smooth animations during drag
- Visual feedback (piece hides from source square)
- Works seamlessly with touch gestures

#### 2. Bank-to-Board Dragging

The `BoardEditor` component integrates piece banks with the board, allowing you to drag pieces from the banks directly onto the board:

```typescript
import { BoardEditor } from 'react-native-chess-board-editor';

function EditorWithBanks() {
  const [fen, setFen] = useState(DEFAULT_FEN);

  return (
    <BoardEditor
      initialFen={fen}
      onFenChange={(newFen) => {
        console.log('Board updated:', newFen);
        setFen(newFen);
      }}
      uiConfig={{
        showPieceBank: true,  // Enable piece banks
        bankLayout: 'horizontal',
      }}
      squareSize={50}
    />
  );
}
```

**Bank-to-Board Features:**
- Drag pieces from white or black piece banks onto the board
- Non-destructive - pieces remain in bank after dragging
- Automatic coordinate translation from screen to board position
- Respects board orientation (flipped or normal)
- Drop pieces anywhere on the board to place them
- Pieces dropped outside board bounds are ignored

**How It Works:**

The system uses absolute screen coordinates during drag and translates them to board-relative positions on drop:

1. **Piece Bank** uses `absoluteX/absoluteY` from gesture events to track drag position
2. **Board Container** measures its absolute position using `View.measure()`
3. **Coordinate Translation** converts screen coordinates to board square coordinates
4. **Square Calculation** accounts for square size and board orientation (flipped/normal)

This architecture allows seamless dragging across different UI layouts and screen sizes.

### Custom Board Editor

Build your own custom editor using individual components:

```typescript
import React, { useState } from 'react';
import { View } from 'react-native';
import {
  EditableBoard,
  FenDisplay,
  TurnToggler,
  DEFAULT_FEN,
  parseFen,
  updateActiveColor,
} from 'react-native-chess-board-editor';

function CustomEditor() {
  const [fen, setFen] = useState(DEFAULT_FEN);
  const components = parseFen(fen);

  const handleTurnChange = (turn: 'w' | 'b') => {
    const newFen = updateActiveColor(fen, turn);
    setFen(newFen);
  };

  return (
    <View>
      <EditableBoard fen={fen} onFenChange={setFen} />
      <TurnToggler
        turn={components.activeColor}
        onTurnChange={handleTurnChange}
      />
      <FenDisplay fen={fen} editable={false} />
    </View>
  );
}
```

### Programmatic Position Setup

```typescript
import {
  DEFAULT_FEN,
  updatePieceAt,
  updateCastlingRights,
  updateEnPassant,
} from 'react-native-chess-board-editor';

// Start with empty board
let fen = '8/8/8/8/8/8/8/8 w - - 0 1';

// Add pieces programmatically
fen = updatePieceAt(fen, 'e1', 'K'); // White king
fen = updatePieceAt(fen, 'e8', 'k'); // Black king
fen = updatePieceAt(fen, 'e2', 'P'); // White pawn
fen = updatePieceAt(fen, 'e7', 'p'); // Black pawn

// Set castling rights
fen = updateCastlingRights(fen, 'KQkq');

// Set up en passant
fen = updateEnPassant(fen, 'e3'); // Auto-updates turn to white
```

### Analyzing Positions

```typescript
import { parseFen, fenToBoardState } from 'react-native-chess-board-editor';

function analyzePosition(fen: string) {
  const components = parseFen(fen);
  const board = fenToBoardState(components.piecePlacement);

  let pieceCount = { white: 0, black: 0 };

  board.forEach((rank) => {
    rank.forEach((piece) => {
      if (piece) {
        if (piece === piece.toUpperCase()) {
          pieceCount.white++;
        } else {
          pieceCount.black++;
        }
      }
    });
  });

  console.log('White pieces:', pieceCount.white);
  console.log('Black pieces:', pieceCount.black);
  console.log('Turn:', components.activeColor === 'w' ? 'White' : 'Black');
  console.log('Castling:', components.castlingAvailability);
}
```

### Custom Styling

```typescript
import { BoardEditor } from 'react-native-chess-board-editor';

<BoardEditor
  initialFen={DEFAULT_FEN}
  onFenChange={setFen}
  squareSize={60}
  lightSquareColor="#FFFFCC"
  darkSquareColor="#CC9966"
  containerStyle={{
    backgroundColor: '#f0f0f0',
    padding: 20,
    borderRadius: 10,
  }}
  uiConfig={{
    showPieceBank: true,
    bankLayout: 'vertical',
  }}
/>
```

### Using Separate Piece Banks with Drag-and-Drop

The `BoardEditor` component includes separate piece banks for white and black pieces with integrated drag-and-drop. To create a custom layout with draggable piece banks:

```typescript
import React, { useState, useRef } from 'react';
import { View } from 'react-native';
import {
  PieceBank,
  EditableBoard,
  updatePieceAt,
  coordsToSquare,
} from 'react-native-chess-board-editor';

function CustomLayoutWithDrag() {
  const [fen, setFen] = useState(DEFAULT_FEN);
  const boardRef = useRef<View>(null);
  const [boardLayout, setBoardLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const squareSize = 50;

  const handleBoardLayout = () => {
    boardRef.current?.measure((x, y, width, height, pageX, pageY) => {
      setBoardLayout({ x: pageX, y: pageY, width, height });
    });
  };

  const handlePieceDrop = (piece: PieceSymbol, x: number, y: number) => {
    // Convert screen coordinates to board-relative coordinates
    const relativeX = x - boardLayout.x;
    const relativeY = y - boardLayout.y;

    // Check if dropped within board bounds
    if (
      relativeX >= 0 &&
      relativeY >= 0 &&
      relativeX < boardLayout.width &&
      relativeY < boardLayout.height
    ) {
      // Calculate square coordinates
      const col = Math.floor(relativeX / squareSize);
      const row = Math.floor(relativeY / squareSize);

      if (row >= 0 && row < 8 && col >= 0 && col < 8) {
        const square = coordsToSquare({ row, col });
        const newFen = updatePieceAt(fen, square, piece);
        setFen(newFen);
      }
    }
  };

  return (
    <View style={{ padding: 20 }}>
      {/* Black pieces at top with drag-and-drop */}
      <PieceBank
        color="black"
        layout="horizontal"
        showLabel={true}
        onPieceDropCoords={handlePieceDrop}
      />

      {/* Chess board with position tracking */}
      <View ref={boardRef} onLayout={handleBoardLayout}>
        <EditableBoard
          fen={fen}
          onFenChange={setFen}
          squareSize={squareSize}
        />
      </View>

      {/* White pieces at bottom with drag-and-drop */}
      <PieceBank
        color="white"
        layout="horizontal"
        showLabel={true}
        onPieceDropCoords={handlePieceDrop}
      />
    </View>
  );
}
```

**Important Notes:**
- The board container needs a `ref` and `onLayout` handler to track its screen position
- The `onPieceDropCoords` callback receives absolute screen coordinates
- You must translate screen coordinates to board-relative coordinates
- Account for board orientation if using `flipped` prop

---

## Technical Notes

### Drag-and-Drop Implementation

The drag-and-drop functionality is built using React Native Gesture Handler 2.x and Reanimated 3.x for optimal performance:

```typescript
// Modern Gesture API
const panGesture = Gesture.Pan()
  .onStart(() => { /* ... */ })
  .onUpdate((event) => { /* ... */ })
  .onEnd((event) => { /* ... */ });
```

**Key Implementation Details:**

1. **Shared Values**: Uses `useSharedValue` for smooth animations without re-renders
2. **Gesture Detection**: `GestureDetector` wraps each draggable piece
3. **Visual Feedback**: Pieces use `opacity: 0` when dragged (not unmounted) to prevent React Hooks violations
4. **Floating Piece**: A separate `Animated.View` shows the dragged piece following your finger
5. **Drop Detection**: Calculates target square from coordinates

**Two Coordinate Systems:**

The library uses different coordinate systems for board-to-board vs bank-to-board dragging:

1. **Board-to-Board** (EditableBoard):
   - Uses relative coordinates within the board
   - Calculates initial position: `col * squareSize`, `row * squareSize`
   - Updates position with translation deltas: `startX + translationX`
   - Drops based on board-relative coordinates

2. **Bank-to-Board** (PieceBank):
   - Uses absolute screen coordinates: `event.absoluteX`, `event.absoluteY`
   - Tracks global position during drag
   - BoardEditor translates to board-relative coordinates on drop
   - Enables dragging across different UI containers

**Performance Considerations:**

- All gesture calculations run on the UI thread via Reanimated
- No JavaScript bridge crossing during drag gestures
- Smooth 60fps animations on most devices
- Coordinate translations are lightweight calculations

### React Hooks Compliance

The library follows React's Rules of Hooks strictly. All components maintain consistent hook call orders to prevent "Rendered more hooks than during the previous render" errors:

**Key Implementation Strategies:**

1. **All 64 Squares Always Render `DraggablePiece`**: Even empty squares render the component (with `piece: null`) to keep hook counts constant across renders.

2. **Pieces Hidden with Opacity**: When dragged, pieces use `opacity: 0` instead of being unmounted, maintaining their hooks in the component tree.

3. **Floating Piece Container Always Rendered**: The dragged piece overlay (`Animated.View`) is always present in the DOM, controlled by `opacity: draggingPiece ? 1 : 0` rather than conditional rendering.

4. **Gestures Disabled for Empty Squares**: The `.enabled(!!piece)` modifier prevents interaction without changing hook count.

This architecture ensures:
- Hook count remains constant: **65 components** (64 squares + 1 floating piece)
- Each component calls hooks in the same order every render
- No components mount/unmount during drag operations
- Smooth performance without React violations

### TypeScript Type Safety

All components and utilities are fully typed:

```typescript
// All piece symbols are strictly typed
type PieceSymbol = 'P' | 'N' | 'B' | 'R' | 'Q' | 'K' | 'p' | 'n' | 'b' | 'r' | 'q' | 'k';

// Board state is a 2D array with strict null checking
type BoardState = (PieceSymbol | null)[][];
```

---

## Troubleshooting

### Common Issues and Solutions

#### 1. App Crashes on Piece Drag

**Error**: "Rendered more hooks than during the previous render"

**Root Cause**: This error occurs when React components conditionally render child components that use hooks, causing the total number of hook calls to change between renders.

**Solution**: This has been fixed in version 0.1.0+ through a careful architecture:
- All 64 board squares always render `DraggablePiece` (even when empty)
- The floating dragged piece overlay is always rendered (controlled by opacity)
- Components are hidden with `opacity: 0` instead of being unmounted

Ensure you're using the latest version:

```bash
npm update react-native-chess-board-editor
# or
yarn upgrade react-native-chess-board-editor
```

**Technical Details**: The library maintains exactly **65 `Animated.View` components** (64 squares + 1 floating piece) at all times, ensuring consistent hook counts across all renders.

#### 2. Gestures Not Working

**Error**: Pieces don't respond to touch/drag

**Solution**: Make sure you've configured Reanimated's Babel plugin:

```javascript
// babel.config.js
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: ['react-native-reanimated/plugin'], // Must be last!
};
```

**Important**: The Reanimated plugin must be the **last** item in the plugins array.

After adding, clear Metro cache and rebuild:

```bash
# Clear Metro cache
npx react-native start --reset-cache

# iOS
cd ios && pod install && cd ..
npx react-native run-ios

# Android
npx react-native run-android
```

#### 3. Pieces Render as Boxes/Symbols

**Error**: Chess pieces show as Unicode boxes instead of proper symbols

**Solution**: Ensure your font supports chess Unicode characters. Most system fonts do, but if you see boxes:

```typescript
import { Text } from 'react-native';

// Add a fallback font
<BoardEditor
  pieceStyle={{
    fontFamily: Platform.select({
      ios: 'System',
      android: 'sans-serif',
    }),
  }}
/>
```

#### 4. TypeScript Errors

**Error**: Type errors when using components

**Solution**: Make sure you're importing types correctly:

```typescript
// ✅ Correct
import { BoardEditor } from 'react-native-chess-board-editor';
import type { BoardEditorUIConfig } from 'react-native-chess-board-editor';

// ❌ Incorrect
import { BoardEditorUIConfig } from 'react-native-chess-board-editor';
```

#### 5. FEN Validation Fails

**Error**: Valid FEN string rejected as invalid

**Solution**: Ensure your FEN string has all 6 components:

```typescript
// ✅ Valid FEN (6 components)
'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

// ❌ Invalid FEN (missing components)
'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR'
```

Use the validation utility:

```typescript
import { isValidFenStructure } from 'react-native-chess-board-editor';

if (!isValidFenStructure(fen)) {
  console.error('Invalid FEN:', fen);
}
```

#### 6. En Passant Square Not Updating Turn

**Issue**: Setting en passant doesn't auto-update the turn

**Solution**: By default, `updateEnPassant` auto-updates the turn. If you don't want this:

```typescript
// Auto-update turn (default)
const newFen = updateEnPassant(fen, 'e3'); // Sets turn to 'w'

// Don't auto-update turn
const newFen = updateEnPassant(fen, 'e3', false); // Keeps existing turn
```

#### 7. Performance Issues on Android

**Issue**: Laggy animations on Android devices

**Solution**:

1. Enable Hermes engine in `android/app/build.gradle`:
   ```gradle
   project.ext.react = [
       enableHermes: true
   ]
   ```

2. Reduce square size for lower-end devices:
   ```typescript
   <BoardEditor squareSize={40} /> // Instead of 50+
   ```

3. Disable animations if needed:
   ```typescript
   // In your babel.config.js, you can disable some animations
   // for debugging performance issues
   ```

### Debug Mode

To enable verbose logging for debugging:

```typescript
import { parseFen, updatePieceAt } from 'react-native-chess-board-editor';

const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

// Log FEN components
console.log('FEN Components:', parseFen(fen));

// Log each piece operation
const newFen = updatePieceAt(fen, 'e4', 'P');
console.log('Before:', fen);
console.log('After:', newFen);
```

### Getting Help

If you encounter issues not covered here:

1. **Check the tests**: See `src/__tests__/` for usage examples
2. **GitHub Issues**: Search existing issues or create a new one
3. **Version**: Ensure you're using the latest version

```bash
npm list react-native-chess-board-editor
```

---

## Examples

### Example 1: Puzzle Creator

```typescript
import React, { useState } from 'react';
import { View, Button } from 'react-native';
import { BoardEditor, DEFAULT_FEN } from 'react-native-chess-board-editor';

function PuzzleCreator() {
  const [fen, setFen] = useState(DEFAULT_FEN);
  const [savedPuzzles, setSavedPuzzles] = useState<string[]>([]);

  const savePuzzle = () => {
    setSavedPuzzles([...savedPuzzles, fen]);
    console.log('Puzzle saved:', fen);
  };

  return (
    <View>
      <BoardEditor initialFen={fen} onFenChange={setFen} />
      <Button title="Save Puzzle" onPress={savePuzzle} />
    </View>
  );
}
```

### Example 2: Position Analyzer

```typescript
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import {
  EditableBoard,
  FenDisplay,
  parseFen,
  fenToBoardState,
} from 'react-native-chess-board-editor';

function PositionAnalyzer() {
  const [fen, setFen] = useState(DEFAULT_FEN);

  const countPieces = () => {
    const board = fenToBoardState(parseFen(fen).piecePlacement);
    let count = 0;
    board.forEach((rank) =>
      rank.forEach((piece) => {
        if (piece) count++;
      })
    );
    return count;
  };

  return (
    <View>
      <EditableBoard fen={fen} onFenChange={setFen} />
      <Text>Total pieces: {countPieces()}</Text>
      <FenDisplay fen={fen} editable={true} onFenChange={setFen} />
    </View>
  );
}
```

### Example 3: Training Mode

```typescript
import React, { useState } from 'react';
import { View, Button, Alert } from 'react-native';
import { BoardEditor } from 'react-native-chess-board-editor';

const PUZZLES = [
  'r1bqkb1r/pppp1ppp/2n2n2/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4',
  'rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2',
];

function TrainingMode() {
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [userFen, setUserFen] = useState(PUZZLES[0]);

  const checkSolution = () => {
    // Your solution checking logic here
    Alert.alert('Solution', 'Checking your answer...');
  };

  const nextPuzzle = () => {
    const next = (currentPuzzle + 1) % PUZZLES.length;
    setCurrentPuzzle(next);
    setUserFen(PUZZLES[next]);
  };

  return (
    <View>
      <BoardEditor initialFen={userFen} onFenChange={setUserFen} />
      <Button title="Check Solution" onPress={checkSolution} />
      <Button title="Next Puzzle" onPress={nextPuzzle} />
    </View>
  );
}
```

---

## API Reference

### Complete Type Definitions

```typescript
// Piece and Board Types
type PieceSymbol = 'P' | 'N' | 'B' | 'R' | 'Q' | 'K' | 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
type PieceColor = 'w' | 'b';
type Square = string; // e.g., 'e4'
type BoardState = (PieceSymbol | null)[][];

interface BoardCoordinates {
  row: number;
  col: number;
}

interface FenComponents {
  piecePlacement: string;
  activeColor: PieceColor;
  castlingAvailability: string;
  enPassantTarget: string;
  halfmoveClock: number;
  fullmoveNumber: number;
}

interface CastlingRights {
  whiteKingSide: boolean;
  whiteQueenSide: boolean;
  blackKingSide: boolean;
  blackQueenSide: boolean;
}
```

### Function Signatures

```typescript
// Coordinate Conversion
function squareToCoords(square: Square): BoardCoordinates;
function coordsToSquare(coords: BoardCoordinates): Square;
function fileToCol(file: string): number;
function colToFile(col: number): string;
function rankToRow(rank: number): number;
function rowToRank(row: number): number;

// FEN Parsing
function parseFen(fen: string): FenComponents;
function componentsToFen(components: FenComponents): string;
function fenToBoardState(piecePlacement: string): BoardState;
function boardStateToFen(board: BoardState): string;

// Piece Manipulation
function getPieceAt(fen: string, square: Square): PieceSymbol | null;
function updatePieceAt(fen: string, square: Square, piece: PieceSymbol | null): string;
function movePiece(fen: string, from: Square, to: Square): string;

// FEN Updates
function updateCastlingRights(fen: string, castlingRights: string): string;
function updateEnPassant(fen: string, enPassantSquare: string, autoUpdateTurn?: boolean): string;
function updateActiveColor(fen: string, color: PieceColor): string;

// Validation
function isValidFenStructure(fen: string): boolean;
function isValidEnPassantSquare(fen: string, enPassantSquare: string): boolean;
function isValidEnPassantSquareFormat(square: string): boolean;
function isValidSquare(square: string): boolean;

// Helpers
function parseCastlingRights(castlingString: string): CastlingRights;
function castlingRightsToString(rights: CastlingRights): string;
function getTurnFromEnPassant(enPassantSquare: string): PieceColor;
```

---

## Contributing

We welcome contributions! Please see our [GitHub repository](https://github.com/yourusername/react-native-chess-board-editor) for:

- Bug reports
- Feature requests
- Pull requests
- Documentation improvements

### Development Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/react-native-chess-board-editor.git
cd react-native-chess-board-editor

# Install dependencies
npm install

# Run tests
npm test

# Build
npm run prepare
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- fen.test.ts
```

---

## License

MIT © [Your Name]

---

## Support

- **Documentation**: [GitHub](https://github.com/yourusername/react-native-chess-board-editor)
- **Issues**: [GitHub Issues](https://github.com/yourusername/react-native-chess-board-editor/issues)
- **NPM**: [react-native-chess-board-editor](https://www.npmjs.com/package/react-native-chess-board-editor)

---

**Built with ❤️ for the React Native community**
