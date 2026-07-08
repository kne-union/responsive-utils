import { applyViewportCssVars, resetViewportCssVars } from '../viewportCssVars';
import { VIEWPORT_HEIGHT_VAR, VIEWPORT_WIDTH_VAR } from '../../tokens/viewport';

describe('viewportCssVars', () => {
  test('applyViewportCssVars sets inline custom properties', () => {
    const element = document.createElement('div');
    applyViewportCssVars(element, { width: 390, height: 844 });

    expect(element.style.getPropertyValue(VIEWPORT_WIDTH_VAR)).toBe('390px');
    expect(element.style.getPropertyValue(VIEWPORT_HEIGHT_VAR)).toBe('844px');
  });

  test('resetViewportCssVars removes inline custom properties', () => {
    const element = document.createElement('div');
    applyViewportCssVars(element, { width: 390, height: 844 });
    resetViewportCssVars(element);

    expect(element.style.getPropertyValue(VIEWPORT_WIDTH_VAR)).toBe('');
    expect(element.style.getPropertyValue(VIEWPORT_HEIGHT_VAR)).toBe('');
  });
});
