import { useCallback } from 'react';
import useResponsiveContext from './useResponsiveContext';

const useScrollElement = () => {
  const { getScrollElement } = useResponsiveContext();
  return useCallback(() => getScrollElement(), [getScrollElement]);
};

export default useScrollElement;
