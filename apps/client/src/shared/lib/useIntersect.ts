import { useCallback, useEffect, useRef, useState } from 'react';

type IntersectHandler = (entry: IntersectionObserverEntry, observer: IntersectionObserver) => void;

type UseIntersectProps = {
  onIntersect: IntersectHandler;
  options?: IntersectionObserverInit;
};

export const useIntersect = ({ onIntersect, options }: UseIntersectProps) => {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const callback = useCallback(
    (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      entries.forEach(entry => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) {
          onIntersect(entry, observer);
        }
      });
    },
    [onIntersect],
  );

  useEffect(() => {
    if (!ref.current) return undefined;
    const observer = new IntersectionObserver(callback, options);
    observer.observe(ref.current);
    return () => {
      observer.disconnect();
    };
  }, [ref, options, callback]);

  return { ref, inView };
};
