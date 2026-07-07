export const BREAKPOINTS = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1600
};

export const MOBILE_BREAKPOINT = BREAKPOINTS.md;
export const IS_MOBILE_QUERY = `(max-width: ${MOBILE_BREAKPOINT}px)`;

export const BREAKPOINT_KEYS = Object.keys(BREAKPOINTS);
