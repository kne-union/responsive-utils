import { RESPONSIVE_CONTAINER_CLASS, RESPONSIVE_BOUNDARY_CLASS, RESPONSIVE_SCROLL_CLASS, RESPONSIVE_TARGET_CLASSES } from '../targets';

describe('responsive target classes', () => {
  it('should expose stable class names', () => {
    expect(RESPONSIVE_CONTAINER_CLASS).toBe('kne-responsive-container');
    expect(RESPONSIVE_BOUNDARY_CLASS).toBe('kne-responsive-boundary');
    expect(RESPONSIVE_SCROLL_CLASS).toBe('kne-responsive-scroll');
    expect(RESPONSIVE_TARGET_CLASSES).toEqual({
      container: 'kne-responsive-container',
      boundary: 'kne-responsive-boundary',
      scroll: 'kne-responsive-scroll'
    });
  });
});
