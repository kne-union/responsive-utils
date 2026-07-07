import getDefaultScrollElement from '../dom/getDefaultScrollElement';
import { findResponsiveBoundary, findResponsiveScroll } from '../dom/findResponsiveTarget';
import ResponsiveProvider from '../react/ResponsiveProvider';

export const createExampleDriverResponsiveProps = ({ runnerRef, hasDeviceFrame = false, containerWidth }) => {
  const useContainerMode = hasDeviceFrame && typeof containerWidth === 'number';

  return {
    mode: useContainerMode ? 'container' : 'viewport',
    containerWidth: useContainerMode ? containerWidth : undefined,
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

export const ExampleDriverResponsiveProvider = ({ runnerRef, hasDeviceFrame, containerWidth, children }) => (
  <ResponsiveProvider
    {...createExampleDriverResponsiveProps({
      runnerRef,
      hasDeviceFrame,
      containerWidth
    })}
  >
    {children}
  </ResponsiveProvider>
);
