import { findResponsiveBoundary } from './findResponsiveTarget';

const getDefaultBoundaryElement = () => {
  if (typeof document === 'undefined') {
    return null;
  }
  return findResponsiveBoundary() || document.body || null;
};

const resolveBoundaryElement = resolver => {
  if (typeof resolver === 'function') {
    const resolved = resolver();
    if (resolved) {
      return resolved;
    }
  }
  if (resolver && resolver.current) {
    return resolver.current;
  }
  if (resolver && typeof resolver === 'object' && resolver.nodeType === 1) {
    return resolver;
  }
  return getDefaultBoundaryElement();
};

export default resolveBoundaryElement;
export { getDefaultBoundaryElement };
