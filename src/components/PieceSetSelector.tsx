import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import type { PieceSet } from '../types';
import { getAvailablePieceSets } from '../utils/pieceRendererRegistry';
import { Piece } from './Piece';

export interface PieceSetSelectorProps {
  /** Currently selected piece set */
  selectedPieceSet: PieceSet | string;
  /** Callback when piece set changes */
  onPieceSetChange: (pieceSet: PieceSet | string) => void;
  /** Container style */
  containerStyle?: StyleProp<ViewStyle>;
  /** Whether to show the label */
  showLabel?: boolean;
  /**
   * Optional filter for which piece sets to show
   * If not provided, shows all registered piece sets
   * @example ['cburnett', 'alpha', 'myCustomSet']
   */
  availableSets?: string[];
}

/**
 * PieceSetSelector Component
 * Allows users to select different chess piece styles using king piece previews
 * Automatically includes all registered piece sets (built-in and custom)
 */
export const PieceSetSelector: React.FC<PieceSetSelectorProps> = ({
  selectedPieceSet,
  onPieceSetChange,
  containerStyle,
  showLabel = true,
  availableSets,
}) => {
  // Get piece sets to display
  const displayedPieceSets = useMemo(() => {
    const allPieceSets = getAvailablePieceSets();

    // If availableSets filter is provided, use it
    if (availableSets) {
      return availableSets.filter(set => allPieceSets.includes(set));
    }

    // Otherwise show all registered piece sets
    return allPieceSets;
  }, [availableSets]);

  return (
    <View style={[styles.container, containerStyle]}>
      {showLabel && <Text style={styles.label}>Piece Style</Text>}
      <View style={styles.optionsContainer}>
        {displayedPieceSets.map((pieceSetId) => {
          const isSelected = pieceSetId === selectedPieceSet;
          return (
            <TouchableOpacity
              key={pieceSetId}
              style={[
                styles.option,
                isSelected && styles.optionSelected,
              ]}
              onPress={() => onPieceSetChange(pieceSetId)}
              accessibilityLabel={`Select ${pieceSetId} piece set`}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
            >
              <Piece piece="K" size={40} pieceSet={pieceSetId} />
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
