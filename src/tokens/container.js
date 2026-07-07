import { BREAKPOINTS, MOBILE_BREAKPOINT } from './breakpoints';
import { RESPONSIVE_CONTAINER_NAME } from './targets';

export { RESPONSIVE_CONTAINER_NAME } from './targets';

export const containerQuery = condition => `@container ${RESPONSIVE_CONTAINER_NAME} ${condition}`;

export const containerDownCondition = breakpointPx => `(max-width: ${breakpointPx}px)`;

export const mobileContainerCondition = containerDownCondition(MOBILE_BREAKPOINT);

export const containerMobileBlock = rules => `${containerQuery(mobileContainerCondition)} {\n${rules}\n}`;

export const containerDownBlock = (breakpointKey, rules) => {
  const width = BREAKPOINTS[breakpointKey];
  if (typeof width !== 'number') {
    throw new Error(`Unknown breakpoint: ${breakpointKey}`);
  }
  return `${containerQuery(containerDownCondition(width))} {\n${rules}\n}`;
};
