import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Clipboard,
} from 'react-native';
import type { FenDisplayProps } from '../types';
import { isValidFenStructure } from '../utils/fen';

/**
 * FenDisplay Component
 * Displays the current FEN string and optionally allows manual editing
 */
export const FenDisplay: React.FC<FenDisplayProps> = ({
  fen,
  onFenChange,
  editable = false,
  inputStyle,
  containerStyle,
}) => {
  const [localFen, setLocalFen] = useState(fen);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    if (!isEditing) {
      setLocalFen(fen);
      setError(null);
    }
  }, [fen, isEditing]);

  const handleSubmit = () => {
    const trimmedFen = localFen.trim();

    if (!trimmedFen) {
      setError('FEN cannot be empty');
      return;
    }

    if (!isValidFenStructure(trimmedFen)) {
      setError('Invalid FEN structure');
      return;
    }

    setError(null);
    setIsEditing(false);
    onFenChange?.(trimmedFen);
  };

  const handleCancel = () => {
    setLocalFen(fen);
    setError(null);
    setIsEditing(false);
  };

  const handleCopy = () => {
    Clipboard.setString(fen);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!editable) {
    return (
      <View style={[styles.container, containerStyle]}>
        <Text style={styles.label}>FEN:</Text>
        <View style={styles.fenContainer}>
          <Text
            style={[styles.fenText, inputStyle]}
            selectable
            accessibilityLabel={`FEN: ${fen}`}
          >
            {fen}
          </Text>
          <TouchableOpacity
            style={styles.copyButtonInside}
            onPress={handleCopy}
            accessibilityLabel="Copy FEN to clipboard"
          >
            <Text style={styles.copyIconInside}>{copied ? '✓' : '⎘'}</Text>
          </TouchableOpacity>
        </View>
        {copied && <Text style={styles.copiedText}>Copied!</Text>}
      </View>
    );
  }

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
            placeholder="Enter FEN string"
            autoCapitalize="none"
            autoCorrect={false}
            multiline
            numberOfLines={2}
            accessibilityLabel="FEN input"
            accessibilityHint="Enter a valid FEN string"
          />
          <TouchableOpacity
            style={styles.copyButtonInside}
            onPress={handleCopy}
            accessibilityLabel="Copy FEN to clipboard"
          >
            <Text style={styles.copyIconInside}>{copied ? '✓' : '⎘'}</Text>
          </TouchableOpacity>
        </View>
        {error && <Text style={styles.errorText}>{error}</Text>}
        {copied && <Text style={styles.copiedText}>Copied!</Text>}
        {isEditing && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}
              accessibilityLabel="Cancel FEN edit"
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={handleSubmit}
              accessibilityLabel="Submit FEN"
            >
              <Text style={styles.submitButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        )}
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
  fenContainer: {
    position: 'relative',
  },
  fenText: {
    fontSize: 13,
    fontFamily: 'monospace',
    color: '#555',
    backgroundColor: '#f5f5f5',
    padding: 12,
    paddingRight: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  inputWrapper: {
    position: 'relative',
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
  copiedText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
    marginLeft: 4,
  },
  editableContainer: {
    flex: 1,
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
