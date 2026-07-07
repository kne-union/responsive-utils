import { useEffect, useState } from 'react';
import { BREAKPOINTS } from '../tokens/breakpoints';
import useResponsiveContext from './useResponsiveContext';

const getViewportWidth = () => {
  if (typeof window === 'undefined') {
    return BREAKPOINTS.xxl;
  }
  return window.innerWidth || document.documentElement.clientWidth || BREAKPOINTS.xxl;
};

const buildBreakpointState = width => ({
  xs: width >= BREAKPOINTS.xs,
  sm: width >= BREAKPOINTS.sm,
  md: width >= BREAKPOINTS.md,
  lg: width >= BREAKPOINTS.lg,
  xl: width >= BREAKPOINTS.xl,
  xxl: width >= BREAKPOINTS.xxl,
  isMobile: width < BREAKPOINTS.md
});

const useBreakpoint = () => {
  const { mode, containerWidth, getIsMobile } = useResponsiveContext();
  const [breakpoints, setBreakpoints] = useState(() => {
    if (mode === 'container' && typeof containerWidth === 'number') {
      return buildBreakpointState(containerWidth);
    }
    return buildBreakpointState(getViewportWidth());
  });

  useEffect(() => {
    if (mode === 'container' && typeof containerWidth === 'number') {
      setBreakpoints(buildBreakpointState(containerWidth));
      return;
    }
    const update = () => setBreakpoints(buildBreakpointState(getViewportWidth()));
    update();
    window.addEventListener('resize', update, { passive: true });
    return () => window.removeEventListener('resize', update);
  }, [mode, containerWidth]);

  useEffect(() => {
    setBreakpoints(prev => ({
      ...prev,
      isMobile: getIsMobile()
    }));
  }, [getIsMobile]);

  return breakpoints;
};

export default useBreakpoint;
