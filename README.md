# react-native-chess-board-editor

[![npm version](https://img.shields.io/npm/v/react-native-chess-board-editor.svg)](https://www.npmjs.com/package/react-native-chess-board-editor)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A highly flexible and customizable React Native library for creating and editing chess board positions (FEN strings) without enforcing game rules. Perfect for building puzzle creators, position analysis tools, or chess setup utilities.

**[📚 Full Documentation](https://your-docs-site.com)** | **[🎮 Live Demo](https://your-demo-site.com)**

---

## ✨ Features

- **🎯 Intuitive Drag & Drop** - Smooth, native gesture handling powered by Reanimated 3
- **🎨 Fully Customizable** - Control colors, sizes, styles, and layouts
- **♟️ Multiple Piece Sets** - Includes alpha, cburnett, and merida piece sets, plus support for custom sets
- **🔧 Granular Components** - Use individual components or the unified `BoardEditor`
- **🎭 No Chess Rules** - Create any position, legal or illegal
- **📋 FEN Support** - Full FEN string editing and manipulation
- **⚡ TypeScript** - Complete type definitions included
- **🧪 Well Tested** - Comprehensive test coverage

---

## 📦 Installation

```bash
npm install react-native-chess-board-editor
```

or

```bash
yarn add react-native-chess-board-editor
```

### Peer Dependencies

This library requires the following peer dependencies:

```bash
npm install react-native-gesture-handler react-native-reanimated react-native-svg
```

Make sure to complete the setup for [react-native-gesture-handler](https://docs.swmansion.com/react-native-gesture-handler/docs/fundamentals/installation) and [react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/installation).

---

## 🚀 Quick Start

### Basic Usage

```tsx
import React, { useState } from 'react';
import { View } from 'react-native';
import { BoardEditor } from 'react-native-chess-board-editor';

export default function App() {
  const [fen, setFen] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <BoardEditor
        initialFen={fen}
        onFenChange={setFen}
      />
    </View>
  );
}
```

### Using Individual Components

```tsx
import React, { useState } from 'react';
import { View } from 'react-native';
import {
  EditableBoard,
  PieceBank,
  FenDisplay,
  TurnToggler,
  CastlingRightsTogglers,
} from 'react-native-chess-board-editor';

export default function CustomEditor() {
  const [fen, setFen] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');

  return (
    <View>
      <EditableBoard fen={fen} onFenChange={setFen} />
      <PieceBank />
      <FenDisplay fen={fen} onFenChange={setFen} editable />
      <TurnToggler turn="w" onTurnChange={(turn) => {/* handle */}} />
      <CastlingRightsTogglers castlingRights="KQkq" onCastlingChange={(rights) => {/* handle */}} />
    </View>
  );
}
```

---

## 🧩 Components

### Core Components

| Component | Description |
|-----------|-------------|
| `BoardEditor` | All-in-one component combining board, bank, and controls |
| `EditableBoard` | Interactive chess board with drag & drop |
| `PieceBank` | Piece palette for adding pieces to the board |
| `FenDisplay` | Display and edit FEN strings |

### Control Components

| Component | Description |
|-----------|-------------|
| `TurnToggler` | Switch between white and black to move |
| `CastlingRightsTogglers` | Toggle castling availability (K, Q, k, q) |
| `EnPassantInput` | Set en passant target square |
| `EditorToolsPanel` | Collection of editor utility buttons |
| `PieceSetSelector` | Switch between different piece set styles |
| `FlipBoardButton` | Rotate the board 180° |

### Utility Components

| Component | Description |
|-----------|-------------|
| `Piece` | Render individual chess pieces |
| `RankLabels` | Display rank labels (1-8) |
| `FileLabels` | Display file labels (a-h) |

---

## 🎨 Customization

### Theming

Use the `BoardThemeProvider` to customize board appearance:

```tsx
import { BoardThemeProvider } from 'react-native-chess-board-editor';

<BoardThemeProvider
  theme={{
    lightSquareColor: '#F0D9B5',
    darkSquareColor: '#B58863',
    squareSize: 45,
  }}
>
  <BoardEditor initialFen={fen} onFenChange={setFen} />
</BoardThemeProvider>
```

### Custom Piece Sets

Register and use custom piece renderers:

```tsx
import { registerCustomPieceSet, BoardEditor } from 'react-native-chess-board-editor';

registerCustomPieceSet('myCustomSet', {
  K: (props) => <MyWhiteKing {...props} />,
  Q: (props) => <MyWhiteQueen {...props} />,
  // ... other pieces
});

<BoardEditor pieceSet="myCustomSet" />
```

### Styling Props

All components accept standard React Native style props:

```tsx
<EditableBoard
  squareSize={50}
  lightSquareColor="#ECECEC"
  darkSquareColor="#769656"
  style={{ borderRadius: 8 }}
/>
```

---

## 📖 API Documentation

For detailed API documentation, prop references, and advanced usage examples, visit:

**[📚 https://your-docs-site.com](https://your-docs-site.com)**

---

## 🔧 Advanced Features

### FEN Utilities

The library exports utility functions for FEN manipulation:

```tsx
import { parseFen, updateFenField, validateFen } from 'react-native-chess-board-editor';

const fenParts = parseFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
const newFen = updateFenField(fen, 'turn', 'b');
const isValid = validateFen(fen);
```

### Custom Piece Filtering

Filter pieces shown in the PieceBank:

```tsx
import { PieceBank, whitePiecesOnly } from 'react-native-chess-board-editor';

<PieceBank pieceFilter={whitePiecesOnly} />
```

### Board Flipping

The board can be flipped to show from black's perspective:

```tsx
<EditableBoard fen={fen} onFenChange={setFen} flipped />
```

---

## 📋 Requirements

- React Native >= 0.64
- react-native-gesture-handler >= 2.0.0
- react-native-reanimated >= 3.0.0
- react-native-svg >= 13.0.0

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🔗 Links

- [Documentation](https://your-docs-site.com)
- [npm Package](https://www.npmjs.com/package/react-native-chess-board-editor)
- [GitHub Repository](https://github.com/YonchRibak/react-native-chess-board-editor)
- [Issue Tracker](https://github.com/YonchRibak/react-native-chess-board-editor/issues)

---

## 🙏 Acknowledgments

- Piece sets from [lichess.org](https://lichess.org)
- Built with [react-native-builder-bob](https://github.com/callstack/react-native-builder-bob)

---

Made with ❤️ for the React Native community
