const getDefaultScrollElement = () => {
  if (typeof document === 'undefined') {
    return null;
  }
  return document.scrollingElement || document.documentElement || document.body || null;
};

export default getDefaultScrollElement;
