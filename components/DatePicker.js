import React, { forwardRef, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useOnClickAway from "../utils/hooks/useOnClickAway";
import { useRouter } from "next/router";
import { parseFiltersStringToFiltersObj } from "../utils/functions";

const Outer = styled.div`
  border-radius: 5px;
  width: 200px;
  /* width: 100%; */
  position: relative;
  min-height: 29px;
  z-index: 10;
`;

const Label = styled.label`
  display: block;
  color: ${({ theme }) => theme.textPrimary};
  font-size: 0.8rem;
  font-weight: 600;
  width: 100%;
  height: 100%;
  padding: 5px 10px;
  border-radius: 5px;
  background-color: ${({ theme }) => theme.primary};
  text-align: center;
  border: ${({ theme }) => `1px solid ${theme.brand}`};
`;

const Btn = styled.button`
  background: ${({ theme, $isSelected }) =>
    $isSelected ? theme.brand : theme.secondary};
  color: ${({ theme }) => theme.textPrimary};
  border: none;
  padding: 5px;
  border-radius: 5px;

  &:hover {
    background: ${({ theme }) => theme.brand};
  }
`;

const Absolute = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.primary};
  gap: 5px;
  padding: 10px;
`;

const ClearBtn = styled.button`
  background: ${({ theme }) => theme.secondary};
  color: ${({ theme }) => theme.textPrimary};
  border: none;
  padding: 5px;
  border-radius: 5px;
  width: 100%;
  text-align: center;

  &:hover {
    background: ${({ theme }) => theme.brand};
  }

  &:focus {
    outline: none;
  }
`;

const DatePickerWrapper = styled.div`
  // header
  & .react-datepicker {
    display: flex;
    background-color: ${({ theme }) => theme.secondary};
    border: 1px solid ${({ theme }) => theme.brand};
  }

  & div.react-datepicker__header {
    background-color: ${({ theme }) => theme.primary};
    border: none;
  }

  & .react-datepicker__current-month,
  & .react-datepicker-time__header,
  & .react-datepicker-year-header {
    color: ${({ theme }) => theme.textPrimary};
  }
  & .react-datepicker__day-name,
  & .react-datepicker__day,
  & .react-datepicker__time-name {
    color: ${({ theme }) => theme.textPrimary};
  }
  &
    .react-datepicker-popper[data-placement^="bottom"]
    .react-datepicker__triangle::before,
  &
    .react-datepicker-popper[data-placement^="bottom"]
    .react-datepicker__triangle::after {
    border-bottom-color: ${({ theme }) => theme.brand};
  }

  // hover on each day
  & .react-datepicker__day:hover,
  & .react-datepicker__month-text:hover,
  & .react-datepicker__quarter-text:hover,
  & .react-datepicker__year-text:hover {
    background-color: ${({ theme }) => theme.brand};
  }
  // rest selected days
  & .react-datepicker__day--in-selecting-range,
  & .react-datepicker__day--in-range,
  & .react-datepicker__month-text--in-selecting-range,
  & .react-datepicker__month-text--in-range,
  & .react-datepicker__quarter-text--in-selecting-range,
  & .react-datepicker__quarter-text--in-range,
  & .react-datepicker__year-text--in-selecting-range,
  & .react-datepicker__year-text--in-range {
    background-color: ${({ theme }) => theme.brand}70;
    // 70 is to add a bit of transparency
  }
  // this is when selecting a date and hover on previous days
  & .react-datepicker__day--selected,
  .react-datepicker__day--in-selecting-range,
  .react-datepicker__day--in-range,
  .react-datepicker__month-text--selected,
  .react-datepicker__month-text--in-selecting-range,
  .react-datepicker__month-text--in-range,
  .react-datepicker__quarter-text--selected,
  .react-datepicker__quarter-text--in-selecting-range,
  .react-datepicker__quarter-text--in-range,
  .react-datepicker__year-text--selected,
  .react-datepicker__year-text--in-selecting-range,
  .react-datepicker__year-text--in-range {
    background-color: ${({ theme }) => theme.brand}70;
    // 70 is to add a bit of transparency
  }
  // last selected day
  & .react-datepicker__day--keyboard-selected,
  & .react-datepicker__month-text--keyboard-selected,
  & .react-datepicker__quarter-text--keyboard-selected,
  & .react-datepicker__year-text--keyboard-selected {
    background-color: ${({ theme }) => theme.brand};
  }
  & .react-datepicker-wrapper {
    width: 100%;
  }
  // input container
  & .react-datepicker__input-container {
    border: none;
    width: 100%;

    & input {
      color: ${({ theme }) => theme.textPrimary};
      background-color: ${({ theme }) => theme.secondary};
      border: none;
      border-radius: 5px;
      padding: 5px;
      width: 100%;
      text-align: center;

      &:focus {
        outline: none;
      }
    }
  }
`;

const CusDisplay = styled.div`
  color: ${({ theme }) => theme.textPrimary};
  width: 100%;
  text-align: center;
  padding: 5px;
  border-radius: 5px;
  background-color: ${({ theme }) => theme.secondary};
  border: none;
  cursor: pointer;
  outline: none;
  font-size: 0.8rem;
