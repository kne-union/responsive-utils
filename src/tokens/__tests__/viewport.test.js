import { createViewportCssVars, defaultViewportCssVars, VIEWPORT_HEIGHT_VAR, VIEWPORT_WIDTH_VAR } from '../viewport';

describe('viewport tokens', () => {
  test('defaultViewportCssVars uses browser viewport units', () => {
    expect(defaultViewportCssVars[VIEWPORT_WIDTH_VAR]).toBe('100vw');
    expect(defaultViewportCssVars[VIEWPORT_HEIGHT_VAR]).toBe('100vh');
  });

  test('createViewportCssVars returns pixel values when dimensions provided', () => {
    expect(createViewportCssVars({ width: 390, height: 844 })).toMatchObject({
      [VIEWPORT_WIDTH_VAR]: '390px',
      [VIEWPORT_HEIGHT_VAR]: '844px'
    });
  });

  test('createViewportCssVars falls back to defaults without dimensions', () => {
    expect(createViewportCssVars()).toEqual(defaultViewportCssVars);
  });
});
