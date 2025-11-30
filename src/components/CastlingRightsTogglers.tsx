import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import type { CastlingRightsTogglersProps } from '../types';
import { parseCastlingRights, castlingRightsToString } from '../utils/fen';

/**
 * CastlingRightsTogglers Component
 * Provides four independent toggles for castling rights (K, Q, k, q)
 */
export const CastlingRightsTogglers: React.FC<CastlingRightsTogglersProps> = ({
  castlingRights,
  onCastlingChange,
  containerStyle,
  toggleStyle,
}) => {
  const rights = parseCastlingRights(castlingRights);

  const handleToggle = (side: keyof typeof rights) => {
    const newRights = {
      ...rights,
      [side]: !rights[side],
    };
    const newCastlingString = castlingRightsToString(newRights);
    onCastlingChange(newCastlingString);
  };

  const renderCheckbox = (
    checked: boolean,
    label: string,
    side: keyof typeof rights,
    description: string
  ) => (
    <TouchableOpacity
      style={[styles.checkbox, toggleStyle]}
      onPress={() => handleToggle(side)}
      accessibilityLabel={description}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
    >
      <View style={[styles.checkboxBox, checked && styles.checkboxBoxChecked]}>
        {checked && <Text style={styles.checkmark}>✓</Text>}
      </View>
      <Text style={styles.checkboxLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>Castling Rights:</Text>
      <View style={styles.checkboxContainer}>
        <View style={styles.column}>
          <Text style={styles.columnLabel}>White</Text>
          {renderCheckbox(
            rights.whiteKingSide,
            'King-side (K)',
            'whiteKingSide',
            'White can castle king-side'
          )}
          {renderCheckbox(
            rights.whiteQueenSide,
            'Queen-side (Q)',
            'whiteQueenSide',
            'White can castle queen-side'
          )}
        </View>
        <View style={styles.column}>
          <Text style={styles.columnLabel}>Black</Text>
          {renderCheckbox(
            rights.blackKingSide,
            'King-side (k)',
            'blackKingSide',
            'Black can castle king-side'
          )}
          {renderCheckbox(
            rights.blackQueenSide,
            'Queen-side (q)',
            'blackQueenSide',
            'Black can castle queen-side'
          )}
        </View>
      </View>
      {castlingRights === '-' && (
        <Text style={styles.noneText}>No castling rights available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  checkboxContainer: {
    flexDirection: 'row',
    gap: 24,
  },
  column: {
    flex: 1,
  },
  columnLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 8,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  checkboxBox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  checkboxBoxChecked: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#333',
  },
  noneText: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    marginTop: 8,
  },
});
