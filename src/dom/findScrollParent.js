const isScrollable = element => {
  if (!element || element === document.body || element === document.documentElement) {
    return false;
  }
  const style = window.getComputedStyle(element);
  const overflowY = style.overflowY;
  const overflowX = style.overflowX;
  const canScrollY = (overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay') && element.scrollHeight > element.clientHeight;
  const canScrollX = (overflowX === 'auto' || overflowX === 'scroll' || overflowX === 'overlay') && element.scrollWidth > element.clientWidth;
  return canScrollY || canScrollX;
};

const findScrollParent = element => {
  if (typeof window === 'undefined' || !element) {
    return null;
  }
  let current = element.parentElement;
  while (current) {
    if (isScrollable(current)) {
      return current;
    }
    current = current.parentElement;
  }
  return null;
};

export default findScrollParent;
