import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import type { PieceSet } from '../types';
import { PIECE_SETS } from '../utils/constants';
import { Piece } from './Piece';

export interface PieceSetSelectorProps {
  /** Currently selected piece set */
  selectedPieceSet: PieceSet;
  /** Callback when piece set changes */
  onPieceSetChange: (pieceSet: PieceSet) => void;
  /** Container style */
  containerStyle?: StyleProp<ViewStyle>;
  /** Whether to show the label */
  showLabel?: boolean;
}

/**
 * PieceSetSelector Component
 * Allows users to select different chess piece styles using king piece previews
 */
export const PieceSetSelector: React.FC<PieceSetSelectorProps> = ({
  selectedPieceSet,
  onPieceSetChange,
  containerStyle,
  showLabel = true,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {showLabel && <Text style={styles.label}>Piece Style</Text>}
      <View style={styles.optionsContainer}>
        {PIECE_SETS.map((pieceSet) => {
          const isSelected = pieceSet.id === selectedPieceSet;
          return (
            <TouchableOpacity
              key={pieceSet.id}
              style={[
                styles.option,
                isSelected && styles.optionSelected,
              ]}
              onPress={() => onPieceSetChange(pieceSet.id)}
            >
              <Piece piece="K" size={40} pieceSet={pieceSet.id} />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  option: {
    width: 56,
    height: 56,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionSelected: {
    borderColor: '#2196F3',
    backgroundColor: '#E3F2FD',
  },
});
