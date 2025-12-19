import { useRef, useState } from 'react';
import { View } from 'react-native';
import type { ComponentLayout } from '../types/bank';

/**
 * Hook to track a component's position and dimensions on screen
 * @returns ref, layout state, and layout handler
 */
export const useComponentLayout = () => {
  const ref = useRef<View>(null);
  const [layout, setLayout] = useState<ComponentLayout>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const handleLayout = () => {
    ref.current?.measure((x, y, width, height, pageX, pageY) => {
      setLayout({ x: pageX, y: pageY, width, height });
    });
  };

  return {
    ref,
    layout,
    handleLayout,
  };
};
