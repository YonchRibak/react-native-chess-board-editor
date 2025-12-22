import { isValidEnPassantSquareFormat, isValidEnPassantSquare, isValidFenStructure } from './fen';
import { EN_PASSANT_MESSAGES } from '../constants/validationMessages';

export interface ValidationResult {
  valid: boolean;
  error: string | null;
}

/**
 * Validate en passant input value
 * @param value - The input value to validate
 * @param fen - Optional FEN string for strict validation
 * @returns Validation result with valid flag and error message
 */
export const validateEnPassantInput = (
  value: string,
  fen?: string
): ValidationResult => {
  // Empty is always valid (means no en passant)
  if (value === '') {
    return { valid: true, error: null };
  }

  // Only validate complete squares (2 characters)
  if (value.length !== 2) {
    return { valid: false, error: null }; // Don't show error while typing
  }

  // Check format first
  if (!isValidEnPassantSquareFormat(value)) {
    return {
      valid: false,
      error: EN_PASSANT_MESSAGES.INVALID_FORMAT,
    };
  }

  // If FEN provided, do strict validation
  if (fen) {
    if (!isValidEnPassantSquare(fen, value)) {
      return {
        valid: false,
        error: EN_PASSANT_MESSAGES.INVALID_POSITION,
      };
    }
  }

  return { valid: true, error: null };
};

/**
 * Validate FEN input string
 * @param fen - The FEN string to validate
 * @returns Validation result with valid flag and error message
 */
export const validateFenInput = (fen: string): ValidationResult => {
  const trimmedFen = fen.trim();

  if (!trimmedFen) {
    return {
      valid: false,
      error: 'FEN cannot be empty',
    };
  }

  if (!isValidFenStructure(trimmedFen)) {
    return {
      valid: false,
      error: 'Invalid FEN structure',
    };
  }

  return { valid: true, error: null };
};
