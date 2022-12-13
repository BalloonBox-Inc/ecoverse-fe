import { useEffect, useState } from 'react';

export const useIntersectionObserver = (
  root: HTMLElement | null,
  callback: IntersectionObserverCallback,
  observerOptions: IntersectionObserverInit
) => {
  const [observer, setObserver] = useState<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!root) return;
    if (observer) return;
    const observerConfig = {
      root,
      ...observerOptions,
    };
    const observerInstance = new IntersectionObserver(callback, observerConfig);
    setObserver(observerInstance);
  }, [callback, observer, observerOptions, root]);

  return observer;
};
