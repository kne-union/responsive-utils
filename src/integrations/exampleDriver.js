import ResponsiveProvider from '../react/ResponsiveProvider';
import findScrollParent from '../dom/findScrollParent';

export const EXAMPLE_DRIVER_RUNNER_CLASS = 'example-driver-runner';
export const EXAMPLE_DRIVER_PREVIEW_CLASS = 'example-driver-preview';

export const createExampleDriverResponsiveProps = ({ runnerRef, simpleBarRef, hasDeviceFrame = false, containerWidth }) => {
  const useContainerMode = hasDeviceFrame && typeof containerWidth === 'number';

  return {
    mode: useContainerMode ? 'container' : 'viewport',
    containerWidth: useContainerMode ? containerWidth : undefined,
    getBoundaryElement: () => {
      const runner = runnerRef && runnerRef.current;
      if (runner && runner.classList.contains(EXAMPLE_DRIVER_RUNNER_CLASS)) {
        return runner;
      }
      return document.body;
    },
    getScrollElement: () => {
      if (hasDeviceFrame && simpleBarRef && simpleBarRef.current && typeof simpleBarRef.current.getScrollElement === 'function') {
        const scrollElement = simpleBarRef.current.getScrollElement();
        if (scrollElement) {
          return scrollElement;
        }
      }
      const runner = runnerRef && runnerRef.current;
      if (runner) {
        const scrollParent = findScrollParent(runner);
        if (scrollParent) {
          return scrollParent;
        }
      }
      if (runner) {
        const preview = runner.closest('.' + EXAMPLE_DRIVER_PREVIEW_CLASS);
        if (preview) {
          return preview;
        }
      }
      return document.scrollingElement || document.documentElement;
    }
  };
};

export const ExampleDriverResponsiveProvider = ({ runnerRef, simpleBarRef, hasDeviceFrame, containerWidth, children }) => (
  <ResponsiveProvider
    {...createExampleDriverResponsiveProps({
      runnerRef,
      simpleBarRef,
      hasDeviceFrame,
      containerWidth
    })}
  >
    {children}
  </ResponsiveProvider>
);
