import getDefaultScrollElement from './getDefaultScrollElement';
import findScrollParent from './findScrollParent';

const normalizeScrollNode = node => {
  if (!node) {
    return null;
  }
  if (typeof node.getScrollElement === 'function') {
    return node.getScrollElement();
  }
  if (node.nodeType === 1) {
    return node;
  }
  return null;
};

const resolveScrollElement = (resolver, anchorElement) => {
  if (typeof resolver === 'function') {
    const resolved = normalizeScrollNode(resolver());
    if (resolved) {
      return resolved;
    }
  }
  const fromRef = normalizeScrollNode(resolver && resolver.current);
  if (fromRef) {
    return fromRef;
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
