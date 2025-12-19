import React from 'react';
import { TextInput, StyleSheet, TextInputProps, StyleProp, TextStyle } from 'react-native';

export interface ValidatedInputProps extends TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  error?: string | null;
  inputStyle?: StyleProp<TextStyle>;
}

/**
 * ValidatedInput Component
 * A text input with error state styling
 */
export const ValidatedInput: React.FC<ValidatedInputProps> = ({
  value,
  onChangeText,
  error,
  inputStyle,
  style,
  ...textInputProps
}) => {
  return (
    <TextInput
      style={[
        styles.input,
        error ? styles.inputError : undefined,
        inputStyle,
        style,
      ]}
      value={value}
      onChangeText={onChangeText}
      {...textInputProps}
    />
  );
};

const styles = StyleSheet.create({
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
});
