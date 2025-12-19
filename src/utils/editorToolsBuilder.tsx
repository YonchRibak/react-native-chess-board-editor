import React from 'react';
import { View, StyleSheet } from 'react-native';
import type { DefaultEditorTools, EditorToolsLayout, PieceSet } from '../types';
import { TurnToggler } from '../components/TurnToggler';
import { CastlingRightsTogglers } from '../components/CastlingRightsTogglers';
import { EnPassantInput } from '../components/EnPassantInput';
import { PieceSetSelector } from '../components/PieceSetSelector';

export interface EditorToolsConfig {
  showTurnToggler: boolean;
  showCastlingRights: boolean;
  showEnPassantInput: boolean;
  showPieceSetSelector: boolean;
  turn: 'w' | 'b';
  castlingRights: string;
  enPassantSquare: string;
  fen: string;
  pieceSet: PieceSet | string;
  onTurnChange: (turn: 'w' | 'b') => void;
  onCastlingChange: (castlingRights: string) => void;
  onEnPassantChange: (enPassantSquare: string) => void;
  onPieceSetChange: (pieceSet: PieceSet | string) => void;
}

export interface BuildEditorToolsOptions extends EditorToolsConfig {
  renderEditorTools?: (defaultTools: DefaultEditorTools) => EditorToolsLayout;
}

/**
 * Build the default editor tools components
 */
export const buildDefaultEditorTools = (config: EditorToolsConfig): DefaultEditorTools => {
  return {
    turnToggler: config.showTurnToggler ? (
      <View style={styles.toolSection} key="turn-toggler">
        <TurnToggler
          turn={config.turn}
          onTurnChange={config.onTurnChange}
        />
      </View>
    ) : null,
    castlingRights: config.showCastlingRights ? (
      <View style={styles.toolSection} key="castling-rights">
        <CastlingRightsTogglers
          castlingRights={config.castlingRights}
          onCastlingChange={config.onCastlingChange}
        />
      </View>
    ) : null,
    enPassantInput: config.showEnPassantInput ? (
      <View style={styles.toolSection} key="enpassant-input">
        <EnPassantInput
          enPassantSquare={config.enPassantSquare}
          onEnPassantChange={config.onEnPassantChange}
          fen={config.fen}
        />
      </View>
    ) : null,
  };
};

/**
 * Build the complete editor tools layout
 * Uses custom renderer if provided, otherwise returns default layout
 */
export const buildEditorToolsLayout = (options: BuildEditorToolsOptions): EditorToolsLayout => {
  const defaultTools = buildDefaultEditorTools(options);

  if (options.renderEditorTools) {
    // Developer provided custom render function
    return options.renderEditorTools(defaultTools);
  }

  // Default: all tools in panel (including piece set selector), nothing outside
  return {
    inPanel: (
      <>
        {options.showPieceSetSelector && (
          <View style={styles.toolSection} key="piece-set-selector">
            <PieceSetSelector
              selectedPieceSet={options.pieceSet}
              onPieceSetChange={options.onPieceSetChange}
            />
          </View>
        )}
        {defaultTools.turnToggler}
        {defaultTools.castlingRights}
        {defaultTools.enPassantInput}
      </>
    ),
  };
};

const styles = StyleSheet.create({
  toolSection: {
    marginBottom: 8,
  },
});
