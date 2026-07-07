import { useEffect, useState } from 'react';
import { IS_MOBILE_QUERY, MOBILE_BREAKPOINT } from '../tokens/breakpoints';
import useResponsiveContext from './useResponsiveContext';

const useIsMobile = () => {
  const { mode, containerWidth, getIsMobile } = useResponsiveContext();
  const [viewportIsMobile, setViewportIsMobile] = useState(getIsMobile);

  useEffect(() => {
    if (mode === 'container') {
      return;
    }
    setViewportIsMobile(getIsMobile());
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }
    const mediaQuery = window.matchMedia(IS_MOBILE_QUERY);
    const handleChange = event => setViewportIsMobile(event.matches);
    setViewportIsMobile(mediaQuery.matches);
    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, [mode, getIsMobile]);

  if (mode === 'container' && typeof containerWidth === 'number') {
    return containerWidth < MOBILE_BREAKPOINT;
  }

  return viewportIsMobile;
};

export default useIsMobile;
