import React, { useRef, useEffect, useState } from "react";

const OneLineText = ({ children, width = "140px" }) => {
  const divRef = useRef();
  const [fontSize, setFontSize] = useState(16);

  useEffect(() => {
    const decreaseFontSize = () => {
      if (divRef.current) {
        const div = divRef.current;
        if (
          div.offsetHeight < div.scrollHeight ||
          div.offsetWidth < div.scrollWidth
        ) {
          setFontSize((prevFontSize) => prevFontSize - 1);
        }
      }
    };
    decreaseFontSize();
  }, [fontSize]);

  return (
    <div
      ref={divRef}
      style={{
        fontSize: `${fontSize}px`,
        whiteSpace: "nowrap",
        overflow: "hidden",
        // textOverflow: "ellipsis",
        width: width,
      }}
    >
      {children}
    </div>
  );
};

export default OneLineText;
