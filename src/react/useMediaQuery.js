import { useEffect, useState } from 'react';
import useResponsiveContext from './useResponsiveContext';

const getMatches = query => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia(query).matches;
};

const useMediaQuery = query => {
  const { mode, getIsMobile } = useResponsiveContext();
  const [matches, setMatches] = useState(() => {
    if (mode === 'container' && query.includes('max-width')) {
      return getIsMobile();
    }
    return getMatches(query);
  });

  useEffect(() => {
    if (mode === 'container' && query.includes('max-width')) {
      setMatches(getIsMobile());
      return;
    }
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }
    const mediaQuery = window.matchMedia(query);
    const handleChange = event => setMatches(event.matches);
    setMatches(mediaQuery.matches);
    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, [query, mode, getIsMobile]);

  return matches;
};

export default useMediaQuery;
