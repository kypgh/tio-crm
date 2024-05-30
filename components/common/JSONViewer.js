import React, { useEffect, useRef, useState } from "react";
import AnimateHeight from "react-animate-height";
import styled from "styled-components";
import useTheme from "../../utils/hooks/useTheme";
import _ from "lodash";
import { FaPencilAlt, FaPlus, FaTimes } from "react-icons/fa";
import TooltipWrapper from "../TooltipWrapper";

const ModalBody = styled.div`
  color: #000;
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  background-color: ${({ theme }) => theme.secondary};
  border-radius: 5px;
  padding: 10px;
  min-height: 300px;
  min-width: 400px;
`;

const Line = styled.div`
  display: flex;
  gap: 20px;
  cursor: pointer;
  margin-bottom: 3px;

  padding-top: ${({ editable }) => (editable ? "10px" : "0")};

  &:hover {
    background-color: #ffffff33;
  }

  & > p {
    flex-shrink: 0;
    color: ${({ theme }) => theme.textSecondary};
    text-align: right;
    width: 60px;
    border-right: 1px solid ${({ theme }) => theme.textSecondary};
    padding-right: 10px;
  }
`;

const PaddedPair = styled.div`
  display: flex;
  align-items: ${({ editable }) => (editable ? "flex-start" : "center")};
  flex-direction: ${({ editable }) => (editable ? "column" : "row")};
  gap: 10px;
  width: 100%;
  margin-left: ${({ level }) => level * 20}px;
  color: ${({ theme }) => theme.textSecondary};
  position: relative;
  & > button {
    position: absolute;
    right: 100%;
    background-color: transparent;
    color: ${({ theme }) => theme.textSecondary};
    border: none;
    outline: none;
    padding: 0 5px;
    cursor: pointer;
    &:hover {
      color: ${({ theme }) => theme.textPrimary};
    }
  }
`;

const JSONKey = styled.div`
  display: flex;
  align-items: center;
  height: 20px;
  gap: 5px;
  color: ${({ theme }) => theme.brand};
  & svg {
    color: ${({ theme }) => theme.pendingColor};
  }
`;

const StringValue = styled.span`
  color: ${({ theme }) => theme.pendingColor};
`;

const NumberValue = styled.span`
  color: ${({ theme }) => theme.success};
`;
const TextAreaSize = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  & span {
    visibility: hidden;
    min-width: 50px;
    min-height: 20px;
    padding: 5px;
    box-sizing: border-box;
  }
  & textarea {
    color: inherit;
    outline: none;
    font-size: inherit;
    background-color: transparent;
    flex: 1 1 auto;
    padding: 5px;
    position: absolute;
    box-sizing: border-box;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    min-width: 50px;
    min-height: 20px;
  }
`;

const ExtrasWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;

  & svg {
    background-color: ${({ theme }) => theme.secondary};
    border-radius: 5px;
    width: 21px;
    height: 21px;
    padding: 1.5px;
  }
`;

const KeyTextarea = styled.input`
  color: inherit;
  outline: none;
  background-color: transparent;
  border: none;

  &:focus {
    border: 1px solid ${({ theme }) => theme.brand};
  }
`;

const Expandable = ({ children, isExpanded = true }) => {
  const [expanded, setExpanded] = useState(true);
  useEffect(() => {
    if (isExpanded === null) return;
    setExpanded(isExpanded);
  }, [isExpanded]);
  return (
    <AnimateHeight duration={200} height={expanded ? "auto" : 20}>
      {children({ expanded, toggleExpand: () => setExpanded(!expanded) })}
    </AnimateHeight>
  );
};

const JSONTypes = ({ value, editable, onEdit, affix }) => {
  const [v, setV] = useState(value);
  const [isEditing, setIsEditing] = useState(false);
  const ref = useRef();
  useEffect(() => {
    setV(value);
  }, [value]);

  if (value instanceof Object) {
    return;
  }
  if (value instanceof Array) {
    return;
  }
  if (typeof value === "string") {
    return (
      <StringValue
        onClick={() => {
          if (editable) {
            setIsEditing(true);
            setTimeout(() => {
              ref.current.setSelectionRange(-1, -1);
              ref.current.focus();
            }, 0);
          }
        }}
      >
        {isEditing ? (
          <TextAreaSize>
            <span>{v}</span>
            <textarea
              ref={ref}
              type="text"
              value={v}
              onChange={(e) => setV(e.target.value)}
              onBlur={() => {
                onEdit(v);
                setIsEditing(false);
              }}
            />
          </TextAreaSize>
        ) : (
          <>&quot;{value}&quot;</>
        )}
        {affix}
      </StringValue>
    );
  }
  if (typeof value === "number") {
    return <NumberValue>{value}</NumberValue>;
  }
  return value;
};

