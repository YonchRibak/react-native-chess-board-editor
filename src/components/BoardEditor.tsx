import React, { useState, useRef } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import type { BoardEditorProps, PieceSymbol } from '../types';
import { EditableBoard } from './EditableBoard';
import { PieceBank } from './PieceBank';
import { FenDisplay } from './FenDisplay';
import { CastlingRightsTogglers } from './CastlingRightsTogglers';
import { EnPassantInput } from './EnPassantInput';
import { TurnToggler } from './TurnToggler';
import {
  DEFAULT_FEN,
  DEFAULT_SQUARE_SIZE,
  parseFen,
  updateCastlingRights,
  updateEnPassant,
  updateActiveColor,
  updatePieceAt,
  coordsToSquare,
} from '../utils';

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
}) => {
  const [fen, setFen] = useState(initialFen);
  const boardRef = useRef<View>(null);
  const [boardLayout, setBoardLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const {
    bankLayout = 'horizontal',
    showFenDisplay = true,
    fenEditable = true,
    showCastlingRights = true,
    showEnPassantInput = true,
    showTurnToggler = true,
    showPieceBank = true,
    flipped = false,
  } = uiConfig;

  const components = parseFen(fen);

  const handleFenChange = (newFen: string) => {
    setFen(newFen);
    onFenChange?.(newFen);
  };

  const handleCastlingChange = (castlingRights: string) => {
    const newFen = updateCastlingRights(fen, castlingRights);
    handleFenChange(newFen);
  };

  const handleEnPassantChange = (enPassantSquare: string) => {
    // Auto-update turn when en passant changes
    const newFen = updateEnPassant(fen, enPassantSquare, true);
    handleFenChange(newFen);
  };

  const handleTurnChange = (turn: 'w' | 'b') => {
    const newFen = updateActiveColor(fen, turn);
    handleFenChange(newFen);
  };

  const handlePieceDropFromBank = (piece: PieceSymbol, x: number, y: number) => {
    // Board has a 2px border, account for it
    const BOARD_BORDER_WIDTH = 2;

    // Calculate which square on the board the piece was dropped on
    // Convert to board-relative coordinates
    const relativeX = x - boardLayout.x - BOARD_BORDER_WIDTH;
    const relativeY = y - boardLayout.y - BOARD_BORDER_WIDTH;

    const boardInnerWidth = boardLayout.width - (BOARD_BORDER_WIDTH * 2);
    const boardInnerHeight = boardLayout.height - (BOARD_BORDER_WIDTH * 2);

    // Check if dropped within board bounds
    if (
      relativeX >= 0 &&
      relativeY >= 0 &&
      relativeX < boardInnerWidth &&
      relativeY < boardInnerHeight
    ) {
      // Calculate square coordinates
      // No need to center here - the drop position is already the touch point
      const col = Math.floor(relativeX / squareSize);
      const row = Math.floor(relativeY / squareSize);

      // Account for flipped board
      const displayRow = flipped ? 7 - row : row;
      const displayCol = flipped ? 7 - col : col;

      // Check if within valid board range
      if (displayRow >= 0 && displayRow < 8 && displayCol >= 0 && displayCol < 8) {
        const square = coordsToSquare({ row: displayRow, col: displayCol });
        const newFen = updatePieceAt(fen, square, piece);
        handleFenChange(newFen);
      }
    }
  };

  const handleBoardLayout = () => {
    boardRef.current?.measure((x, y, width, height, pageX, pageY) => {
      setBoardLayout({ x: pageX, y: pageY, width, height });
    });
  };

  return (
    <ScrollView
      style={[styles.container, containerStyle]}
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      <ScrollView
        style={styles.verticalScroll}
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

        {/* Controls Section */}
        <View style={styles.controlsContainer}>
          {/* Turn Toggler */}
          {showTurnToggler && (
            <View style={styles.section}>
              <TurnToggler
                turn={components.activeColor}
                onTurnChange={handleTurnChange}
              />
            </View>
          )}

          {/* Castling Rights */}
          {showCastlingRights && (
            <View style={styles.section}>
              <CastlingRightsTogglers
                castlingRights={components.castlingAvailability}
                onCastlingChange={handleCastlingChange}
              />
            </View>
          )}

          {/* En Passant Input */}
          {showEnPassantInput && (
            <View style={styles.section}>
              <EnPassantInput
                enPassantSquare={components.enPassantTarget}
                onEnPassantChange={handleEnPassantChange}
                fen={fen}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  verticalScroll: {
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
    minWidth: 300,
  },
  controlsContainer: {
    minWidth: 300,
  },
});
