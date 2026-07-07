import React from 'react';
import { render, screen } from '@testing-library/react';
import ResponsiveProvider from '../ResponsiveProvider';
import usePopupContainer from '../usePopupContainer';
import useScrollElement from '../useScrollElement';
import useIsMobile from '../useIsMobile';

const Probe = ({ onReady }) => {
  const getPopupContainer = usePopupContainer();
  const getScrollElement = useScrollElement();
  const isMobile = useIsMobile();
  React.useEffect(() => {
    onReady({ getPopupContainer, getScrollElement, isMobile });
  }, [getPopupContainer, getScrollElement, isMobile, onReady]);
  return null;
};

describe('ResponsiveProvider', () => {
  it('should use body and documentElement by default', () => {
    let result;
    render(
      <Probe
        onReady={value => {
          result = value;
        }}
      />
    );
    expect(result.getPopupContainer()).toBe(document.body);
    const scrollEl = result.getScrollElement();
    expect(scrollEl === document.documentElement || scrollEl === document.scrollingElement).toBe(true);
  });

  it('should use injected boundary and scroll resolvers', () => {
    const boundary = document.createElement('div');
    const scroll = document.createElement('div');
    let result;
    render(
      <ResponsiveProvider getBoundaryElement={() => boundary} getScrollElement={() => scroll}>
        <Probe
          onReady={value => {
            result = value;
          }}
        />
      </ResponsiveProvider>
    );
    expect(result.getPopupContainer()).toBe(boundary);
    expect(result.getScrollElement()).toBe(scroll);
  });

  it('should treat container mode width as mobile', () => {
    let result;
    render(
      <ResponsiveProvider mode="container" containerWidth={390}>
        <Probe
          onReady={value => {
            result = value;
          }}
        />
      </ResponsiveProvider>
    );
    expect(result.isMobile).toBe(true);
  });
});
