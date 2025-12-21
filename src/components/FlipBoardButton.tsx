import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import type { FlipBoardButtonProps } from '../types';

/**
 * FlipBoardButton Component
 * A button to toggle board orientation (flip between white and black perspective)
 */
export const FlipBoardButton: React.FC<FlipBoardButtonProps> = ({
  flipped,
  onFlipChange,
  containerStyle,
  buttonStyle,
  variant = 'inline',
}) => {
  const handlePress = () => {
    onFlipChange(!flipped);
  };

  const isOverlay = variant === 'overlay';

  return (
    <TouchableOpacity
      style={[
        isOverlay ? styles.overlayButton : styles.inlineButton,
        buttonStyle,
        containerStyle,
      ]}
      onPress={handlePress}
      accessibilityLabel={flipped ? 'Flip board to white perspective' : 'Flip board to black perspective'}
      accessibilityRole="button"
      activeOpacity={0.7}
    >
      <Text style={isOverlay ? styles.overlayIcon : styles.inlineIcon}>
        ⟲
      </Text>
      {!isOverlay && (
        <Text style={styles.inlineText}>
          Flip Board
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  overlayButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  overlayIcon: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
    backgroundColor: 'transparent',
    marginLeft: -4,
    marginTop: -4,
  },
  inlineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  inlineIcon: {
    fontSize: 20,
    color: '#fff',
    marginRight: 8,
    fontWeight: 'bold',
  },
  inlineText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});
