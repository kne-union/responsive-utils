import { findResponsiveScroll } from './findResponsiveTarget';

const getDefaultScrollElement = () => {
  if (typeof document === 'undefined') {
    return null;
  }
  return findResponsiveScroll() || document.scrollingElement || document.documentElement || document.body || null;
};

export default getDefaultScrollElement;
