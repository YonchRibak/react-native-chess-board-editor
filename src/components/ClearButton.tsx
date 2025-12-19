import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';

export interface ClearButtonProps {
  onPress: () => void;
  visible?: boolean;
  style?: ViewStyle;
  accessibilityLabel?: string;
}

/**
 * ClearButton Component
 * A circular button with an 'x' icon for clearing input fields
 */
export const ClearButton: React.FC<ClearButtonProps> = ({
  onPress,
  visible = true,
  style,
  accessibilityLabel = 'Clear',
}) => {
  if (!visible) {
    return null;
  }

  return (
    <TouchableOpacity
      style={[styles.clearButton, style]}
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
    >
      <Text style={styles.clearButtonText}>×</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  clearButton: {
    marginLeft: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  clearButtonText: {
    fontSize: 24,
    color: '#666',
    lineHeight: 24,
  },
});
