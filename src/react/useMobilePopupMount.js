import { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import useIsMobile from './useIsMobile';
import useResponsiveContext from './useResponsiveContext';
import usePopupContainer from './usePopupContainer';
import findExamplePhoneMountNode from '../dom/findExamplePhoneMountNode';
import { resolveMobilePopupContainer, resolveMobilePopupModeClass, resolveUseBoundaryMount } from '../dom/resolveMobilePopupContainer';
import { EXAMPLE_PHONE_MOUNT_SELECTORS, MOBILE_POPUP_COVER } from '../tokens';

/**
 * 移动端弹层挂载一站式 hook。
 * 业务只需选 cover，挂载策略由 Provider 模式自动决定。
 *
 * @param {object} [options]
 * @param {(triggerNode?: HTMLElement) => HTMLElement | null} [options.getPopupContainer] 调用方覆盖
 * @param {'boundary' | 'viewport'} [options.cover='boundary']
 *   - boundary：挂 Provider boundary（Modal 推荐默认）
 *   - viewport：罩住当前移动可视区域（container → boundary；viewport 移动端 → body+fixed）
 * @param {boolean} [options.disableExampleFallback=false] 关闭内部额外 DOM 兜底（高级）
 * @param {string[]} [options.exampleSelectors] 自定义兜底选择器（高级）
 *
 * @returns {{
 *   isMobile: boolean,
 *   fixedModeClass: 'kne-is-boundary' | 'kne-is-viewport' | null,
 *   getMountNode: (triggerNode?: HTMLElement) => HTMLElement | null,
 *   getPopupContainer: (triggerNode?: HTMLElement) => HTMLElement,
 *   resolveMount: (triggerNode?: HTMLElement) => {
 *     isMobile: boolean,
 *     useBoundaryMount: boolean,
 *     fixedModeClass: 'kne-is-boundary' | 'kne-is-viewport' | null,
 *     mountNode: HTMLElement | null
 *   },
 *   anchorRef: (node: Element | null) => void,
 * }}
 */
const useMobilePopupMount = (options = {}) => {
  const { getPopupContainer: getPopupContainerProp, cover = MOBILE_POPUP_COVER.boundary, disableExampleFallback = false, exampleSelectors = EXAMPLE_PHONE_MOUNT_SELECTORS } = options;

  const baseIsMobile = useIsMobile();
  const { mode, getBoundaryElement } = useResponsiveContext();
  const getPopupContainerDefault = usePopupContainer();
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
      const mountNode = resolveMobilePopupContainer({
        isMobile: mobile,
        useBoundaryMount: boundaryMount,
        cover,
        getBoundaryElement: getBoundaryElement || getPopupContainerDefault,
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
    [anchor, baseIsMobile, cover, getBoundaryElement, getPopupContainerDefault, getPopupContainerProp, inExamplePhoneFrame, mode, probeExample]
  );

  const getMountNode = useCallback(triggerNode => resolvePlan(triggerNode).mountNode, [resolvePlan]);

  const getPopupContainer = useCallback(
    triggerNode => {
      const node = resolvePlan(triggerNode).mountNode;
      if (node) {
        return node;
      }
      // Antd 要求返回 HTMLElement
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
      getMountNode,
      getPopupContainer,
      resolveMount,
      anchorRef
    }),
    [anchorRef, fixedModeClass, getMountNode, getPopupContainer, isMobile, resolveMount]
  );
};

export default useMobilePopupMount;
