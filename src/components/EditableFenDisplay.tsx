import React from 'react';
import { View, Text, TextInput, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { useFenInput } from '../hooks/useFenInput';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';
import { CopyButton } from './CopyButton';
import { ActionButtons } from './ActionButtons';
import { FEN_MESSAGES } from '../constants/validationMessages';

export interface EditableFenDisplayProps {
  fen: string;
  onFenChange?: (fen: string) => void;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
}

/**
 * EditableFenDisplay Component
 * Displays FEN string with editing capabilities and validation
 */
export const EditableFenDisplay: React.FC<EditableFenDisplayProps> = ({
  fen,
  onFenChange,
  containerStyle,
  inputStyle,
}) => {
  const {
    localFen,
    setLocalFen,
    isEditing,
    setIsEditing,
    error,
    handleSubmit,
    handleCancel,
  } = useFenInput(fen, onFenChange);

  const { copied, copyToClipboard } = useCopyToClipboard();

  const handleCopy = () => {
    copyToClipboard(fen);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>FEN:</Text>
      <View style={styles.editableContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={[
              styles.input,
              error ? styles.inputError : undefined,
              inputStyle,
            ]}
            value={localFen}
            onChangeText={setLocalFen}
            onFocus={() => setIsEditing(true)}
            placeholder={FEN_MESSAGES.PLACEHOLDER}
            autoCapitalize="none"
            autoCorrect={false}
            multiline
            numberOfLines={2}
            accessibilityLabel="FEN input"
            accessibilityHint="Enter a valid FEN string"
          />
          <CopyButton
            onPress={handleCopy}
            copied={copied}
            variant="inside"
            accessibilityLabel="Copy FEN to clipboard"
          />
        </View>
        {error && <Text style={styles.errorText}>{error}</Text>}
        {copied && <Text style={styles.copiedText}>{FEN_MESSAGES.COPIED}</Text>}
        <ActionButtons
          onCancel={handleCancel}
          onSubmit={handleSubmit}
          visible={isEditing}
        />
      </View>
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
  editableContainer: {
    flex: 1,
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    fontSize: 13,
    fontFamily: 'monospace',
    color: '#333',
    backgroundColor: '#fff',
    padding: 12,
    paddingRight: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    minHeight: 60,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#ff3b30',
    borderWidth: 2,
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  copiedText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
    marginLeft: 4,
  },
});
