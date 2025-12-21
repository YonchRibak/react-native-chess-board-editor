import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { CoordinateLabelsConfig } from '../types';

export interface RankLabelsProps {
  /** Size of each square in pixels */
  squareSize: number;
  /** Whether the board is flipped */
  flipped: boolean;
  /** Configuration for coordinate labels */
  config?: CoordinateLabelsConfig;
}

export interface FileLabelsProps {
  /** Size of each square in pixels */
  squareSize: number;
  /** Whether the board is flipped */
  flipped: boolean;
  /** Configuration for coordinate labels */
  config?: CoordinateLabelsConfig;
  /** Width of rank labels to add left padding */
  rankLabelWidth: number;
}

/**
 * RankLabels Component
 * Renders the rank labels (1-8) on the left side of the chess board
 */
export const RankLabels: React.FC<RankLabelsProps> = ({
  squareSize,
  flipped,
  config = {},
}) => {
  const {
    fontSize = squareSize * 0.2,
    color = '#666',
    fontFamily,
    fontWeight = '600',
    textStyle,
  } = config;

  const ranks = ['1', '2', '3', '4', '5', '6', '7', '8'];
  const displayRanks = flipped ? ranks : [...ranks].reverse();

  const labelTextStyle = [
    styles.labelText,
    {
      fontSize,
      color,
      fontFamily,
      fontWeight,
    },
    textStyle,
  ];

  return (
    <View style={styles.rankLabelsContainer}>
      {displayRanks.map((rank) => (
        <View
          key={rank}
          style={[
            styles.rankLabel,
            { height: squareSize, width: fontSize * 1.8 },
          ]}
        >
          <Text style={labelTextStyle}>{rank}</Text>
        </View>
      ))}
    </View>
  );
};

/**
 * FileLabels Component
 * Renders the file labels (a-h) at the bottom of the chess board
 */
export const FileLabels: React.FC<FileLabelsProps> = ({
  squareSize,
  flipped,
  config = {},
  rankLabelWidth,
}) => {
  const {
    fontSize = squareSize * 0.2,
    color = '#666',
    fontFamily,
    fontWeight = '600',
    textStyle,
  } = config;

  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const displayFiles = flipped ? [...files].reverse() : files;

  const labelTextStyle = [
    styles.labelText,
    {
      fontSize,
      color,
      fontFamily,
      fontWeight,
    },
    textStyle,
  ];

  return (
    <View style={[styles.fileLabelsContainer, { height: fontSize * 1.8 }]}>
      {/* Spacer to align with rank labels */}
      <View style={{ width: rankLabelWidth }} />
      {displayFiles.map((file) => (
        <View
          key={file}
          style={[styles.fileLabel, { width: squareSize }]}
        >
          <Text style={labelTextStyle}>{file}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  fileLabelsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  fileLabel: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankLabelsContainer: {
    justifyContent: 'center',
  },
  rankLabel: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelText: {
    textAlign: 'center',
  },
});
