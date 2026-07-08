import { createViewportCssVars, VIEWPORT_CSS_VAR_NAMES } from '../tokens/viewport';

export const applyViewportCssVars = (element, dimensions) => {
  if (!element) {
    return;
  }
  const vars = createViewportCssVars(dimensions);
  Object.entries(vars).forEach(([name, value]) => {
    element.style.setProperty(name, value);
  });
};

export const resetViewportCssVars = element => {
  if (!element) {
    return;
  }
  VIEWPORT_CSS_VAR_NAMES.forEach(name => {
    element.style.removeProperty(name);
  });
};
