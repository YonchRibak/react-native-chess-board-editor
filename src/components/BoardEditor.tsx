import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import type { BoardEditorProps, PieceSymbol } from '../types';
import { EditableBoard } from './EditableBoard';
import { PieceBank } from './PieceBank';
import { FenDisplay } from './FenDisplay';
import { EditorToolsPanel } from './EditorToolsPanel';
import { FlipBoardButton } from './FlipBoardButton';
import { DEFAULT_FEN } from '../utils';
import { DEFAULT_SQUARE_SIZE, DEFAULT_PIECE_SET, DEFAULT_LIGHT_SQUARE_COLOR, DEFAULT_DARK_SQUARE_COLOR } from '../constants';
import { useFenState } from '../hooks/useFenState';
import { useBoardLayout } from '../hooks/useBoardLayout';
import { usePieceSet } from '../hooks/usePieceSet';
import { calculateDropSquare } from '../utils/boardCoordinates';
import { buildEditorToolsLayout } from '../utils/editorToolsBuilder';
import { BoardThemeProvider } from '../contexts/BoardThemeContext';

/**
 * BoardEditor Component
 * Unified component that integrates all chess board editing functionality
 * Manages the single source of truth for the entire FEN state
 */
export const BoardEditor: React.FC<BoardEditorProps> = ({
  initialFen = DEFAULT_FEN,
  onFenChange,
  containerStyle,
  uiConfig = {},
  squareSize = DEFAULT_SQUARE_SIZE,
  lightSquareColor,
  darkSquareColor,
  renderEditorTools,
  initialPieceSet = DEFAULT_PIECE_SET,
  onPieceSetChange,
}) => {
  // Custom hooks
  const {
    fen,
    components,
    handleFenChange,
    handleCastlingChange,
    handleEnPassantChange,
    handleTurnChange,
    handlePieceUpdate,
  } = useFenState(initialFen, onFenChange);

  const { boardRef, boardLayout, handleBoardLayout } = useBoardLayout();

  const { pieceSet, handlePieceSetChange } = usePieceSet(initialPieceSet, onPieceSetChange);

  const {
    bankLayout = 'horizontal',
    showFenDisplay = true,
    fenEditable = true,
    showCastlingRights = true,
    showEnPassantInput = true,
    showTurnToggler = true,
    showPieceBank = true,
    flipped: initialFlipped = false,
    showEditorToolsPanel = true,
    editorToolsPanelExpanded = false,
    showPieceSetSelector = true,
    showFlipBoardButton = true,
    flipBoardButtonLocation = 'overlay',
  } = uiConfig;

  // Manage flipped state internally
  const [flipped, setFlipped] = useState(initialFlipped);

  const handlePieceDropFromBank = (piece: PieceSymbol, x: number, y: number) => {
    const square = calculateDropSquare(x, y, boardLayout, squareSize, flipped);
    if (square) {
      handlePieceUpdate(square, piece);
    }
  };

  // Build editor tools layout using utility
  const editorToolsLayout = buildEditorToolsLayout({
    showTurnToggler,
    showCastlingRights,
    showEnPassantInput,
    showPieceSetSelector,
    showFlipBoardButton,
    flipBoardButtonLocation,
    turn: components.activeColor,
    castlingRights: components.castlingAvailability,
    enPassantSquare: components.enPassantTarget,
    fen,
    pieceSet,
    flipped,
    onTurnChange: handleTurnChange,
    onCastlingChange: handleCastlingChange,
    onEnPassantChange: handleEnPassantChange,
    onPieceSetChange: handlePieceSetChange,
    onFlipChange: setFlipped,
    renderEditorTools,
  });

  // Create theme object for context
  const theme = {
    pieceSet,
    squareSize,
    lightSquareColor: lightSquareColor || DEFAULT_LIGHT_SQUARE_COLOR,
    darkSquareColor: darkSquareColor || DEFAULT_DARK_SQUARE_COLOR,
  };

  return (
    <BoardThemeProvider theme={theme}>
      <ScrollView
      style={[styles.container, containerStyle]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
        {/* Black Piece Bank - Above Board */}
        {showPieceBank && (
          <View style={styles.section}>
            <PieceBank
              layout={bankLayout}
              color="black"
              onPieceDropCoords={handlePieceDropFromBank}
            />
          </View>
        )}

        {/* Main Board */}
        <View
          ref={boardRef}
          style={styles.boardContainer}
          onLayout={handleBoardLayout}
        >
          <EditableBoard
            fen={fen}
            onFenChange={handleFenChange}
            flipped={flipped}
          />
        </View>

        {/* Flip Board Button - Between Board and White Piece Bank */}
        {showFlipBoardButton && flipBoardButtonLocation === 'overlay' && (
          <View style={styles.flipButtonContainer}>
            <FlipBoardButton
              flipped={flipped}
              onFlipChange={setFlipped}
              variant="overlay"
            />
          </View>
        )}

        {/* White Piece Bank - Below Board */}
        {showPieceBank && (
          <View style={styles.section}>
            <PieceBank
              layout={bankLayout}
              color="white"
              onPieceDropCoords={handlePieceDropFromBank}
            />
          </View>
        )}

        {/* FEN Display */}
        {showFenDisplay && (
          <View style={styles.section}>
            <FenDisplay
              fen={fen}
              onFenChange={handleFenChange}
              editable={fenEditable}
            />
          </View>
        )}

        {/* Editor Tools - Outside Panel (between FEN and panel) */}
        {showEditorToolsPanel && editorToolsLayout.outside && (
          <View style={styles.section}>
            {editorToolsLayout.outside}
          </View>
        )}

        {/* Editor Tools Panel */}
        {showEditorToolsPanel && (
          <View style={styles.section}>
            <EditorToolsPanel
              title="Editor Tools"
              initialExpanded={editorToolsPanelExpanded}
              renderContent={() => editorToolsLayout.inPanel}
            />
          </View>
        )}
      </ScrollView>
    </BoardThemeProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    alignItems: 'center',
  },
  boardContainer: {
    marginBottom: 8,
  },
  flipButtonContainer: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  section: {
    marginBottom: 16,
    width: '100%',
    maxWidth: 400,
  },
});
