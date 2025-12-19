import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

export interface ActionButtonsProps {
  onCancel: () => void;
  onSubmit: () => void;
  visible?: boolean;
  cancelLabel?: string;
  submitLabel?: string;
}

/**
 * ActionButtons Component
 * Cancel and Submit buttons for forms
 */
export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onCancel,
  onSubmit,
  visible = true,
  cancelLabel = 'Cancel',
  submitLabel = 'Apply',
}) => {
  if (!visible) {
    return null;
  }

  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        style={[styles.button, styles.cancelButton]}
        onPress={onCancel}
        accessibilityLabel={`${cancelLabel} edit`}
        accessibilityRole="button"
      >
        <Text style={styles.cancelButtonText}>{cancelLabel}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.submitButton]}
        onPress={onSubmit}
        accessibilityLabel={submitLabel}
        accessibilityRole="button"
      >
        <Text style={styles.submitButtonText}>{submitLabel}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    gap: 8,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  submitButton: {
    backgroundColor: '#007AFF',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
