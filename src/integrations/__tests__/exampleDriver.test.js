import { createExampleDriverResponsiveProps, EXAMPLE_DRIVER_RUNNER_CLASS } from '../exampleDriver';

describe('createExampleDriverResponsiveProps', () => {
  it('should use container mode when device frame has width', () => {
    const props = createExampleDriverResponsiveProps({
      hasDeviceFrame: true,
      containerWidth: 390
    });
    expect(props.mode).toBe('container');
    expect(props.containerWidth).toBe(390);
  });

  it('should resolve runner as boundary element', () => {
    const runner = document.createElement('div');
    runner.className = EXAMPLE_DRIVER_RUNNER_CLASS;
    const props = createExampleDriverResponsiveProps({
      runnerRef: { current: runner }
    });
    expect(props.getBoundaryElement()).toBe(runner);
  });

  it('should fall back to body when runner is missing', () => {
    const props = createExampleDriverResponsiveProps({
      runnerRef: { current: null }
    });
    expect(props.getBoundaryElement()).toBe(document.body);
  });
});
