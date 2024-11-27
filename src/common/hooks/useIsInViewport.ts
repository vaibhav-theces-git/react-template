import { useState, useMemo, useEffect, RefObject } from "react";
// based on https://bobbyhadz.com/blog/react-check-if-element-in-viewport
// Similar approach in => https://www.npmjs.com/package/react-intersection-observer
// => https://ahooks.js.org/hooks/use-in-viewport/

/**
 *
 * @param ref
 * @param disconnectAfterFirstView - stop observe after first view
 * @returns object with attribute viewed (came to viewport once) and attribute isInsideViewport - current status of component (inside or not) viewport
 */
export const useIsInViewport = (
  ref: RefObject<HTMLElement>,
  disconnectAfterFirstView: boolean
) => {
  const [viewed, setViewed] = useState(false);

  const [isInsideViewport, setIsInsideViewport] = useState(false);

  const observer = useMemo(
    () =>
      new IntersectionObserver(([entry]) =>
        setIsInsideViewport(entry.isIntersecting)
      ),
    []
  );

  useEffect(() => {
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      observer.disconnect();
    };
  }, [ref, observer]);
  //  No need to observe always if disconnectAfterFirstView is set to true
  useEffect(() => {
    if (disconnectAfterFirstView && isInsideViewport) {
      observer.disconnect();
    }
  }, [isInsideViewport, disconnectAfterFirstView, observer]);

  useEffect(() => {
    // set only once
    if (isInsideViewport === true) {
      setViewed(isInsideViewport);
    }
  }, [isInsideViewport]);

  return { viewed, isInsideViewport };
};
