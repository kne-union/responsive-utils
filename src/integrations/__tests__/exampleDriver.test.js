import { createExampleDriverResponsiveProps } from '../exampleDriver';
import { RESPONSIVE_BOUNDARY_CLASS, RESPONSIVE_SCROLL_CLASS } from '../../tokens/targets';

describe('createExampleDriverResponsiveProps', () => {
  it('should use container mode when device frame has width', () => {
    const props = createExampleDriverResponsiveProps({
      hasDeviceFrame: true,
      containerWidth: 390
    });
    expect(props.mode).toBe('container');
    expect(props.containerWidth).toBe(390);
  });

  it('should resolve boundary element by responsive class', () => {
    const runner = document.createElement('div');
    runner.className = `example-driver-runner ${RESPONSIVE_BOUNDARY_CLASS}`;
    const props = createExampleDriverResponsiveProps({
      runnerRef: { current: runner }
    });
    expect(props.getBoundaryElement()).toBe(runner);
  });

  it('should resolve scroll element by responsive class', () => {
    const scroll = document.createElement('div');
    scroll.className = RESPONSIVE_SCROLL_CLASS;
    const runner = document.createElement('div');
    runner.className = RESPONSIVE_BOUNDARY_CLASS;
    scroll.appendChild(runner);
    document.body.appendChild(scroll);

    const props = createExampleDriverResponsiveProps({
      runnerRef: { current: runner }
    });
    expect(props.getScrollElement()).toBe(scroll);

    document.body.removeChild(scroll);
  });

  it('should fall back to body when boundary is missing', () => {
    const props = createExampleDriverResponsiveProps({
      runnerRef: { current: null }
    });
    expect(props.getBoundaryElement()).toBe(document.body);
  });
});
