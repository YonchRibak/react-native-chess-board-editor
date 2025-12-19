import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';
import { CopyButton } from './CopyButton';
import { FEN_MESSAGES } from '../constants/validationMessages';

export interface ReadOnlyFenDisplayProps {
  fen: string;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
}

/**
 * ReadOnlyFenDisplay Component
 * Displays FEN string in read-only mode with copy functionality
 */
export const ReadOnlyFenDisplay: React.FC<ReadOnlyFenDisplayProps> = ({
  fen,
  containerStyle,
  inputStyle,
}) => {
  const { copied, copyToClipboard } = useCopyToClipboard();

  const handleCopy = () => {
    copyToClipboard(fen);
  };

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
        <CopyButton
          onPress={handleCopy}
          copied={copied}
          variant="inside"
          accessibilityLabel="Copy FEN to clipboard"
        />
      </View>
      {copied && <Text style={styles.copiedText}>{FEN_MESSAGES.COPIED}</Text>}
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
  copiedText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
    marginLeft: 4,
  },
});
