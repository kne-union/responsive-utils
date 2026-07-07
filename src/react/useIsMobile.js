import { useEffect, useState } from 'react';
import { IS_MOBILE_QUERY } from '../tokens/breakpoints';
import useResponsiveContext from './useResponsiveContext';

const useIsMobile = () => {
  const { mode, containerWidth, getIsMobile } = useResponsiveContext();
  const [isMobile, setIsMobile] = useState(getIsMobile);

  useEffect(() => {
    setIsMobile(getIsMobile());
    if (mode === 'container') {
      return;
    }
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }
    const mediaQuery = window.matchMedia(IS_MOBILE_QUERY);
    const handleChange = event => setIsMobile(event.matches);
    setIsMobile(mediaQuery.matches);
    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, [mode, containerWidth, getIsMobile]);

  return isMobile;
};

export default useIsMobile;
