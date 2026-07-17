import { EXAMPLE_PHONE_MOUNT_SELECTORS, MOBILE_BREAKPOINT } from '../tokens';

// boundary 等选择器在桌面布局（如 system-layout 的 Layout 根节点）上也会出现，
// 只有实际宽度小于移动端断点的节点才可能是手机外框；宽度 0（未布局 / jsdom）时放行。
const isPhoneSized = node => {
  const width = node.clientWidth || 0;
  return width < MOBILE_BREAKPOINT;
};

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
      if (found && isPhoneSized(found)) {
        return found;
      }
    } catch (e) {
      // invalid selector — skip
    }
  }
  return null;
};

export default findExamplePhoneMountNode;