const JSONLine = ({
  data,
  line,
  onClick,
  marked,
  editable,
  onEdit = () => null,
  onKeyEdit = () => null,
  onDelete = () => null,
}) => {
  const { key, value, level } = data;

  const [keyValue, setKeyValue] = useState(
    key.substring(key.lastIndexOf(".") + 1)
  );

  return (
    <Line editable={editable}>
      <p>{line}</p>
      <PaddedPair
        editable={editable}
        level={level}
        onClick={() => {
          onClick({
            key,
            value,
            line,
          });
        }}
      >
        <JSONKey>
          {marked && (
            <TooltipWrapper tooltip="Currently editing">
              <FaPencilAlt size={10} />
            </TooltipWrapper>
          )}
          {editable && (
            <TooltipWrapper tooltip="Remove from editing">
              <FaTimes
                size={10}
                onClick={() => onDelete({ key, value, line })}
              />
            </TooltipWrapper>
          )}
          {editable ? (
            <KeyTextarea
              value={keyValue}
              type="text"
              onChange={(e) => {
                setKeyValue(e.target.value);
              }}
              onBlur={() => {
                onKeyEdit({
                  oldKey: key,
                  newKey: key.substring(0, key.lastIndexOf(".") + 1) + keyValue,
                });
              }}
            />
          ) : (
            <span>{key.substring(key.lastIndexOf(".") + 1)}:</span>
          )}
        </JSONKey>{" "}
        <JSONTypes
          keyValue={key}
          value={value}
          editable={editable}
          onEdit={(v) => onEdit({ value: v, key })}
          affix={","}
        />
      </PaddedPair>
    </Line>
  );
};

const JSONExtras = ({
  level,
  value,
  line,
  expanded,
  toggleExpanded,
  extras,
  keyValue,
}) => {
  return (
    <Line>
      <p>{line}</p>
      <PaddedPair
        level={level}
        onClick={() => {
          if (toggleExpanded) {
            toggleExpanded();
          }
        }}
      >
        {toggleExpanded && (
          <button onClick={toggleExpanded} type="button">
            {expanded ? "-" : "+"}
          </button>
        )}
        {value}
        {extras && level !== 0 && (
          <ExtrasWrapper
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {extras({ level, value, line, expanded, toggleExpanded, keyValue })}
          </ExtrasWrapper>
        )}
      </PaddedPair>
    </Line>
  );
};

function countLines(data) {
  let counter = 1;
  Object.values(data).forEach((v) => {
    if (v instanceof Object) {
      counter += countLines(v) + 1;
    } else {
      counter++;
    }
  });
  return counter;
}

const JSONViewer = ({
  data,
  dataKey = "",
  markedKeys = [],
  level = 0,
  counter = 1,
  expandAll,
  onKeyEdit = () => null,
  onKeyValueClick = () => null,
  onEdit = () => null,
  onDelete = () => null,
  editable,
  extraLineAdditions,
}) => {
  const { theme } = useTheme();

  return (
    <Expandable isExpanded={dataKey ? expandAll : null}>
      {({ toggleExpand, expanded }) => (
        <>
          <JSONExtras
            level={level}
            key={"op_" + dataKey}
            value={
              dataKey
                ? `${dataKey.substring(dataKey.lastIndexOf(".") + 1)}: {`
                : "{"
            }
            line={counter}
            expanded={dataKey && expanded}
            toggleExpanded={dataKey && toggleExpand}
            extras={extraLineAdditions}
            keyValue={dataKey}
          />

          {
            Object.entries(data).reduce(
              (acc, [key2, value], idx, _orig) => {
                const currentKey = dataKey ? `${dataKey}.${key2}` : key2;
                if (value instanceof Object) {
                  let res = (
                    <JSONViewer
                      editable={editable}
                      key={currentKey}
                      data={value}
                      dataKey={currentKey}
                      markedKeys={markedKeys}
                      level={level + 1}
                      counter={counter + acc.lines + 1}
                      expandAll={expandAll}
                      onKeyValueClick={onKeyValueClick}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onKeyEdit={onKeyEdit}
                      extraLineAdditions={extraLineAdditions}
                    />
                  );
                  acc.lines += countLines(value) + 1;

                  acc.children.push(res);
                  return acc;
                }

                acc.children.push(
                  <JSONLine
                    onClick={onKeyValueClick}
                    line={counter + acc.lines + 1}
                    marked={markedKeys.includes(dataKey ? currentKey : key2)}
                    data={{
                      key: dataKey ? currentKey : key2,
                      value,
                      level: level + 1,
                    }}
                    editable={editable}
                    onDelete={onDelete}
                    onEdit={onEdit}
                    onKeyEdit={onKeyEdit}
                    key={dataKey ? currentKey : key2}
                  />
                );
                acc.lines++;
                return acc;
              },
              { children: [], lines: 0 }
            ).children
          }
          <JSONExtras
            level={level}
            key={"cl_" + dataKey}
            value={dataKey ? "}," : "}"}
            line={counter + countLines(data)}
            // extras={extraLineAdditions}
            // keyValue={dataKey}
          />
        </>
      )}
    </Expandable>
  );
};

export default JSONViewer;
