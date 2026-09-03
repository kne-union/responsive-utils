import { useMemo } from 'react';
import useIsMobile from './useIsMobile';
import useResponsiveContext from './useResponsiveContext';
import { resolveMobilePopupModeClass, resolveUseBoundaryMount } from '../dom/resolvePopupContainer';
import { MOBILE_POPUP_COVER } from '../tokens/mobilePopup';

/**
 * @internal 仅定位 class；弹层挂载请用 `usePopupMount`。
 *
 * @param {{ isMobile?: boolean, cover?: 'boundary' | 'viewport' }} [options]
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