`;

const options = [
  {
    label: "Today",
    value: () => {
      const today = new Date();
      return [today, today];
    },
  },
  {
    label: "Yesterday",
    value: () => {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      return [yesterday, yesterday];
    },
  },
  {
    label: "Last 7 Days",
    value: () => {
      const today = new Date();
      const lastWeek = new Date(today);
      lastWeek.setDate(lastWeek.getDate() - 7);
      return [lastWeek, today];
    },
  },
  {
    label: "Last 30 Days",
    value: () => {
      const today = new Date();
      const lastMonth = new Date(today);
      lastMonth.setDate(lastMonth.getDate() - 30);
      return [lastMonth, today];
    },
  },
  {
    label: "This Week",
    value: () => {
      const today = new Date();
      const thisWeek = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - today.getDay()
      );
      return [thisWeek, today];
    },
  },
  {
    label: "Last Week",
    value: () => {
      const today = new Date();
      const lastWeek = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - today.getDay() - 7
      );
      const lastDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - today.getDay() - 1
      );
      return [lastWeek, lastDay];
    },
  },
  {
    label: "This Month",
    value: () => {
      const today = new Date();
      const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      return [thisMonth, today];
    },
  },
  {
    label: "Last Month",
    value: () => {
      const today = new Date();
      const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const lastDay = new Date(today.getFullYear(), today.getMonth(), 0);
      return [lastMonth, lastDay];
    },
  },
];

const formatDate = (date) => {
  if (!date) return "";
  return date.toLocaleDateString("en-GB");
};

const DatePicker = ({
  onChange = ({ startDate, endDate }) => {},
  onClear = ({ startDate, endDate }) => {},
}) => {
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [label, setLabel] = useState("Select Date Range");
  const [isCustom, setIsCustom] = useState(false);
  const ref = useRef(null);

  useOnClickAway(ref, () => setIsOpen(false));

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  useEffect(() => {
    onChange({ startDate, endDate });
  }, [startDate, endDate]);

  const router = useRouter();
  const { pathname } = router;

  const { filters } = router.query;

  useEffect(() => {
    const f = localStorage.getItem(`${pathname} - filters`);
    console.log("f", f);
    if (f) {
      router.push({
        pathname: router.pathname,
        query: {
          ...router.query,
          filters: f,
        },
      });
    }
  }, []);

  useEffect(() => {
    if (!filters) return;

    const fromInit = parseFiltersStringToFiltersObj(filters).find(
      (f) => f.type === "fromDate"
    );
    const endInit = parseFiltersStringToFiltersObj(filters).find(
      (f) => f.type === "toDate"
    );

    if (fromInit && endInit) {
      setStartDate(new Date(fromInit.value));
      setEndDate(new Date(endInit.value));
      setLabel("Custom");
    }
  }, []);

  useEffect(() => {
    if (!filters) {
      setStartDate(undefined);
      setEndDate(undefined);
      setLabel("Select Date Range");
      setIsOpen(false);
      onClear({ startDate: undefined, endDate: undefined });
    }
  }, [filters]);

  return (
    <Outer ref={ref}>
      {isOpen ? (
        <Absolute>
          {options.map((option, idx) => (
            <Btn
              key={idx}
              $isSelected={label === option.label}
              onClick={() => {
                handleDateChange(option.value());
                setLabel(option.label);
                if (option.label !== "Custom") {
                  setIsOpen(false);
                }
              }}
            >
              {option.label}
            </Btn>
          ))}
          {isCustom ? (
            <RDP
              startDate={startDate}
              endDate={endDate}
              handleDateChange={handleDateChange}
              onClose={() => {
                setIsOpen(false);
                setIsCustom(false);
              }}
            />
          ) : (
            <Btn
              $isSelected={label === "Custom"}
              onClick={() => {
                setIsCustom(true);
                setLabel("Custom");
              }}
            >
              {label !== "Custom"
                ? "Custom Range"
                : `${formatDate(startDate)} - ${formatDate(endDate)}`}
            </Btn>
          )}
          <ClearBtn
            onClick={() => {
              setStartDate(undefined);
              setEndDate(undefined);
              setLabel("Select Date Range");
              setIsOpen(false);
              onClear({ startDate: undefined, endDate: undefined });
              // delete localStorage
              localStorage.removeItem(`${pathname} - filters`);
            }}
          >
            Clear
          </ClearBtn>
        </Absolute>
      ) : (
        <Label
          onClick={() => {
            setIsOpen(true);
          }}
        >
          {startDate && endDate
            ? label !== "Custom"
              ? label
              : `${formatDate(startDate)} - ${formatDate(endDate)}`
            : "Select Date Range"}
        </Label>
      )}
    </Outer>
  );
};

export default DatePicker;

const RDP = ({ startDate, endDate, handleDateChange, onClose }) => {
  useEffect(() => {
    return () => {
      onClose();
    };
  }, []);

  return (
    <DatePickerWrapper>
      <ReactDatePicker
        open
        selected={startDate}
        onChange={handleDateChange}
        startDate={startDate}
        endDate={endDate}
        selectsRange
        customInput={
          <CusDisplay>{`${formatDate(startDate)} - ${formatDate(
            endDate
          )}`}</CusDisplay>
        }
        renderCustomHeader={({
          monthDate,
          customHeaderCount,
          decreaseMonth,
          increaseMonth,
        }) => (
          <div>
            <button
              aria-label="Previous Month"
              className={
                "react-datepicker__navigation react-datepicker__navigation--previous"
              }
              style={customHeaderCount === 1 ? { visibility: "hidden" } : null}
              onClick={decreaseMonth}
            >
              <span
                className={
                  "react-datepicker__navigation-icon react-datepicker__navigation-icon--previous"
                }
              >
                {"<"}
              </span>
            </button>
            <span className="react-datepicker__current-month">
              {monthDate.toLocaleString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </span>
            <button
              aria-label="Next Month"
              className={
                "react-datepicker__navigation react-datepicker__navigation--next"
              }
              style={customHeaderCount === 0 ? { visibility: "hidden" } : null}
              onClick={increaseMonth}
            >
              <span
                className={
                  "react-datepicker__navigation-icon react-datepicker__navigation-icon--next"
                }
              >
                {">"}
              </span>
            </button>
          </div>
        )}
        monthsShown={2}
      />
    </DatePickerWrapper>
  );
};
