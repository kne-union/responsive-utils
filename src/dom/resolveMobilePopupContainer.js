import { MOBILE_POPUP_COVER, MOBILE_POPUP_MODE } from '../tokens';

/**
 * 是否以 boundary + absolute 方式挂载（库内部；业务用 cover，勿手写环境判断）
 * @param {{ isMobile: boolean, mode: 'viewport' | 'container', inExamplePhoneFrame?: boolean }} input
 */
export const resolveUseBoundaryMount = ({ isMobile, mode, inExamplePhoneFrame = false }) => {
  return !!(isMobile && (mode === 'container' || inExamplePhoneFrame));
};

/**
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
 * 解析弹层挂载节点。
 * cover=boundary：挂 Provider boundary；
 * cover=viewport：container 模式挂 boundary，viewport 移动端挂 document.body。
 *
 * @param {object} input
 * @param {boolean} input.isMobile
 * @param {boolean} input.useBoundaryMount
 * @param {'boundary' | 'viewport'} [input.cover]
 * @param {() => HTMLElement | null} input.getBoundaryElement
 * @param {(triggerNode?: HTMLElement) => HTMLElement | null} [input.getPopupContainer]
 * @param {HTMLElement | null} [input.triggerNode]
 * @returns {HTMLElement | null}
 */
export const resolveMobilePopupContainer = ({ isMobile, useBoundaryMount, cover = MOBILE_POPUP_COVER.boundary, getBoundaryElement, getPopupContainer, triggerNode }) => {
  if (typeof getPopupContainer === 'function') {
    const custom = getPopupContainer(triggerNode);
    if (custom) {
      return custom;
    }
  }

  const boundary = typeof getBoundaryElement === 'function' ? getBoundaryElement() : null;

  // cover=viewport 且不应挂 boundary：挂 body
  if (isMobile && cover === MOBILE_POPUP_COVER.viewport && !useBoundaryMount) {
    return typeof document !== 'undefined' ? document.body : null;
  }

  // 其余情况挂 boundary
  return boundary;
};

export default resolveMobilePopupContainer;
