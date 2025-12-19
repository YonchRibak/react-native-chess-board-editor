import { useState } from 'react';
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

  const copyToClipboard = (text: string) => {
    Clipboard.setString(text);
    setCopied(true);
    setTimeout(() => setCopied(false), timeout);
  };

  return {
    copied,
    copyToClipboard,
  };
};
