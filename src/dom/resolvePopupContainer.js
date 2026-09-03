import { MOBILE_POPUP_COVER, MOBILE_POPUP_MODE } from '../tokens';
import { hoistOutOfModalRoot } from './hoistOutOfModalRoot';

export { hoistOutOfModalRoot } from './hoistOutOfModalRoot';

/**
 * @internal 是否以 boundary + absolute 方式挂载
 * @param {{ isMobile: boolean, mode: 'viewport' | 'container', inExamplePhoneFrame?: boolean }} input
 */
export const resolveUseBoundaryMount = ({ isMobile, mode, inExamplePhoneFrame = false }) => {
  return !!(isMobile && (mode === 'container' || inExamplePhoneFrame));
};

/**
 * @internal
 * @param {{ isMobile: boolean, useBoundaryMount: boolean, cover?: 'boundary' | 'viewport' }} input
 * @returns {'kne-is-boundary' | 'kne-is-viewport' | null}
 */
export const resolveMobilePopupModeClass = ({ isMobile, useBoundaryMount, cover = MOBILE_POPUP_COVER.boundary }) => {
  if (!isMobile) {
    return null;
  }
  if (cover === MOBILE_POPUP_COVER.viewport && !useBoundaryMount) {
    return MOBILE_POPUP_MODE.viewport;
  }
  return MOBILE_POPUP_MODE.boundary;
};

/**
 * 统一弹层挂载解析（antd `getPopupContainer` 同款签名的决策函数）。
 *
 * 优先级：
 * 1. 自定义 `getPopupContainer`（有返回值则用）
 * 2. trigger 在 `.ant-modal-root` 内 → 挂到该 root 的 parent（与 Modal 兄弟，保 antd zIndex）
 * 3. 移动端 cover=viewport 且非 boundary 挂载 → `document.body`
 * 4. Provider boundary / `getBoundaryElement()`
 *
 * @param {object} input
 * @param {boolean} [input.isMobile=false]
 * @param {boolean} [input.useBoundaryMount=false]
 * @param {'boundary' | 'viewport'} [input.cover]
 * @param {() => HTMLElement | null} [input.getBoundaryElement]
 * @param {(triggerNode?: HTMLElement) => HTMLElement | null} [input.getPopupContainer]
 * @param {HTMLElement | null} [input.triggerNode]
 * @param {boolean} [input.escapeModal=true] 是否启用 modal-root 兄弟挂载
 * @returns {HTMLElement | null}
 */
export const resolvePopupContainer = ({ isMobile = false, useBoundaryMount = false, cover = MOBILE_POPUP_COVER.boundary, getBoundaryElement, getPopupContainer, triggerNode, escapeModal = true }) => {
  if (typeof getPopupContainer === 'function') {
    const custom = getPopupContainer(triggerNode);
    if (custom) {
      return custom;
    }
  }

  if (escapeModal) {
    const modalSiblingHost = hoistOutOfModalRoot(triggerNode);
    if (modalSiblingHost) {
      return modalSiblingHost;
    }
  }

  const boundary = typeof getBoundaryElement === 'function' ? getBoundaryElement() : null;

  let mountNode = boundary;
  if (isMobile && cover === MOBILE_POPUP_COVER.viewport && !useBoundaryMount) {
    mountNode = typeof document !== 'undefined' ? document.body : null;
  }

  // 无 trigger 时 boundary 本身可能仍在外层 Modal 内（ConfigProvider / Modal getContainer）
  if (escapeModal) {
    const escapedMount = hoistOutOfModalRoot(mountNode);
    if (escapedMount) {
      return escapedMount;
    }
  }

  return mountNode;
};

/** @deprecated 使用 {@link resolvePopupContainer} */
export const resolveMobilePopupContainer = resolvePopupContainer;

export default resolvePopupContainer;
