import React, { useMemo, useRef } from 'react';
import ResponsiveContext, { defaultResponsiveContextValue } from './ResponsiveContext';
import { MOBILE_BREAKPOINT } from '../tokens/breakpoints';
import resolveBoundaryElement from '../dom/getBoundaryElement';
import resolveScrollElement from '../dom/getScrollElement';

const ResponsiveProvider = ({ mode = 'viewport', containerWidth, getBoundaryElement, getScrollElement, boundaryRef, scrollRef, scrollAnchorRef, children }) => {
  const boundaryResolverRef = useRef(getBoundaryElement);
  const scrollResolverRef = useRef(getScrollElement);
  boundaryResolverRef.current = getBoundaryElement;
  scrollResolverRef.current = getScrollElement;

  const value = useMemo(() => {
    const getIsMobile = () => {
      if (mode === 'container' && typeof containerWidth === 'number') {
        return containerWidth < MOBILE_BREAKPOINT;
      }
      return defaultResponsiveContextValue.getIsMobile();
    };

    return {
      mode,
      containerWidth,
      getBoundaryElement: () => {
        if (typeof boundaryResolverRef.current === 'function') {
          const resolved = boundaryResolverRef.current();
          if (resolved) {
            return resolved;
          }
        }
        return resolveBoundaryElement(boundaryRef);
      },
      getScrollElement: () => {
        if (typeof scrollResolverRef.current === 'function') {
          const resolved = scrollResolverRef.current();
          if (resolved) {
            return resolved;
          }
        }
        const anchor = scrollAnchorRef && scrollAnchorRef.current;
        return resolveScrollElement(scrollRef, anchor);
      },
      getIsMobile
    };
  }, [mode, containerWidth, boundaryRef, scrollRef, scrollAnchorRef]);

  return <ResponsiveContext.Provider value={value}>{children}</ResponsiveContext.Provider>;
};

export default ResponsiveProvider;
