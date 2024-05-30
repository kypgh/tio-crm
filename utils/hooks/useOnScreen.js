import { useCallback, useEffect, useRef, useState } from "react";

/**
 * @param {React.RefObject} ref
 * @returns {Boolean}
 *
 * This is used with the table component!
 */
function useOnScreen(rootMargin = "0px") {
  const ref = useRef();
  const [isOnScreen, setIsOnScreen] = useState(false);

  const setRef = useCallback((node) => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsOnScreen(entry.isIntersecting);
      },
      {
        rootMargin,
      }
    );
    if (ref.current) {
      // Make sure to cleanup any events/references added to the last instance
      observer.unobserve(ref.current);
    }

    if (node) {
      // Check if a node is actually passed. Otherwise node would be null.
      // You can now do what you need to, addEventListeners, measure, etc.
      observer.observe(node);
    }

    // Save a reference to the node
    ref.current = node;
  }, []);

  return [isOnScreen, setRef];
}

export default useOnScreen;
