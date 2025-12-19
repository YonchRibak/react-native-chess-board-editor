import { useState, useEffect } from 'react';
import { validateFenInput } from '../utils/validation';

export interface UseFenInputReturn {
  localFen: string;
  setLocalFen: (fen: string) => void;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  error: string | null;
  handleSubmit: () => void;
  handleCancel: () => void;
}

/**
 * Custom hook for managing FEN input state and validation
 * Handles local state, editing mode, validation, and submission
 */
export const useFenInput = (
  fen: string,
  onFenChange?: (fen: string) => void
): UseFenInputReturn => {
  const [localFen, setLocalFen] = useState(fen);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync with prop changes when not editing
  useEffect(() => {
    if (!isEditing) {
      setLocalFen(fen);
      setError(null);
    }
  }, [fen, isEditing]);

  const handleSubmit = () => {
    const validation = validateFenInput(localFen);

    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    setError(null);
    setIsEditing(false);
    onFenChange?.(localFen.trim());
  };

  const handleCancel = () => {
    setLocalFen(fen);
    setError(null);
    setIsEditing(false);
  };

  return {
    localFen,
    setLocalFen,
    isEditing,
    setIsEditing,
    error,
    handleSubmit,
    handleCancel,
  };
};
