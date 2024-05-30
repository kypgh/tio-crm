import React, { useState } from "react";
import styled from "styled-components";

const Draggable = styled.div``;

const DragToAction = ({ children }) => {
  const [mouseDown, setMouseDown] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 });
  const [endPosition, setEndPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  const handleMouseMove = (e) => {
    if (mouseDown) {
      if (
        Math.abs(startPosition.x) - Math.abs(e.clientX) > 10 ||
        Math.abs(startPosition.y) - Math.abs(e.clientY) > 10
      ) {
        setDragging(true);
      }
      setCurrentPosition({ x: e.clientX, y: e.clientY });
    } else {
      setDragging(false);
    }
  };
  return (
    <Draggable
      style={{
        position: `${dragging ? "fixed" : "unset"}`,
        top: `${currentPosition.y}px`,
        left: `${currentPosition.x}px`,
      }}
      onMouseDown={(e) => {
        setMouseDown(true);
        setStartPosition({ x: e.clientX, y: e.clientY });
      }}
      onMouseUp={() => {
        setMouseDown(false);
        setDragging(false);
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        setMouseDown(false);
        setDragging(false);
      }}
    >
      {children}
    </Draggable>
  );
};

export default DragToAction;
