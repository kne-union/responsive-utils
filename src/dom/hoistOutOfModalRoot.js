/**
 * If `node` is inside `.ant-modal-root`, return that root's parent (sibling host)
 * so overlays can stack with antd Modal via zIndexContext.
 * @param {Element | null | undefined} node
 * @returns {HTMLElement | null}
 */
export const hoistOutOfModalRoot = node => {
  if (!node || typeof node.closest !== 'function') {
    return null;
  }
  const root = node.closest('.ant-modal-root');
  return (root && root.parentElement) || null;
};

export default hoistOutOfModalRoot;
