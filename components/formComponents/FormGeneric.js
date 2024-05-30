import { forwardRef } from "react";
import styled, { keyframes } from "styled-components";

const TitleSC = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: ${({ theme }) => theme.textPrimary};
  text-align: center;
  margin-bottom: 20px;
  transition: 0.3s all ease;
`;

/**
 * @param {{style: React.CSSProperties}} param0
 * @returns {React.Component}
 *
 * This is used with the table component!
 */
export const FormTitle = ({ children, style }) => {
  return <TitleSC style={style}>{children}</TitleSC>;
};

const LabelSC = styled.div`
  color: ${({ theme }) => theme.textPrimary};
  align-self: flex-start;
  transition: 0.3s all ease;
`;

/**
 * @param {{style: React.CSSProperties, children, theme  }} param0
 * @returns {React.Component}
 *
 * This is used with the table component!
 */
export const Label = ({ children, style }) => {
  return <LabelSC style={style}>{children}</LabelSC>;
};

const ErrorMessageSC = styled.div`
  color: ${({ theme }) => theme.errorMsg};
  align-self: flex-start;
`;

/**
 * @param {{style: React.CSSProperties,}} param0
 * @returns {React.Component}
 *
 * This is used with the table component!
 */
export const ErrorMessage = ({ children, style }) => {
  return <ErrorMessageSC style={style}>{children}</ErrorMessageSC>;
};

const ButtonContainerSC = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
`;

export const ButtonContainer = ({ children }) => {
  return <ButtonContainerSC>{children}</ButtonContainerSC>;
};

const InputFieldSC = styled.input`
  background-color: ${({ theme, invert }) =>
    invert ? theme.secondary : theme.primary};
  border: none;
  border-radius: 5px;
  color: ${({ theme }) => theme.white};
  font-size: 1rem;
  padding: 10px;
  width: 100%;
  transition: 0.3s all ease;
  padding: ${({ smallStyles }) => smallStyles && "5px 10px"};
  font-size: ${({ smallStyles }) => smallStyles && "0.8rem"};

  &:focus-visible {
    outline: none;
  }
`;

/**
 * @param {{style: React.CSSProperties, theme, value, type, name, onChange, autoComplete, placeholder, smallStyles, invert }} param0
 * @returns {React.Component}
 *
 * This is used with the table component!
 */
export const InputField = ({
  theme,
  value,
  type,
  name,
  onChange,
  autoComplete,
  placeholder,
  style,
  smallStyles,
  invert = false,
  innerRef,
  ...props
}) => {
  return (
    <InputFieldSC
      style={style}
      value={value}
      type={type}
      name={name}
      onChange={onChange}
      autoComplete={autoComplete}
      placeholder={placeholder}
      smallStyles={smallStyles}
      invert={invert}
      ref={innerRef}
      {...props}
    />
  );
};

const Button = styled.button`
  background-color: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.white};
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  border: 1px solid ${({ theme }) => theme.primary};
  cursor: pointer;
  transition: 0.3s all ease;
  transition: 0.3s all ease;

  &:disabled {
    background-color: ${({ theme }) => theme.disabled};
    color: ${({ theme }) => theme.black};
  }
`;

/**
 * @param {{style: React.CSSProperties, }} param0
 * @returns {React.Component}
 *
 * This is used with the table component!
 */
export const SumbitButton = ({
  children,
  disabled,
  onClick,
  type = "submit",
  style,
}) => {
  return (
    <Button disabled={disabled} onClick={onClick} type={type} style={style}>
      {children}
    </Button>
  );
};

const CusSelect = styled.select`
  background-color: ${({ theme, invert }) =>
    invert ? theme.secondary : theme.primary};
  border: none;
  border-radius: 5px;
  color: ${({ theme }) => theme.white};
  font-size: 0.8rem;
  padding: 5px 10px;
  width: fit-content;
  transition: 0.3s all ease;
  /* padding: ${({ smallStyles }) => smallStyles && "5px 10px"};
  font-size: ${({ smallStyles }) => smallStyles && "0.8rem"}; */

  &:focus-visible {
    outline: none;
  }

  &::-webkit-scrollbar {
    width: 10px;
  }
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.primary};
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.brand};
    border-radius: 50px;
  }
`;

