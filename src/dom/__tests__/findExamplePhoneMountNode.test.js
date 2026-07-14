import { RESPONSIVE_BOUNDARY_CLASS } from '../../tokens/targets';
import { EXAMPLE_PHONE_MOUNT_SELECTORS } from '../../tokens/mobilePopup';
import { findExamplePhoneMountNode } from '../findExamplePhoneMountNode';

describe('findExamplePhoneMountNode', () => {
  it('should find example-driver scroll from anchor', () => {
    const scroll = document.createElement('div');
    scroll.className = 'example-driver-device-scroll';
    const child = document.createElement('span');
    scroll.appendChild(child);
    document.body.appendChild(scroll);

    expect(findExamplePhoneMountNode(child)).toBe(scroll);

    document.body.removeChild(scroll);
  });

  it('should find responsive boundary from anchor', () => {
    const boundary = document.createElement('div');
    boundary.className = RESPONSIVE_BOUNDARY_CLASS;
    const child = document.createElement('span');
    boundary.appendChild(child);
    document.body.appendChild(boundary);

    expect(findExamplePhoneMountNode(child)).toBe(boundary);

    document.body.removeChild(boundary);
  });

  it('should return null when outside example frame', () => {
    const orphan = document.createElement('div');
    document.body.appendChild(orphan);
    expect(findExamplePhoneMountNode(orphan)).toBe(null);
    document.body.removeChild(orphan);
  });

  it('should respect custom selectors', () => {
    const custom = document.createElement('div');
    custom.className = 'my-phone-preview';
    const child = document.createElement('span');
    custom.appendChild(child);
    document.body.appendChild(custom);

    expect(findExamplePhoneMountNode(child, EXAMPLE_PHONE_MOUNT_SELECTORS)).toBe(null);
    expect(findExamplePhoneMountNode(child, ['.my-phone-preview'])).toBe(custom);

    document.body.removeChild(custom);
  });
});
