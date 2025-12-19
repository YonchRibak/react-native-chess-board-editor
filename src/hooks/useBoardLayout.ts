import { useRef, useState } from 'react';
import { View } from 'react-native';
import type { BoardLayout } from '../utils/boardCoordinates';

export interface UseBoardLayoutReturn {
  boardRef: React.RefObject<View>;
  boardLayout: BoardLayout;
  handleBoardLayout: () => void;
}

/**
 * Custom hook for tracking board position and dimensions
 * Manages the measurement of the board component for coordinate calculations
 */
export const useBoardLayout = (): UseBoardLayoutReturn => {
  const boardRef = useRef<View>(null);
  const [boardLayout, setBoardLayout] = useState<BoardLayout>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const handleBoardLayout = () => {
    boardRef.current?.measure((_x, _y, width, height, pageX, pageY) => {
      setBoardLayout({ x: pageX, y: pageY, width, height });
    });
  };

  return {
    boardRef,
    boardLayout,
    handleBoardLayout,
  };
};
