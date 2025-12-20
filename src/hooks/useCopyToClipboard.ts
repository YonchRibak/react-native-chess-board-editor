import { useState, useRef, useCallback } from 'react';
import { Clipboard } from 'react-native';

export interface UseCopyToClipboardReturn {
  copied: boolean;
  copyToClipboard: (text: string) => void;
}

/**
 * Custom hook for copying text to clipboard with temporary feedback
 * @param timeout - How long to show "copied" state in milliseconds (default: 2000)
 * @returns Object with copied state and copyToClipboard function
 */
export const useCopyToClipboard = (
  timeout: number = 2000
): UseCopyToClipboardReturn => {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const copyToClipboard = useCallback(
    (text: string) => {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      Clipboard.setString(text);
      setCopied(true);

      // Set new timeout
      timeoutRef.current = setTimeout(() => {
        setCopied(false);
        timeoutRef.current = null;
      }, timeout);
    },
    [timeout]
  );

  return {
    copied,
    copyToClipboard,
  };
};
