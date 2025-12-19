/**
 * Validation messages for input components
 */

export const EN_PASSANT_MESSAGES = {
  INVALID_FORMAT: 'Must be rank 3 (e.g., e3) or rank 6 (e.g., d6)',
  INVALID_POSITION: 'Invalid: no pawns in correct position for en passant',
  HELP_WITH_FEN: 'Validates pawn positions automatically',
  HELP_WITHOUT_FEN: 'Valid squares: a3-h3 or a6-h6',
  PLACEHOLDER: 'e.g., e3',
};

export const FEN_MESSAGES = {
  EMPTY_ERROR: 'FEN cannot be empty',
  INVALID_STRUCTURE: 'Invalid FEN structure',
  COPIED: 'Copied!',
  PLACEHOLDER: 'Enter FEN string',
};
