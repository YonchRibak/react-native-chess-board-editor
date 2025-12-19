import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import type { EnPassantInputProps } from '../types';
import { isValidEnPassantSquareFormat, isValidEnPassantSquare } from '../utils/fen';

/**
 * EnPassantInput Component
 * Input for specifying the en passant target square with format and position validation
 */
export const EnPassantInput: React.FC<EnPassantInputProps> = ({
  enPassantSquare,
  onEnPassantChange,
  fen,
  containerStyle,
  inputStyle,
}) => {
  const [localValue, setLocalValue] = useState(enPassantSquare === '-' ? '' : enPassantSquare);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    setLocalValue(enPassantSquare === '-' ? '' : enPassantSquare);
    setError(null);
  }, [enPassantSquare]);

  const handleChange = (value: string) => {
    const trimmed = value.trim().toLowerCase();
    setLocalValue(trimmed);

    // Clear error as user types
    if (error) {
      setError(null);
    }

    // Auto-apply when empty or valid
    if (trimmed === '') {
      onEnPassantChange('-');
      return;
    }

    // Only validate and apply if exactly 2 characters (complete square)
    if (trimmed.length === 2) {
      // Check format first
      if (!isValidEnPassantSquareFormat(trimmed)) {
        setError('Must be rank 3 (e.g., e3) or rank 6 (e.g., d6)');
        return;
      }

      // If FEN provided, do strict validation
      if (fen) {
        if (!isValidEnPassantSquare(fen, trimmed)) {
          setError('Invalid: no pawns in correct position for en passant');
          return;
        }
      }

      // Valid - apply immediately
      setError(null);
      onEnPassantChange(trimmed);
    }
  };

  const handleClear = () => {
    setLocalValue('');
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
          placeholder="e.g., e3"
          autoCapitalize="none"
          autoCorrect={false}
          maxLength={2}
          returnKeyType="done"
          blurOnSubmit={true}
          accessibilityLabel="En passant target square"
          accessibilityHint="Enter a square on rank 3 or 6"
        />
        {localValue !== '' && (
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
        {fen ? 'Validates pawn positions automatically' : 'Valid squares: a3-h3 or a6-h6'}
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
