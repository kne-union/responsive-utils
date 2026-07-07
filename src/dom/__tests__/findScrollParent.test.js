import findScrollParent from '../findScrollParent';

describe('findScrollParent', () => {
  it('should find ancestor with scrollable overflow', () => {
    const root = document.createElement('div');
    const scrollable = document.createElement('div');
    const child = document.createElement('div');
    scrollable.style.overflow = 'auto';
    scrollable.style.height = '100px';
    Object.defineProperty(scrollable, 'scrollHeight', { value: 200, configurable: true });
    Object.defineProperty(scrollable, 'clientHeight', { value: 100, configurable: true });
    root.appendChild(scrollable);
    scrollable.appendChild(child);
    document.body.appendChild(root);

    const originalGetComputedStyle = window.getComputedStyle;
    window.getComputedStyle = element => {
      if (element === scrollable) {
        return { overflowY: 'auto', overflowX: 'visible' };
      }
      return originalGetComputedStyle(element);
    };

    expect(findScrollParent(child)).toBe(scrollable);

    window.getComputedStyle = originalGetComputedStyle;
    document.body.removeChild(root);
  });

  it('should return null when no scroll parent exists', () => {
    const child = document.createElement('div');
    document.body.appendChild(child);
    expect(findScrollParent(child)).toBeNull();
    document.body.removeChild(child);
  });
});
