import React from 'react';
import type { FenDisplayProps } from '../types';
import { ReadOnlyFenDisplay } from './ReadOnlyFenDisplay';
import { EditableFenDisplay } from './EditableFenDisplay';

/**
 * FenDisplay Component
 * Wrapper component that displays FEN in read-only or editable mode
 */
export const FenDisplay: React.FC<FenDisplayProps> = ({
  fen,
  onFenChange,
  editable = false,
  inputStyle,
  containerStyle,
}) => {
  if (!editable) {
    return (
      <ReadOnlyFenDisplay
        fen={fen}
        containerStyle={containerStyle}
        inputStyle={inputStyle}
      />
    );
  }

  return (
    <EditableFenDisplay
      fen={fen}
      onFenChange={onFenChange}
      containerStyle={containerStyle}
      inputStyle={inputStyle}
    />
  );
};
