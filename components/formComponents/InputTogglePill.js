import { useRef } from "react";
import styled from "styled-components";

// input type checkbox to switch button
const SwitchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  gap: 10px;
  & input {
    display: none;
  }
  & label {
    cursor: pointer;
  }
  & span {
    cursor: pointer;
    position: relative;
    width: 34px;
    height: 18px;
    background-color: ${({ theme, invert }) =>
      invert ? theme.secondary : theme.primary};
    transition: 0.4s;
    border-radius: 34px;
  }
  & span:before {
    position: absolute;
    content: "";
    height: 12px;
    width: 12px;
    left: 3px;
    bottom: 3px;
    background-color: #9a9a9a;
    -webkit-transition: 0.4s;
    transition: 0.4s;
    border-radius: 50%;
  }
  & input:checked + span {
    /* background-color: ${({ theme }) => theme.blue}; */
  }
  & input:focus + span {
    box-shadow: 0 0 1px #2196f3;
  }
  & input:checked + span:before {
    transform: translateX(16px);
    background-color: ${({ theme }) => theme.brand};
  }
`;

const InputTogglePill = ({ label, checked, onChange, id, invert }) => {
  const SwitchRef = useRef();
  return (
    <SwitchContainer invert={invert}>
      <input
        ref={SwitchRef}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        id={id}
      />
      <span
        onClick={() => {
          SwitchRef.current.click();
        }}
      />
      <label htmlFor={id}>{label}</label>
    </SwitchContainer>
  );
};

export default InputTogglePill;
