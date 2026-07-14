import { RESPONSIVE_BOUNDARY_CLASS } from './targets';

/** 定位模式 class（组件 SCSS 自行实现 absolute / fixed） */
export const MOBILE_POPUP_MODE = {
  boundary: 'kne-is-boundary',
  viewport: 'kne-is-viewport'
};

/**
 * 弹层罩住范围（业务只选行为）
 * - boundary：罩住 Provider boundary（Modal 默认）
 * - viewport：罩住「当前移动可视区域」（container → boundary；viewport 移动端 → body）
 */
export const MOBILE_POPUP_COVER = {
  boundary: 'boundary',
  viewport: 'viewport'
};

/**
 * 额外挂载根 DOM 选择器（库内部使用，业务一般不传）
 */
export const EXAMPLE_PHONE_MOUNT_SELECTORS = ['.example-driver-device-scroll', `.${RESPONSIVE_BOUNDARY_CLASS}`];
