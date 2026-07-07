import getDefaultScrollElement from './getDefaultScrollElement';
import findScrollParent from './findScrollParent';

const resolveScrollElement = (resolver, anchorElement) => {
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
  if (anchorElement) {
    const parent = findScrollParent(anchorElement);
    if (parent) {
      return parent;
    }
  }
  return getDefaultScrollElement();
};

export default resolveScrollElement;
export { getDefaultScrollElement };
