# `react-native-chess-board-editor`

A highly flexible React Native library dedicated solely to creating and editing chess board positions (FEN strings) without enforcing game rules. This library provides individual, reusable components for every part of FEN editing, along with a unified `BoardEditor` component.

---

## 🚀 Project Overview

The goal of this library is to provide a complete, standalone component suite for chess board editing in React Native applications, suitable for use in puzzle creators, analysis tools, or setup utilities.

The library **must not** enforce the rules of chess; it should allow users to create any arbitrary and illegal board position.

### Core Dependencies

* **React Native Reanimated & React Native Gesture Handler:** Essential for smooth, performant native drag-and-drop functionality.
* **`chess.js` (or similar):** To parse, validate (structurally, not legally), and serialize FEN strings.

---

## 🧩 Components

All components must be highly customizable via standard React Native `style` props or dedicated UI props (e.g., `color`, `gap`).

### 1. `EditableBoard`

The central component for piece manipulation.

* **Functionality:**
    * Renders a standard 8x8 chess board.
    * Displays pieces based on the current FEN state.
    * Supports **free drag-and-drop** of pieces between squares.
    * **Drag Off Board:** When a piece is dragged outside the board boundaries and dropped, it is removed from the FEN.
* **Props:**
    * `fen`: The current FEN string (required).
    * `onFenChange`: Callback function `(newFen: string) => void` triggered after any successful piece manipulation (drag-and-drop, removal, or addition).
    * `squareSize`: Numeric size of a single square.
    * `lightSquareColor`, `darkSquareColor`: Colors for the squares.
    * `pieceStyle`: Style object applied to all chess pieces.

### 2. `PieceBank`

A source for adding new pieces to the board.

* **Functionality:**
    * Displays one of each standard piece (White: P, B, N, R, Q, K; Black: p, b, n, r, q, k).
    * Allows dragging any piece **onto** the `EditableBoard`.
    * **Non-Destructive:** The source piece remains in the bank after being dragged.
* **Props:**
    * `onPieceDrop`: Callback function `(piece: PieceSymbol, targetSquare: Square) => void` (must be integrated with `EditableBoard` logic via the parent `BoardEditor`).
    * `layout`: 'horizontal' or 'vertical' arrangement for the pieces.
    * `bankStyle`: Style object for the bank container.
    * `pieceStyle`: Style object for the individual pieces in the bank.

### 3. `FenDisplay`

Component for viewing and manually editing the FEN string.

* **Functionality:**
    * Always displays the current FEN.
    * When the `editable` prop is true, it renders a text input field for manual FEN entry.
* **Props:**
    * `fen`: The current FEN string (required).
    * `onFenChange`: Callback function `(newFen: string) => void` triggered when a user manually submits a new FEN string.
    * `editable`: Boolean to enable/disable the text input field.
    * `inputStyle`: Style object for the text input.

---

## ⚙️ FEN Modifier Components

These smaller components manage the remaining five fields of the FEN (excluding piece placement).

### 4. `CastlingRightsTogglers`

* **Functionality:** Provides four independent toggles (checkboxes or similar):
    * White King-side (`K`)
    * White Queen-side (`Q`)
    * Black King-side (`k`)
    * Black Queen-side (`q`)
* **Props:**
    * `castlingRights`: The current castling rights string (e.g., `'KQkq'`).
    * `onCastlingChange`: Callback function `(newCastlingRights: string) => void`.

### 5. `EnPassantInput`

* **Functionality:** A text input for specifying the en passant target square (e.g., `e3` or `b6`).
* **FEN Rule Constraint:** The input square must be a valid en passant target (i.e., it must be on the 3rd rank for black or 6th rank for white). The component should only pass a valid square (e.g., `e3`) or a hyphen (`-`) to the callback.
* **Props:**
    * `enPassantSquare`: The current en passant target square (e.g., `'a3'` or `'-'`).
    * `onEnPassantChange`: Callback function `(square: string) => void`.

### 6. `TurnToggler`

* **Functionality:** A simple toggle (or radio button) to switch between White's move (`w`) and Black's move (`b`).
* **Props:**
    * `turn`: The current side to move (`'w'` or `'b'`).
    * `onTurnChange`: Callback function `(newTurn: 'w' | 'b') => void`.

---

## 👑 The Unified Component

### 7. `BoardEditor`

This component integrates all the above components into a single, cohesive, and functional unit.

* **Functionality:**
    * Manages the single source of truth for the entire FEN state.
    * Renders the `EditableBoard`, `PieceBank`, `FenDisplay`, and all FEN modifier components (`CastlingRightsTogglers`, `EnPassantInput`, `TurnToggler`).
    * Passes the current FEN and change handlers to all child components, ensuring seamless synchronization. For example, changing the `TurnToggler` immediately updates the FEN, which is then reflected in the `FenDisplay`.
* **Props:**
    * `initialFen`: The starting FEN string (optional, defaults to standard starting position).
    * `onFenChange`: Master callback for any change in the FEN.
    * `containerStyle`: Style object for the main component wrapper.
    * `uiConfig`: An object to allow fine-grained styling and layout adjustments (e.g., `bankLayout: 'horizontal'`, `showFenDisplay: true`).

**The implementation focus for the AI should be on state management and correctly combining the updates from all individual components into a final, valid FEN string.**