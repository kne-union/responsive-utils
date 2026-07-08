import { useLayoutEffect } from 'react';
import getDefaultScrollElement from '../dom/getDefaultScrollElement';
import { findResponsiveBoundary, findResponsiveScroll } from '../dom/findResponsiveTarget';
import { applyViewportCssVars, resetViewportCssVars } from '../dom/viewportCssVars';
import ResponsiveProvider from '../react/ResponsiveProvider';

export const createExampleDriverResponsiveProps = ({ runnerRef, hasDeviceFrame = false, containerWidth, containerHeight }) => {
  const useContainerMode = hasDeviceFrame && typeof containerWidth === 'number';

  return {
    mode: useContainerMode ? 'container' : 'viewport',
    containerWidth: useContainerMode ? containerWidth : undefined,
    containerHeight: useContainerMode ? containerHeight : undefined,
    getBoundaryElement: () => {
      const anchor = runnerRef && runnerRef.current;
      return findResponsiveBoundary(anchor) || document.body;
    },
    getScrollElement: () => {
      const anchor = runnerRef && runnerRef.current;
      return findResponsiveScroll(anchor) || getDefaultScrollElement();
    }
  };
};

const useRunnerViewportCssVars = (runnerRef, hasDeviceFrame, containerWidth, containerHeight) => {
  useLayoutEffect(() => {
    const runner = runnerRef && runnerRef.current;
    if (!runner) {
      return undefined;
    }

    if (hasDeviceFrame && typeof containerWidth === 'number' && typeof containerHeight === 'number') {
      applyViewportCssVars(runner, { width: containerWidth, height: containerHeight });
    } else {
      resetViewportCssVars(runner);
    }

    return () => {
      resetViewportCssVars(runner);
    };
  }, [runnerRef, hasDeviceFrame, containerWidth, containerHeight]);
};

export const ExampleDriverResponsiveProvider = ({ runnerRef, hasDeviceFrame, containerWidth, containerHeight, children }) => {
  useRunnerViewportCssVars(runnerRef, hasDeviceFrame, containerWidth, containerHeight);

  return (
    <ResponsiveProvider
      {...createExampleDriverResponsiveProps({
        runnerRef,
        hasDeviceFrame,
        containerWidth,
        containerHeight
      })}
    >
      {children}
    </ResponsiveProvider>
  );
};
