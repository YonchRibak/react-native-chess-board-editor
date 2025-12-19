import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { EnPassantInputProps } from '../types';
import { useEnPassantInput } from '../hooks/useEnPassantInput';
import { ValidatedInput } from './ValidatedInput';
import { ClearButton } from './ClearButton';
import { EN_PASSANT_MESSAGES } from '../constants/validationMessages';

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
  const { localValue, error, helpText, handleChange, handleClear } =
    useEnPassantInput(enPassantSquare, onEnPassantChange, fen);

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>En Passant Square:</Text>
      <View style={styles.inputContainer}>
        <ValidatedInput
          value={localValue}
          onChangeText={handleChange}
          error={error}
          placeholder={EN_PASSANT_MESSAGES.PLACEHOLDER}
          autoCapitalize="none"
          autoCorrect={false}
          maxLength={2}
          returnKeyType="done"
          blurOnSubmit={true}
          accessibilityLabel="En passant target square"
          accessibilityHint="Enter a square on rank 3 or 6"
          inputStyle={inputStyle}
        />
        <ClearButton
          onPress={handleClear}
          visible={localValue !== ''}
          accessibilityLabel="Clear en passant"
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <Text style={styles.helpText}>{helpText}</Text>
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
