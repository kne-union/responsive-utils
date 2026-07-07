import { createContext } from 'react';
import { IS_MOBILE_QUERY, MOBILE_BREAKPOINT } from '../tokens/breakpoints';
import { getDefaultBoundaryElement } from '../dom/getBoundaryElement';
import getDefaultScrollElement from '../dom/getDefaultScrollElement';

const defaultGetIsMobile = () => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia(IS_MOBILE_QUERY).matches;
};

export const defaultResponsiveContextValue = {
  mode: 'viewport',
  containerWidth: undefined,
  getBoundaryElement: getDefaultBoundaryElement,
  getScrollElement: getDefaultScrollElement,
  getIsMobile: defaultGetIsMobile
};

const ResponsiveContext = createContext(defaultResponsiveContextValue);

export default ResponsiveContext;
export { MOBILE_BREAKPOINT };
