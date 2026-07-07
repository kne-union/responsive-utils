import { RESPONSIVE_BOUNDARY_CLASS, RESPONSIVE_SCROLL_CLASS } from '../../tokens/targets';
import { findResponsiveBoundary, findResponsiveScroll } from '../findResponsiveTarget';

describe('findResponsiveTarget', () => {
  it('should find boundary by class from anchor', () => {
    const boundary = document.createElement('div');
    boundary.className = RESPONSIVE_BOUNDARY_CLASS;
    const child = document.createElement('span');
    boundary.appendChild(child);
    document.body.appendChild(boundary);

    expect(findResponsiveBoundary(child)).toBe(boundary);

    document.body.removeChild(boundary);
  });

  it('should find scroll container by class from anchor', () => {
    const scroll = document.createElement('div');
    scroll.className = RESPONSIVE_SCROLL_CLASS;
    const child = document.createElement('span');
    scroll.appendChild(child);
    document.body.appendChild(scroll);

    expect(findResponsiveScroll(child)).toBe(scroll);

    document.body.removeChild(scroll);
  });
});
