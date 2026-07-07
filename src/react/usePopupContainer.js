import { useCallback } from 'react';
import useResponsiveContext from './useResponsiveContext';

const usePopupContainer = () => {
  const { getBoundaryElement } = useResponsiveContext();
  return useCallback(() => getBoundaryElement(), [getBoundaryElement]);
};

export default usePopupContainer;
