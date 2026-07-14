import { useMemo } from 'react';
import useIsMobile from './useIsMobile';
import useResponsiveContext from './useResponsiveContext';
import { resolveMobilePopupModeClass, resolveUseBoundaryMount } from '../dom/resolveMobilePopupContainer';
import { MOBILE_POPUP_COVER } from '../tokens/mobilePopup';

/**
 * 移动端弹层定位模式（内部会用到；业务优先用 useMobilePopupMount）
 *
 * @param {{ isMobile?: boolean, cover?: 'boundary' | 'viewport' }} [options]
 *        isMobile 可传入已合并后的值；不传则用 useIsMobile()
 */
const useMobileFixedMode = (options = {}) => {
  const { cover = MOBILE_POPUP_COVER.boundary, isMobile: isMobileOption, inExamplePhoneFrame = false } = options;
  const baseIsMobile = useIsMobile();
  const { mode } = useResponsiveContext();

  const isMobile = typeof isMobileOption === 'boolean' ? isMobileOption : baseIsMobile || !!inExamplePhoneFrame;
  const useBoundaryMount = resolveUseBoundaryMount({ isMobile, mode, inExamplePhoneFrame });
  const useViewportFixed = !!(isMobile && !useBoundaryMount && cover === MOBILE_POPUP_COVER.viewport);
  const fixedModeClass = resolveMobilePopupModeClass({ isMobile, useBoundaryMount, cover });

  return useMemo(
    () => ({
      isMobile,
      mode,
      useBoundaryMount,
      useViewportFixed,
      fixedModeClass
    }),
    [isMobile, mode, useBoundaryMount, useViewportFixed, fixedModeClass]
  );
};

export default useMobileFixedMode;
