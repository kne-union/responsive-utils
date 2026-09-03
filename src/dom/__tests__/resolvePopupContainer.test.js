import { MOBILE_POPUP_COVER, MOBILE_POPUP_MODE } from '../../tokens/mobilePopup';
import { resolvePopupContainer, resolveMobilePopupContainer, resolveMobilePopupModeClass, resolveUseBoundaryMount, hoistOutOfModalRoot } from '../resolvePopupContainer';

describe('resolvePopupContainer', () => {
  const boundary = { id: 'boundary' };

  it('should prefer custom getPopupContainer', () => {
    const custom = { id: 'custom' };
    const result = resolvePopupContainer({
      isMobile: true,
      useBoundaryMount: false,
      cover: MOBILE_POPUP_COVER.viewport,
      getBoundaryElement: () => boundary,
      getPopupContainer: () => custom
    });
    expect(result).toBe(custom);
  });

  it('boundary cover always uses boundary (including real mobile)', () => {
    const result = resolvePopupContainer({
      isMobile: true,
      useBoundaryMount: false,
      cover: MOBILE_POPUP_COVER.boundary,
      getBoundaryElement: () => boundary
    });
    expect(result).toBe(boundary);
  });

  it('viewport cover + boundary mount uses boundary (example / container)', () => {
    const result = resolvePopupContainer({
      isMobile: true,
      useBoundaryMount: true,
      cover: MOBILE_POPUP_COVER.viewport,
      getBoundaryElement: () => boundary
    });
    expect(result).toBe(boundary);
  });

  it('viewport cover + real mobile uses document.body', () => {
    const result = resolvePopupContainer({
      isMobile: true,
      useBoundaryMount: false,
      cover: MOBILE_POPUP_COVER.viewport,
      getBoundaryElement: () => boundary
    });
    expect(result).toBe(document.body);
  });

  it('desktop uses boundary', () => {
    const result = resolvePopupContainer({
      isMobile: false,
      useBoundaryMount: false,
      cover: MOBILE_POPUP_COVER.boundary,
      getBoundaryElement: () => boundary
    });
    expect(result).toBe(boundary);
  });

  it('mounts beside ant-modal-root when trigger is inside modal', () => {
    const host = document.createElement('div');
    const modalRoot = document.createElement('div');
    modalRoot.className = 'ant-modal-root';
    const trigger = document.createElement('button');
    host.appendChild(modalRoot);
    modalRoot.appendChild(trigger);
    document.body.appendChild(host);

    const result = resolvePopupContainer({
      triggerNode: trigger,
      getBoundaryElement: () => boundary
    });
    expect(result).toBe(host);

    document.body.removeChild(host);
  });

  it('escapeModal=false keeps boundary even inside modal', () => {
    const host = document.createElement('div');
    const modalRoot = document.createElement('div');
    modalRoot.className = 'ant-modal-root';
    const trigger = document.createElement('button');
    host.appendChild(modalRoot);
    modalRoot.appendChild(trigger);
    document.body.appendChild(host);

    const result = resolvePopupContainer({
      triggerNode: trigger,
      escapeModal: false,
      getBoundaryElement: () => boundary
    });
    expect(result).toBe(boundary);

    document.body.removeChild(host);
  });

  it('resolveMobilePopupContainer is alias of resolvePopupContainer', () => {
    expect(resolveMobilePopupContainer).toBe(resolvePopupContainer);
  });
});

describe('hoistOutOfModalRoot', () => {
  it('returns modal-root parent or null', () => {
    expect(hoistOutOfModalRoot(null)).toBe(null);
    expect(hoistOutOfModalRoot(document.createElement('div'))).toBe(null);

    const host = document.createElement('div');
    const modalRoot = document.createElement('div');
    modalRoot.className = 'ant-modal-root';
    const child = document.createElement('span');
    host.appendChild(modalRoot);
    modalRoot.appendChild(child);
    expect(hoistOutOfModalRoot(child)).toBe(host);
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
