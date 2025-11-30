import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import type { TurnTogglerProps } from '../types';

/**
 * TurnToggler Component
 * Allows toggling between White's turn (w) and Black's turn (b)
 */
export const TurnToggler: React.FC<TurnTogglerProps> = ({
  turn,
  onTurnChange,
  containerStyle,
  toggleStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>Turn:</Text>
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggle,
            turn === 'w' && styles.toggleActive,
            toggleStyle,
          ]}
          onPress={() => onTurnChange('w')}
          accessibilityLabel="White to move"
          accessibilityRole="radio"
          accessibilityState={{ checked: turn === 'w' }}
        >
          <Text
            style={[
              styles.toggleText,
              turn === 'w' && styles.toggleTextActive,
            ]}
          >
            White
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.toggle,
            turn === 'b' && styles.toggleActive,
            toggleStyle,
          ]}
          onPress={() => onTurnChange('b')}
          accessibilityLabel="Black to move"
          accessibilityRole="radio"
          accessibilityState={{ checked: turn === 'b' }}
        >
          <Text
            style={[
              styles.toggleText,
              turn === 'b' && styles.toggleTextActive,
            ]}
          >
            Black
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 12,
    color: '#333',
  },
  toggleContainer: {
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  toggle: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f5f5f5',
    minWidth: 80,
    alignItems: 'center',
  },
  toggleActive: {
    backgroundColor: '#007AFF',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  toggleTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
});
