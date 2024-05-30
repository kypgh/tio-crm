import { Reorder, useDragControls } from "framer-motion";
import React, { useState } from "react";
import { MdOutlineDragHandle } from "react-icons/md";
import styled, { useTheme } from "styled-components";

import { Loader } from "../generic";
import { TableSort } from "./TableGeneric";

const Outest = styled.div`
  height: 100%;
  overflow: hidden;
  background-color: ${({ theme }) => theme.primary};
  padding: 5px;
  padding-top: 0;
  & .noselect {
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Old versions of Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Edge, Opera and Firefox */
  }
`;

const Outer = styled.div`
  height: 100%;
  width: 100%;
  overflow: auto;
  position: relative;

  &::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.primary};
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.brand};
    border-radius: 50px;
  }
  &::-webkit-scrollbar-corner {
    background: ${({ theme }) => theme.primary};
  }
`;

const GridCell = styled.div`
  text-overflow: ellipsis;
  padding: 7px 5px;
  word-break: break-all;
  font-size: 14px;
  text-align: ${({ align }) => align || "left"};
  &:hover {
    background-color: ${({ actionable, theme }) => actionable && theme.primary};
  }
`;

const GridContainer = styled.div`
  display: grid;
  gap: 3px 1px;
  background-color: rgba(52, 68, 80, 0.69);
  width: fit-content;
  min-width: 100%;
  color: ${({ theme }) => theme.textPrimary};

  & ${GridCell} {
    background-color: ${({ theme }) => theme.secondary};
  }
`;

const GridHeaderRow = styled.div`
  display: grid;
  gap: 1px;
  background-color: rgba(52, 68, 80, 0.69);
  color: ${({ theme }) => theme.textPrimary};
  padding-top: 0px;
  position: sticky;
  top: 0;
  min-width: 100%;
  width: fit-content;
`;

const GridHeaderCell = styled.div`
  background-color: ${({ theme }) => theme.primary};
  padding: 3px 5px;
  color: ${({ theme }) => theme.textPrimary};
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  position: relative;

  & > span {
    font-weight: bold;
    font-size: 12px;
    display: flex;
    align-items: center;
  }
`;

const GridRow = styled.div`
  display: contents;
  &:hover > ${GridCell} {
    background-color: ${({ actionable, theme }) => actionable && theme.primary};
    cursor: ${({ actionable }) => actionable && `pointer`};
  }
`;

const MaxHeightContainer = styled.div`
  min-height: ${({ $minusHeight }) => `calc(100vh - ${$minusHeight}px)`};
  max-height: ${({ $minusHeight }) => `calc(100vh - ${$minusHeight}px)`};
`;

const ResizeHandle = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 2px;
  height: 15px;
  cursor: col-resize;
  z-index: 100;
  background-color: ${({ theme }) => theme.secondary};
  &:first-child {
    left: 2px;
  }
  &:last-child {
    right: 2px;
  }
`;

const Header = ({ header, reorderable, onResize }) => {
  const controls = useDragControls();
  const theme = useTheme();
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startingPosition, setStartingPosition] = useState(0);

  const handleResize = (e) => {
    if (isMouseDown) {
      let temp = Number(
        header.gridColumnSize
          .split(",")[0]
          .replace("minmax(", "")
          .replace("px", "")
      );
      if (temp + (e.clientX - startingPosition) > 50) {
        onResize(header, temp + (e.clientX - startingPosition));
        setStartingPosition(e.clientX);
      }
    }
  };

  return (
    <Reorder.Item
      as="div"
      value={header}
      dragListener={false}
      dragControls={controls}
    >
      <GridHeaderCell>
        <span>
          <p>{header.label}</p>
          {header.sortable && (
            <TableSort field={header.value} style={{ marginLeft: "5px" }} />
          )}
        </span>
        {reorderable && (
          <MdOutlineDragHandle
            onPointerDown={(e) => controls.start(e)}
            size={16}
            color={theme.white}
            style={{
              opacity: "0.2",
              cursor: "grabbing",
            }}
            className="noselect"
          />
        )}
        <ResizeHandle
          onDragStart={(e) => {
            setIsMouseDown(true);
            setStartingPosition(e.clientX);
          }}
          onDragEnd={() => setIsMouseDown(false)}
          onDrag={handleResize}
          draggable={true}
        />
      </GridHeaderCell>
    </Reorder.Item>
  );
};

/**
 *
 * @param {{
 *  theme: "light" | "dark",
 *  headers: Object[],
 *  children: ({ Row, Cell }: { Row: GridRow, Cell: GridCell}) => React.ReactNode,
 *  isLoading: boolean,
 *  onReorder: ((newOrder: Object[]) => void) | undefined,
 *  onResize: ((header: Object, newSize: number) => void) | undefined,
 *  minusHeight: number
 * }} param0
 * @returns
 */
const GridTable = ({
  theme,
  headers,
  children,
  isLoading,
  onReorder,
  onResize,
  minusHeight = 270,
}) => {
  const columnSizes = headers.map((x) => x.gridColumnSize).join(" ");

  return (
    <Outest>
      <Outer>
        <Reorder.Group
          as="div"
          axis="x"
          values={headers}
          onReorder={onReorder || (() => {})}
          style={{ position: "sticky", top: "0" }}
        >
          <GridHeaderRow style={{ gridTemplateColumns: columnSizes }}>
            {headers.map((header) => (
              <Header
                key={header.value}
                header={header}
                reorderable={!!onReorder}
                onResize={onResize}
              />
            ))}
          </GridHeaderRow>
        </Reorder.Group>
        <MaxHeightContainer $minusHeight={minusHeight}>
          <GridContainer style={{ gridTemplateColumns: columnSizes }}>
            {isLoading ? (
              <Loader />
            ) : (
              children({
                Row: (props) => <GridRow {...props} />,
                Cell: (props) => <GridCell {...props} />,
              })
            )}
          </GridContainer>
        </MaxHeightContainer>
      </Outer>
    </Outest>
  );
};

export default GridTable;
