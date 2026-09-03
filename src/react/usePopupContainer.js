import { useCallback } from 'react';
import useResponsiveContext from './useResponsiveContext';

/**
 * @deprecated 仅返回 boundary，不含 Modal / 移动端策略。
 * 弹层挂载请用 `usePopupMount().getPopupContainer`。
 * 若只要 boundary，用 `useResponsiveContext().getBoundaryElement`。
 */
const usePopupContainer = () => {
  const { getBoundaryElement } = useResponsiveContext();
  return useCallback(() => getBoundaryElement(), [getBoundaryElement]);
};

export default usePopupContainer;
