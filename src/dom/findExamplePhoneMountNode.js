import { EXAMPLE_PHONE_MOUNT_SELECTORS } from '../tokens';

/**
 * 从触发节点向上查找额外挂载根（库内部；业务一般不必直接调用）。
 *
 * @param {Element | null | undefined} anchor
 * @param {string[]} [selectors]
 * @returns {HTMLElement | null}
 */
export const findExamplePhoneMountNode = (anchor, selectors = EXAMPLE_PHONE_MOUNT_SELECTORS) => {
  if (!anchor || typeof anchor.closest !== 'function') {
    return null;
  }
  const list = Array.isArray(selectors) && selectors.length > 0 ? selectors : EXAMPLE_PHONE_MOUNT_SELECTORS;
  for (let i = 0; i < list.length; i += 1) {
    const selector = list[i];
    if (!selector) continue;
    try {
      const found = anchor.closest(selector);
      if (found) {
        return found;
      }
    } catch (e) {
      // invalid selector — skip
    }
  }
  return null;
};

export default findExamplePhoneMountNode;
