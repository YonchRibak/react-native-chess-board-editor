import { useState, useEffect } from 'react';
import { validateEnPassantInput } from '../utils/validation';
import { EN_PASSANT_MESSAGES } from '../constants/validationMessages';

export interface UseEnPassantInputReturn {
  localValue: string;
  error: string | null;
  helpText: string;
  handleChange: (value: string) => void;
  handleClear: () => void;
}

/**
 * Custom hook for managing en passant input state and validation
 * Handles local state, validation, and auto-applying valid values
 */
export const useEnPassantInput = (
  enPassantSquare: string,
  onEnPassantChange: (square: string) => void,
  fen?: string
): UseEnPassantInputReturn => {
  const [localValue, setLocalValue] = useState(
    enPassantSquare === '-' ? '' : enPassantSquare
  );
  const [error, setError] = useState<string | null>(null);

  // Sync with prop changes
  useEffect(() => {
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

    // Auto-apply when empty
    if (trimmed === '') {
      onEnPassantChange('-');
      return;
    }

    // Only validate and apply if exactly 2 characters (complete square)
    if (trimmed.length === 2) {
      const validation = validateEnPassantInput(trimmed, fen);

      if (!validation.valid) {
        setError(validation.error);
        return;
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

  const helpText = fen
    ? EN_PASSANT_MESSAGES.HELP_WITH_FEN
    : EN_PASSANT_MESSAGES.HELP_WITHOUT_FEN;

  return {
    localValue,
    error,
    helpText,
    handleChange,
    handleClear,
  };
};
