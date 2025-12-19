import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import type { BoardEditorProps, PieceSymbol } from '../types';
import { EditableBoard } from './EditableBoard';
import { PieceBank } from './PieceBank';
import { FenDisplay } from './FenDisplay';
import { EditorToolsPanel } from './EditorToolsPanel';
import { DEFAULT_FEN } from '../utils';
import { DEFAULT_SQUARE_SIZE, DEFAULT_PIECE_SET } from '../constants';
import { useFenState } from '../hooks/useFenState';
import { useBoardLayout } from '../hooks/useBoardLayout';
import { usePieceSet } from '../hooks/usePieceSet';
import { calculateDropSquare } from '../utils/boardCoordinates';
import { buildEditorToolsLayout } from '../utils/editorToolsBuilder';

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
    flipped = false,
    showEditorToolsPanel = true,
    editorToolsPanelExpanded = false,
    showPieceSetSelector = true,
  } = uiConfig;

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
    turn: components.activeColor,
    castlingRights: components.castlingAvailability,
    enPassantSquare: components.enPassantTarget,
    fen,
    pieceSet,
    onTurnChange: handleTurnChange,
    onCastlingChange: handleCastlingChange,
    onEnPassantChange: handleEnPassantChange,
    onPieceSetChange: handlePieceSetChange,
    renderEditorTools,
  });

  return (
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
              pieceSize={squareSize * 0.7}
              color="black"
              showLabel={true}
              onPieceDropCoords={handlePieceDropFromBank}
              pieceSet={pieceSet}
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
            squareSize={squareSize}
            lightSquareColor={lightSquareColor}
            darkSquareColor={darkSquareColor}
            flipped={flipped}
            pieceSet={pieceSet}
          />
        </View>

        {/* White Piece Bank - Below Board */}
        {showPieceBank && (
          <View style={styles.section}>
            <PieceBank
              layout={bankLayout}
              pieceSize={squareSize * 0.7}
              color="white"
              showLabel={true}
              onPieceDropCoords={handlePieceDropFromBank}
              pieceSet={pieceSet}
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
    marginBottom: 20,
  },
  section: {
    marginBottom: 16,
    width: '100%',
    maxWidth: 400,
  },
});
