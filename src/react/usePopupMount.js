import { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import useIsMobile from './useIsMobile';
import useResponsiveContext from './useResponsiveContext';
import findExamplePhoneMountNode from '../dom/findExamplePhoneMountNode';
import { resolvePopupContainer, resolveMobilePopupModeClass, resolveUseBoundaryMount } from '../dom/resolvePopupContainer';
import { EXAMPLE_PHONE_MOUNT_SELECTORS, MOBILE_POPUP_COVER } from '../tokens';

/**
 * 弹层挂载唯一入口（桌面 / 移动端 / 示例框 / Modal 内）。
 * 业务与组件库只需选 `cover`，可选覆盖 `getPopupContainer`。
 *
 * @param {object} [options]
 * @param {(triggerNode?: HTMLElement) => HTMLElement | null} [options.getPopupContainer] 调用方覆盖
 * @param {'boundary' | 'viewport'} [options.cover='boundary']
 *   - boundary：默认挂 Provider boundary（非 Modal 内）
 *   - viewport：真实移动端挂 body+fixed；示例框 / container 仍挂 boundary
 * @param {boolean} [options.disableExampleFallback=false]
 * @param {string[]} [options.exampleSelectors]
 *
 * @returns {{
 *   isMobile: boolean,
 *   fixedModeClass: 'kne-is-boundary' | 'kne-is-viewport' | null,
 *   getPopupContainer: (triggerNode?: HTMLElement) => HTMLElement,
 *   getMountNode: (triggerNode?: HTMLElement) => HTMLElement | null,
 *   resolveMount: (triggerNode?: HTMLElement) => object,
 *   anchorRef: (node: Element | null) => void,
 * }}
 */
const usePopupMount = (options = {}) => {
  const { getPopupContainer: getPopupContainerProp, cover = MOBILE_POPUP_COVER.boundary, disableExampleFallback = false, exampleSelectors = EXAMPLE_PHONE_MOUNT_SELECTORS } = options;

  const baseIsMobile = useIsMobile();
  const { mode, getBoundaryElement } = useResponsiveContext();
  const [anchor, setAnchor] = useState(null);
  const [inExamplePhoneFrame, setInExamplePhoneFrame] = useState(false);

  const probeExample = useCallback(
    node => {
      if (disableExampleFallback || !node) {
        return false;
      }
      return !!findExamplePhoneMountNode(node, exampleSelectors);
    },
    [disableExampleFallback, exampleSelectors]
  );

  const anchorRef = useCallback(node => {
    setAnchor(node);
  }, []);

  useLayoutEffect(() => {
    if (disableExampleFallback) {
      setInExamplePhoneFrame(false);
      return;
    }
    setInExamplePhoneFrame(probeExample(anchor));
  }, [anchor, disableExampleFallback, probeExample]);

  const isMobile = baseIsMobile || inExamplePhoneFrame;
  const useBoundaryMount = resolveUseBoundaryMount({ isMobile, mode, inExamplePhoneFrame });
  const fixedModeClass = resolveMobilePopupModeClass({ isMobile, useBoundaryMount, cover });

  const resolvePlan = useCallback(
    triggerNode => {
      const hitExample = probeExample(triggerNode) || probeExample(anchor) || inExamplePhoneFrame;
      if (hitExample && !inExamplePhoneFrame) {
        setInExamplePhoneFrame(true);
      }
      const mobile = baseIsMobile || hitExample;
      const boundaryMount = resolveUseBoundaryMount({ isMobile: mobile, mode, inExamplePhoneFrame: hitExample });
      const modeClass = resolveMobilePopupModeClass({ isMobile: mobile, useBoundaryMount: boundaryMount, cover });
      const mountNode = resolvePopupContainer({
        isMobile: mobile,
        useBoundaryMount: boundaryMount,
        cover,
        getBoundaryElement,
        getPopupContainer: getPopupContainerProp,
        triggerNode
      });
      return {
        isMobile: mobile,
        useBoundaryMount: boundaryMount,
        fixedModeClass: modeClass,
        mountNode
      };
    },
    [anchor, baseIsMobile, cover, getBoundaryElement, getPopupContainerProp, inExamplePhoneFrame, mode, probeExample]
  );

  const getMountNode = useCallback(triggerNode => resolvePlan(triggerNode).mountNode, [resolvePlan]);

  const getPopupContainer = useCallback(
    triggerNode => {
      const node = resolvePlan(triggerNode).mountNode;
      if (node) {
        return node;
      }
      if (typeof document !== 'undefined') {
        return document.body;
      }
      return null;
    },
    [resolvePlan]
  );

  const resolveMount = useCallback(
    triggerNode => {
      const plan = resolvePlan(triggerNode);
      return {
        isMobile: plan.isMobile,
        useBoundaryMount: plan.useBoundaryMount,
        fixedModeClass: plan.fixedModeClass,
        mountNode: plan.mountNode
      };
    },
    [resolvePlan]
  );

  return useMemo(
    () => ({
      isMobile,
      fixedModeClass,
      getPopupContainer,
      getMountNode,
      resolveMount,
      anchorRef
    }),
    [anchorRef, fixedModeClass, getMountNode, getPopupContainer, isMobile, resolveMount]
  );
};

export default usePopupMount;
