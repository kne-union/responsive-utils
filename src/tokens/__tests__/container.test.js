import { RESPONSIVE_CONTAINER_NAME } from '../targets';
import { containerMobileBlock } from '../container';

describe('container tokens', () => {
  it('should expose stable container name', () => {
    expect(RESPONSIVE_CONTAINER_NAME).toBe('kne-responsive');
  });

  it('should build mobile container block without exposing name to callers', () => {
    const block = containerMobileBlock('.demo { color: red; }');
    expect(block).toContain('@container kne-responsive');
    expect(block).toContain('(max-width: 768px)');
    expect(block).toContain('.demo { color: red; }');
  });
});
