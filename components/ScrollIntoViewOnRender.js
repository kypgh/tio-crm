import React, {
  useEffect,
  useRef,
  Children,
  isValidElement,
  cloneElement,
} from "react";

const ScrollIntoViewOnRender = ({ children }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const childWithRef = Children.map(children, (child) =>
    isValidElement(child) ? cloneElement(child, { ref: containerRef }) : null
  );

  return <>{childWithRef}</>;
};

export default ScrollIntoViewOnRender;
