import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';

export interface CopyButtonProps {
  onPress: () => void;
  copied?: boolean;
  style?: ViewStyle;
  accessibilityLabel?: string;
  variant?: 'inside' | 'standalone';
}

/**
 * CopyButton Component
 * A button for copying content to clipboard
 * Shows a checkmark when content is copied
 */
export const CopyButton: React.FC<CopyButtonProps> = ({
  onPress,
  copied = false,
  style,
  accessibilityLabel = 'Copy to clipboard',
  variant = 'inside',
}) => {
  return (
    <TouchableOpacity
      style={[
        variant === 'inside' ? styles.copyButtonInside : styles.copyButton,
        style,
      ]}
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
    >
      <Text
        style={
          variant === 'inside' ? styles.copyIconInside : styles.copyIcon
        }
      >
        {copied ? '✓' : '⎘'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  copyButton: {
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  copyIcon: {
    fontSize: 18,
    color: '#666',
  },
  copyButtonInside: {
    position: 'absolute',
    right: 8,
    top: 8,
    backgroundColor: 'transparent',
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  copyIconInside: {
    fontSize: 20,
    color: '#666',
  },
});
