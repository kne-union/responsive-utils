import { RESPONSIVE_BOUNDARY_CLASS, RESPONSIVE_SCROLL_CLASS } from '../tokens/targets';

const toSelector = className => `.${className}`;

export const findResponsiveBoundary = anchor => {
  if (typeof document === 'undefined') {
    return null;
  }
  if (anchor && anchor.classList && anchor.classList.contains(RESPONSIVE_BOUNDARY_CLASS)) {
    return anchor;
  }
  if (anchor && typeof anchor.closest === 'function') {
    const closest = anchor.closest(toSelector(RESPONSIVE_BOUNDARY_CLASS));
    if (closest) {
      return closest;
    }
    return null;
  }
  return document.querySelector(toSelector(RESPONSIVE_BOUNDARY_CLASS));
};

export const findResponsiveScroll = anchor => {
  if (typeof document === 'undefined') {
    return null;
  }
  if (anchor && anchor.classList && anchor.classList.contains(RESPONSIVE_SCROLL_CLASS)) {
    return anchor;
  }
  if (anchor && typeof anchor.closest === 'function') {
    const closest = anchor.closest(toSelector(RESPONSIVE_SCROLL_CLASS));
    if (closest) {
      return closest;
    }
    return null;
  }
  return document.querySelector(toSelector(RESPONSIVE_SCROLL_CLASS));
};
