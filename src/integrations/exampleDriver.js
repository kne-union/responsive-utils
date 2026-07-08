import { useLayoutEffect } from 'react';
import getDefaultScrollElement from '../dom/getDefaultScrollElement';
import { findResponsiveBoundary, findResponsiveScroll } from '../dom/findResponsiveTarget';
import { applyViewportCssVars, resetViewportCssVars } from '../dom/viewportCssVars';
import ResponsiveProvider from '../react/ResponsiveProvider';

const resolveExampleDriverBoundary = (runnerRef, hasDeviceFrame) => {
  const runner = runnerRef && runnerRef.current;
  if (!runner) {
    return null;
  }
  if (hasDeviceFrame) {
    const deviceScroll = runner.closest('.example-driver-device-scroll');
    if (deviceScroll) {
      return deviceScroll;
    }
  }
  return findResponsiveBoundary(runner);
};

const resolveExampleDriverViewportTarget = (runner, hasDeviceFrame) => {
  if (!runner) {
    return null;
  }
  if (hasDeviceFrame) {
    return runner.closest('.example-driver-device-scroll') || runner;
  }
  return runner;
};

export const createExampleDriverResponsiveProps = ({ runnerRef, hasDeviceFrame = false, containerWidth, containerHeight }) => {
  const useContainerMode = hasDeviceFrame && typeof containerWidth === 'number';

  return {
    mode: useContainerMode ? 'container' : 'viewport',
    containerWidth: useContainerMode ? containerWidth : undefined,
    containerHeight: useContainerMode ? containerHeight : undefined,
    getBoundaryElement: () => {
      return resolveExampleDriverBoundary(runnerRef, hasDeviceFrame) || document.body;
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

    const target = resolveExampleDriverViewportTarget(runner, hasDeviceFrame);

    if (hasDeviceFrame && typeof containerWidth === 'number' && typeof containerHeight === 'number') {
      applyViewportCssVars(target, { width: containerWidth, height: containerHeight });
    } else {
      resetViewportCssVars(target);
    }

    return () => {
      resetViewportCssVars(target);
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
