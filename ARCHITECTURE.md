# Architecture Documentation

## Project Structure

```
react-native-chess-board-editor/
├── src/
│   ├── components/          # React components
│   │   ├── Piece.tsx       # Basic piece rendering component
│   │   ├── EditableBoard.tsx
│   │   ├── PieceBank.tsx
│   │   ├── FenDisplay.tsx
│   │   ├── CastlingRightsTogglers.tsx
│   │   ├── EnPassantInput.tsx
│   │   ├── TurnToggler.tsx
│   │   └── BoardEditor.tsx  # Unified component
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/              # Utility functions
│   │   ├── fen.ts         # FEN parsing and manipulation
│   │   ├── constants.ts   # Constants and defaults
│   │   └── index.ts
│   └── index.tsx          # Main library export
├── example/               # Example app (to be created)
└── lib/                  # Built output (generated)
```

## Core Architecture Principles

### 1. **No Chess Rules Enforcement**
The library allows any arbitrary board position, including illegal positions:
- Multiple kings
- Pawns on first/eighth rank
- Any piece combinations

### 2. **Single Source of Truth**
- FEN string is the single source of truth for board state
- All component updates flow through FEN modifications
- BoardEditor maintains master FEN state

### 3. **Component Independence**
Each component can work standalone:
- EditableBoard can be used without PieceBank
- FenDisplay can be used independently
- All FEN modifier components are independent

### 4. **Callback-Driven Updates**
```typescript
Component -> onFenChange(newFen) -> Parent updates state -> Re-render
```

## FEN String Structure

A FEN string consists of 6 fields separated by spaces:

```
rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
└─────────────────┬──────────────────────┘ │ └┬─┘ │ │ │
        Piece Placement                    │  │   │ │ │
                                    Active │  │   │ │ │
                                    Color ─┘  │   │ │ │
                                     Castling ┘   │ │ │
                                     En Passant ──┘ │ │
                                     Halfmove ──────┘ │
                                     Fullmove ────────┘
```

## Utility Functions

### FEN Utilities (`src/utils/fen.ts`)

#### Parsing & Conversion
- `parseFen(fen)` - Parse FEN into components
- `componentsToFen(components)` - Build FEN from components
- `fenToBoardState(placement)` - Convert FEN to 2D array
- `boardStateToFen(board)` - Convert 2D array to FEN

#### Coordinate Conversion
- `squareToCoords(square)` - 'e4' → {row: 4, col: 4}
- `coordsToSquare(coords)` - {row: 4, col: 4} → 'e4'
- `fileToCol(file)` - 'e' → 4
- `colToFile(col)` - 4 → 'e'
- `rankToRow(rank)` - 4 → 4
- `rowToRank(row)` - 4 → 4

#### Piece Manipulation
- `getPieceAt(fen, square)` - Get piece at square
- `updatePieceAt(fen, square, piece)` - Update piece at square
- `movePiece(fen, from, to)` - Move piece from square to square

#### FEN Field Updates
- `updateCastlingRights(fen, rights)` - Update castling
- `updateEnPassant(fen, square)` - Update en passant
- `updateActiveColor(fen, color)` - Update turn

#### Validation
- `isValidFenStructure(fen)` - Validate FEN format
- `isValidEnPassantSquare(square)` - Validate en passant square
- `isValidSquare(square)` - Validate square notation

## Component Data Flow

### BoardEditor (Orchestrator)
```typescript
BoardEditor State: fen = "..."

├─> EditableBoard
│   ├─ Props: fen, onFenChange
│   └─ User drags piece → onFenChange(newFen) → Update state
│
├─> PieceBank
│   ├─ Props: onPieceDrop
│   └─ User drags piece to board → onPieceDrop → Update FEN
│
├─> FenDisplay
│   ├─ Props: fen, onFenChange
│   └─ User edits FEN → onFenChange(newFen) → Update state
│
├─> CastlingRightsTogglers
│   ├─ Props: castlingRights, onCastlingChange
│   └─ User toggles → onCastlingChange → updateCastlingRights(fen)
│
├─> EnPassantInput
│   ├─ Props: enPassantSquare, onEnPassantChange
│   └─ User inputs → onEnPassantChange → updateEnPassant(fen)
│
└─> TurnToggler
    ├─ Props: turn, onTurnChange
    └─ User toggles → onTurnChange → updateActiveColor(fen)
```

## Drag-and-Drop Implementation Strategy

Using React Native Gesture Handler + Reanimated:

### EditableBoard
1. Each square is a drop zone
2. Each piece is draggable
3. Track drag position with Animated.Value
4. On drop:
   - Check if dropped on valid square → move piece
   - Check if dropped outside board → remove piece
   - Update FEN via callback

### PieceBank
1. Each piece is draggable (non-destructive)
2. Clone piece on drag start
3. On drop over EditableBoard → add piece to target square
4. Source piece remains in bank

### Implementation Notes
- Use `PanGestureHandler` for drag detection
- Use `useAnimatedGestureHandler` for performance
- Use `useSharedValue` for animated positions
- Track global coordinates for drop detection

## State Management

### Local Component State
Each component manages its own UI state (e.g., drag position, input focus)

### FEN State (Lifted to BoardEditor)
BoardEditor maintains:
```typescript
const [fen, setFen] = useState(initialFen);

// On any change from child components:
const handleFenChange = (newFen: string) => {
  setFen(newFen);
  onFenChange?.(newFen); // Notify parent if needed
};
```

### Props Flow
- **Down**: FEN and derived values (parsed components)
- **Up**: Callbacks to update FEN

## Performance Considerations

1. **Memoization**: Use React.memo for components that re-render frequently
2. **Reanimated**: All animations on UI thread
3. **Lazy Updates**: Update FEN only on drag end, not during drag
4. **Virtual DOM**: Only re-render changed squares/pieces

## Extension Points

### Custom Piece Rendering
Replace the `Piece` component with custom SVG/image rendering:
```typescript
import { Piece } from './CustomPiece';
```

### Custom Themes
Pass colors via props:
```typescript
<BoardEditor
  lightSquareColor="#FFFFFF"
  darkSquareColor="#000000"
/>
```

### Custom Layouts
Use `uiConfig` to show/hide components:
```typescript
<BoardEditor
  uiConfig={{
    showPieceBank: false,
    showFenDisplay: true,
    bankLayout: 'vertical',
  }}
/>
```

## Testing Strategy

1. **Unit Tests**: Test FEN utility functions
2. **Component Tests**: Test individual components with React Native Testing Library
3. **Integration Tests**: Test BoardEditor with all child components
4. **Snapshot Tests**: Ensure UI consistency

## Future Enhancements

1. **SVG Pieces**: Higher quality piece rendering
2. **Touch Feedback**: Haptic feedback on drag/drop
3. **Undo/Redo**: FEN history management
4. **Import/Export**: Load positions from PGN
5. **Annotations**: Arrows and highlights on board
