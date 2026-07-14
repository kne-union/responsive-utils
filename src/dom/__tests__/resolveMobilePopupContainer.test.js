import { MOBILE_POPUP_COVER, MOBILE_POPUP_MODE } from '../../tokens/mobilePopup';
import { resolveMobilePopupContainer, resolveMobilePopupModeClass, resolveUseBoundaryMount } from '../resolveMobilePopupContainer';

describe('resolveMobilePopupContainer', () => {
  const boundary = { id: 'boundary' };

  it('should prefer custom getPopupContainer', () => {
    const custom = { id: 'custom' };
    const result = resolveMobilePopupContainer({
      isMobile: true,
      useBoundaryMount: false,
      cover: MOBILE_POPUP_COVER.viewport,
      getBoundaryElement: () => boundary,
      getPopupContainer: () => custom
    });
    expect(result).toBe(custom);
  });

  it('boundary cover always uses boundary (including real mobile)', () => {
    const result = resolveMobilePopupContainer({
      isMobile: true,
      useBoundaryMount: false,
      cover: MOBILE_POPUP_COVER.boundary,
      getBoundaryElement: () => boundary
    });
    expect(result).toBe(boundary);
  });

  it('viewport cover + boundary mount uses boundary (example / container)', () => {
    const result = resolveMobilePopupContainer({
      isMobile: true,
      useBoundaryMount: true,
      cover: MOBILE_POPUP_COVER.viewport,
      getBoundaryElement: () => boundary
    });
    expect(result).toBe(boundary);
  });

  it('viewport cover + real mobile uses document.body', () => {
    const result = resolveMobilePopupContainer({
      isMobile: true,
      useBoundaryMount: false,
      cover: MOBILE_POPUP_COVER.viewport,
      getBoundaryElement: () => boundary
    });
    expect(result).toBe(document.body);
  });

  it('desktop uses boundary', () => {
    const result = resolveMobilePopupContainer({
      isMobile: false,
      useBoundaryMount: false,
      cover: MOBILE_POPUP_COVER.boundary,
      getBoundaryElement: () => boundary
    });
    expect(result).toBe(boundary);
  });
});

describe('resolveUseBoundaryMount / resolveMobilePopupModeClass', () => {
  it('useBoundaryMount true for container or example while mobile', () => {
    expect(resolveUseBoundaryMount({ isMobile: true, mode: 'container' })).toBe(true);
    expect(resolveUseBoundaryMount({ isMobile: true, mode: 'viewport', inExamplePhoneFrame: true })).toBe(true);
    expect(resolveUseBoundaryMount({ isMobile: true, mode: 'viewport', inExamplePhoneFrame: false })).toBe(false);
    expect(resolveUseBoundaryMount({ isMobile: false, mode: 'container' })).toBe(false);
  });

  it('mode class: desktop null; boundary cover always kne-is-boundary when mobile', () => {
    expect(resolveMobilePopupModeClass({ isMobile: false, useBoundaryMount: false })).toBe(null);
    expect(
      resolveMobilePopupModeClass({
        isMobile: true,
        useBoundaryMount: false,
        cover: MOBILE_POPUP_COVER.boundary
      })
    ).toBe(MOBILE_POPUP_MODE.boundary);
  });

  it('mode class: viewport cover uses kne-is-viewport only on real mobile', () => {
    expect(
      resolveMobilePopupModeClass({
        isMobile: true,
        useBoundaryMount: true,
        cover: MOBILE_POPUP_COVER.viewport
      })
    ).toBe(MOBILE_POPUP_MODE.boundary);
    expect(
      resolveMobilePopupModeClass({
        isMobile: true,
        useBoundaryMount: false,
        cover: MOBILE_POPUP_COVER.viewport
      })
    ).toBe(MOBILE_POPUP_MODE.viewport);
  });
});
