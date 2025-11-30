import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import type { EnPassantInputProps } from '../types';
import { isValidEnPassantSquareFormat } from '../utils/fen';

/**
 * EnPassantInput Component
 * Input for specifying the en passant target square with format validation
 */
export const EnPassantInput: React.FC<EnPassantInputProps> = ({
  enPassantSquare,
  onEnPassantChange,
  containerStyle,
  inputStyle,
}) => {
  const [localValue, setLocalValue] = useState(enPassantSquare);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    setLocalValue(enPassantSquare);
    setError(null);
  }, [enPassantSquare]);

  const handleChange = (value: string) => {
    setLocalValue(value);

    // Clear error as user types
    if (error) {
      setError(null);
    }
  };

  const handleSubmit = () => {
    const trimmed = localValue.trim().toLowerCase();

    // Empty or '-' means no en passant
    if (trimmed === '' || trimmed === '-') {
      setError(null);
      onEnPassantChange('-');
      setLocalValue('-');
      return;
    }

    // Validate format
    if (!isValidEnPassantSquareFormat(trimmed)) {
      setError('Must be a square on rank 3 or 6 (e.g., e3, d6) or "-"');
      return;
    }

    setError(null);
    onEnPassantChange(trimmed);
    setLocalValue(trimmed);
  };

  const handleClear = () => {
    setLocalValue('-');
    setError(null);
    onEnPassantChange('-');
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>En Passant Square:</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            error ? styles.inputError : undefined,
            inputStyle,
          ]}
          value={localValue}
          onChangeText={handleChange}
          onBlur={handleSubmit}
          onSubmitEditing={handleSubmit}
          placeholder="e.g., e3 or -"
          autoCapitalize="none"
          autoCorrect={false}
          maxLength={2}
          accessibilityLabel="En passant target square"
          accessibilityHint="Enter a square on rank 3 or 6, or dash for none"
        />
        {localValue !== '-' && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClear}
            accessibilityLabel="Clear en passant"
          >
            <Text style={styles.clearButtonText}>×</Text>
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <Text style={styles.helpText}>
        Valid squares: a3-h3 (white to move) or a6-h6 (black to move)
      </Text>
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    fontSize: 16,
    fontFamily: 'monospace',
    color: '#333',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    width: 80,
    textAlign: 'center',
  },
  inputError: {
    borderColor: '#ff3b30',
    borderWidth: 2,
  },
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
  errorText: {
    color: '#ff3b30',
    fontSize: 12,
    marginTop: 4,
  },
  helpText: {
    color: '#999',
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'italic',
  },
});
