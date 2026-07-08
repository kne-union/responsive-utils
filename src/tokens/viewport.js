export const VIEWPORT_WIDTH_VAR = '--kne-viewport-width';
export const VIEWPORT_HEIGHT_VAR = '--kne-viewport-height';
export const VIEWPORT_INLINE_SIZE_VAR = '--kne-viewport-inline-size';
export const VIEWPORT_BLOCK_SIZE_VAR = '--kne-viewport-block-size';

export const VIEWPORT_CSS_VAR_NAMES = [VIEWPORT_WIDTH_VAR, VIEWPORT_HEIGHT_VAR, VIEWPORT_INLINE_SIZE_VAR, VIEWPORT_BLOCK_SIZE_VAR];

export const defaultViewportCssVars = {
  [VIEWPORT_WIDTH_VAR]: '100vw',
  [VIEWPORT_HEIGHT_VAR]: '100vh',
  [VIEWPORT_INLINE_SIZE_VAR]: '100vw',
  [VIEWPORT_BLOCK_SIZE_VAR]: '100vh'
};

export const createViewportCssVars = ({ width, height } = {}) => {
  if (typeof width !== 'number' || typeof height !== 'number') {
    return { ...defaultViewportCssVars };
  }
  const widthPx = `${width}px`;
  const heightPx = `${height}px`;
  return {
    [VIEWPORT_WIDTH_VAR]: widthPx,
    [VIEWPORT_HEIGHT_VAR]: heightPx,
    [VIEWPORT_INLINE_SIZE_VAR]: widthPx,
    [VIEWPORT_BLOCK_SIZE_VAR]: heightPx
  };
};
