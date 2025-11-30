import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import type { BoardEditorProps } from '../types';
import { EditableBoard } from './EditableBoard';
import { PieceBank } from './PieceBank';
import { FenDisplay } from './FenDisplay';
import { CastlingRightsTogglers } from './CastlingRightsTogglers';
import { EnPassantInput } from './EnPassantInput';
import { TurnToggler } from './TurnToggler';
import {
  DEFAULT_FEN,
  parseFen,
  updateCastlingRights,
  updateEnPassant,
  updateActiveColor,
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
  squareSize,
  lightSquareColor,
  darkSquareColor,
}) => {
  const [fen, setFen] = useState(initialFen);

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

  return (
    <ScrollView
      style={[styles.container, containerStyle]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Main Board */}
      <View style={styles.boardContainer}>
        <EditableBoard
          fen={fen}
          onFenChange={handleFenChange}
          squareSize={squareSize}
          lightSquareColor={lightSquareColor}
          darkSquareColor={darkSquareColor}
          flipped={flipped}
        />
      </View>

      {/* Piece Bank */}
      {showPieceBank && (
        <View style={styles.section}>
          <PieceBank
            layout={bankLayout}
            pieceSize={squareSize ? squareSize * 0.7 : undefined}
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
            />
          </View>
        )}
      </View>
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
    width: '100%',
    maxWidth: 600,
    marginBottom: 16,
  },
  controlsContainer: {
    width: '100%',
    maxWidth: 600,
  },
});