/**
 * @param {{
 *  style: React.CSSProperties;
 *  onChange: Function;
 *  onLoad: Function;
 *  defaultValue: String;
 *  children: React.ReactNode;
 *  value: String;
 *  disabled: Boolean;
 *  invert: Boolean;
 *  }} param0
 * @returns {React.Component}
 *
 * This is used with the table component!
 */
const SelectComponent = (
  {
    onChange,
    onLoad,
    defaultValue,
    children,
    style,
    value,
    disabled = false,
    ...props
  },
  ref
) => {
  return (
    <CusSelect
      ref={ref}
      onLoad={onLoad}
      defaultValue={defaultValue}
      onChange={onChange}
      style={style}
      value={value}
      disabled={disabled}
      {...props}
    >
      {children}
    </CusSelect>
  );
};
SelectComponent.displayName = "Select";

export const Select = forwardRef(SelectComponent);

const CusCheckbox = styled.input`
  &[type="checkbox"] {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    display: inline-block;
    position: relative;
    width: 15px;
    height: 15px;
    background: ${({ theme, invert }) =>
      invert ? theme.secondary : theme.primary};
    border-radius: 50%;
    outline: none;
    cursor: pointer;
    transition: all 150ms ease;
  }

  &[type="checkbox"]:checked::before {
    content: "";
    display: block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${({ theme }) => theme.brand};
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

export const Checkbox = ({ onChange, checked, id, value, invert }) => {
  return (
    <CusCheckbox
      type="checkbox"
      id={id}
      value={value}
      onChange={onChange}
      checked={checked}
      invert={invert}
    />
  );
};

const Shine = keyframes`
 to {
    background-position-x: -200%;
  }
`;

const DetailsCus = styled.div`
  background-color: ${({ theme }) => theme.primary};
  border-radius: 5px;
  padding: 3px 10px;
  width: 100%;
  color: ${({ theme }) => theme.white};
  min-height: 27px;
  overflow: hidden;
  background: linear-gradient(
    ${({ theme, isLoading }) =>
      isLoading &&
      `110deg, ${theme.primary} 10%, #23272a 20%, ${theme.primary} 35%`}
  );
  background-size: 200% 100%;
  animation: 2s ${Shine} linear infinite;
`;

/**
 * @param {{style: React.CSSProperties, theme, isLoading: Boolean}} param0
 * @returns {React.Component}
 *
 * This is used with the table component!
 */
export const Details = ({ children, theme, isLoading, style }) => {
  return (
    <DetailsCus isLoading={isLoading} style={style}>
      {children}
    </DetailsCus>
  );
};

const DatePickerCus = styled.input`
  background-color: ${({ theme }) => theme.primary};
  border: none;
  border-radius: 5px;
  color: ${({ theme }) => theme.white};
  font-size: 1rem;
  padding: 0px 5px 3px 5px;
  /* width: 100%; */
  transition: 0.3s all ease;

  &:focus {
    outline: none;
  }
  &::-webkit-calendar-picker-indicator {
    filter: invert(1);
  }
`;

export const DatePicker = ({
  theme,
  onChange,
  value,
  min,
  max,
  name,
  type = "date",
  ...rest
}) => {
  return (
    <DatePickerCus
      name={name}
      onChange={onChange}
      value={value}
      type={type}
      min={min}
      max={max}
      {...rest}
    />
  );
};

const ColorPickerCus = styled.input`
  background-color: ${({ theme, invert }) =>
    invert ? theme.secondary : theme.primary};
  border-radius: 5px;
`;

export const ColorPicker = ({ theme, onChange, value, invert }) => {
  return (
    <ColorPickerCus
      onChange={onChange}
      value={value}
      type="color"
      invert={invert}
    />
  );
};
