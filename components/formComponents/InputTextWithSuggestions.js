import React, { useEffect, useRef, useState } from "react";
import _ from "lodash";
import { FaSearch } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import styled, { useTheme } from "styled-components";
import useOnClickAway from "../../utils/hooks/useOnClickAway";
import { InputField } from "./FormGeneric";

const SuggestionsContainer = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.primary};
  border: 2px solid ${({ theme }) => theme.primary};
  padding: 5px;
  border-radius: 0px 0px 5px 5px;
  margin-top: -2px;
  z-index: 1000;
  & > :first-child {
    border-top: ${({ theme }) => `1px solid ${theme.secondary}`};
  }
  & > * {
    border-bottom: ${({ theme }) => `1px solid ${theme.secondary}`};
  }
`;

const Suggestion = styled.div`
  color: ${({ theme }) => theme.textPrimary};
  padding: 10px;
  background-color: ${({ theme, selected }) =>
    selected ? theme.secondary : theme.primary};
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.secondary};
  }
`;

const LoaderContainer = styled.div`
  position: absolute;
  right: 10px;
  top: 10px;
  color: red;
`;

const InputTextWithSuggestionsContainer = styled.div`
  position: relative;
  width: 100%;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.textPrimary};
  border-radius: 5px;
`;

/**
 *
 * @param {{
 *  value: Value,
 *  onChange: (value: Value) => void,
 *  suggestions: [{ value: Value, label: String}],
 * }} param0
 * @returns
 * @template Value
 */
const InputTextWithSuggestions = ({
  value,
  onChange,
  suggestions,
  suggestionsStyle,
  isLoading,
  label,
  style,
  onSelectSuggestion = () => {},
  ...props
}) => {
  const theme = useTheme();
  const [suggestionList, setSuggestionList] = useState(suggestions);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(null);

  useOnClickAway(
    inputRef,
    () => {
      setShowSuggestions(false);
      setSelectedIdx(null);
    },
    [suggestionsRef]
  );
  function triggerOnChange(value) {
    inputRef.current.value = value;
    onChange({ target: inputRef.current });
    setShowSuggestions(false);
    setSelectedIdx(0);
  }

  useEffect(() => {
    /**
     * @param {KeyboardEvent} ev
     */
    function handleKeys(ev) {
      switch (ev.key) {
        case "Tab":
        case "ArrowDown":
          ev.preventDefault();
          setSelectedIdx((prev) => ((prev ?? -1) + 1) % suggestionList.length);
          break;
        case "ArrowUp":
          ev.preventDefault();
          setSelectedIdx(
            (prev) =>
              ((prev ?? 0) - 1 + suggestionList.length) % suggestionList.length
          );
          break;
        case "Enter":
          ev.preventDefault();
          if (
            !_.isNil(selectedIdx) &&
            selectedIdx >= 0 &&
            selectedIdx < suggestionList.length
          ) {
            triggerOnChange(suggestionList[selectedIdx].value);
            onSelectSuggestion(suggestionList[selectedIdx].value);
            setSelectedIdx(null);
            setShowSuggestions(false);
          }
          break;
        case "Escape":
          ev.preventDefault();
          setSelectedIdx(null);
          setShowSuggestions(false);
          break;
      }
    }
    if (showSuggestions) {
      addEventListener("keydown", handleKeys);
    }
    return () => {
      removeEventListener("keydown", handleKeys);
    };
  }, [showSuggestions, selectedIdx, suggestionList]);
  useEffect(() => {
    setSuggestionList(suggestions);
    setSelectedIdx(suggestions.length > 0 ? 0 : null);
  }, [suggestions]);
  return (
    <InputTextWithSuggestionsContainer>
      <InputContainer style={style}>
        <InputField
          style={{ backgroundColor: "transparent" }}
          innerRef={inputRef}
          value={value}
          onChange={(e) => {
            let show = !!e.target.value && e.target.value !== "";
            setShowSuggestions(show);
            if (!show) {
              setSelectedIdx(null);
            }
            onChange(e);
          }}
          onFocus={() => setShowSuggestions(!!value && value !== "")}
          {...props}
        />
        <FaSearch size={20} style={{ marginRight: "10px" }} />
      </InputContainer>
      {isLoading && (
        <LoaderContainer>
          <ClipLoader size={20} color={theme.brand} />
        </LoaderContainer>
      )}
      {showSuggestions && suggestionList.length > 0 && (
        <SuggestionsContainer ref={suggestionsRef} style={suggestionsStyle}>
          {suggestionList.map((suggestion, idx) => (
            <Suggestion
              key={suggestion.value}
              onClick={(e) => {
                triggerOnChange(suggestion.value);
                onSelectSuggestion(suggestion.value);
              }}
              selected={idx === selectedIdx}
            >
              {suggestion.label}
            </Suggestion>
          ))}
        </SuggestionsContainer>
      )}
    </InputTextWithSuggestionsContainer>
  );
};

export default InputTextWithSuggestions;
