import { BREAKPOINTS, MOBILE_BREAKPOINT } from '../breakpoints';
import fs from 'fs';
import path from 'path';

const SCRIPT_BREAKPOINTS = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1600
};

describe('breakpoints', () => {
  it('should define mobile breakpoint at 768', () => {
    expect(MOBILE_BREAKPOINT).toBe(768);
    expect(BREAKPOINTS.md).toBe(768);
  });

  it('should match generate-scss-tokens script constants', () => {
    expect(BREAKPOINTS).toEqual(SCRIPT_BREAKPOINTS);
  });

  it('should generate scss tokens with matching md value', () => {
    const tokensPath = path.join(__dirname, '../../../scss/_tokens.scss');
    expect(fs.existsSync(tokensPath)).toBe(true);
    const content = fs.readFileSync(tokensPath, 'utf8');
    expect(content).toContain('$breakpoint-md: 768px;');
    expect(content).toContain('$breakpoint-mobile: 768px;');
    expect(content).toContain('$responsive-container-name: kne-responsive;');
    expect(content).toContain('$responsive-boundary-class: kne-responsive-boundary;');
    expect(content).toContain('$responsive-scroll-class: kne-responsive-scroll;');
  });
});
