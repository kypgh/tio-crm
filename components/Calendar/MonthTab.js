import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import ModalHook from "../ModalHook";
import { ButtonBlue, CalendarButton } from "../generic";
import { DateTime } from "luxon";
import useTheme from "../../utils/hooks/useTheme";
import ClientCalendarInfo from "../../components/clients/ClientCalendarInfo";
import { color } from "highcharts";
import { colors } from "../../config/colors";

const CalendarBody = styled.div`
  background-color: ${(props) => props.theme.primary};
  min-height: 260px;
`;

const CalendarButtons = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 6px;
`;

const EventsInfo = styled.div`
  width: 100%;
  height: 10%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 10px;
`;

const TimeFrame = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
`;

const DayNumber = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 8px;
  align-items: center;
  font-size: 12px;
  position: relative;
  padding: 8px;
  padding-top: 2px;
  min-height: 80px;
  background-color: ${({ $bgColor }) => $bgColor};
  border: 1px solid ${(props) => props.theme.secondary};
  color: ${({ $color }) => $color};
  background-position: center;
  background-size: contain;

  &:hover {
    background-color: ${(props) => props.theme.secondary};
    cursor: pointer;
    color: ${(props) => props.theme.textPrimary};
  }

  &:active {
    background-color: ${(props) => props.theme.secondary};
    transform: translateY(1px);
  }
`;

const DayContainer = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: 1fr;
  background-color: ${(props) => props.theme.primary};
  gap: 1px;
  margin-bottom: 10px;
`;

const BarsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 140%;
  gap: 1px;
  position: relative;
`;

//colors from google calendar event bars
function getRandomColor(index) {
  const barsColors = [
    "rgb(213,0,0)",
    "rgb(230,124,115)",
    "rgb(244,81,30)",
    "rgb(246,191,38)",
    "rgb(51,182,121)",
    "rgb(3,155,229)",
    "rgb(63,81,181)",
    "rgb(142,36,170)",
    "rgb(121,134,203)",
    "rgb(11,128,67)",
    "rgb(97,97,97)",
  ];

  if (index >= barsColors.length) {
    return barsColors[index - barsColors.length];
  }
  return barsColors[index];
}

const Bar = styled.div`
  width: 100%;
  min-height: 8px;
  background-color: ${({ event }) => event.color};
  border-radius: 2px;
  position: relative;

  &::after {
    width: auto;
    min-width: 100px;
    opacity: 0;
    height: auto;
    padding: 4px;
    font-weight: 600;
    background-color: ${({ event }) => event.color};
    color: #000;
    position: absolute;
    left: -25%;
    content: "${({ event }) => event.title}";
    z-index: 3;
    border-radius: 5px;
    display: flex;

    align-items: center;
    transition: all 0.3s ease;
  }

  &:hover {
    &::after {
      opacity: 1;
    }
  }
`;

const MoreEvents = styled.button`
  position: absolute;
  bottom: 5px;
  left: 5px;
  border: none;
  outline: none;
  border-radius: 2px;
  width: 40px;
  z-index: 999;
  cursor: pointer;
  font-size: 10px;
  background-color: ${(props) => props.theme.blue};
`;

const AddEventContainer = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  outline: none;
  border: none;
  background-color: transparent;
  cursor: pointer;
`;

const Weekday = styled.div`
  opacity: 0.5;
  font-size: 12px;
  display: flex;
  justify-content: center;
`;

/**
 *
 * @param {DateTime} start
 * @returns {DateTime[]}
 */
const getCalendarDays = (start) => {
  return Array.from({ length: start.daysInMonth }, (_, i) =>
    DateTime.fromJSDate(start.toJSDate()).set({ day: i + 1 })
  );
};

const todaysDate = () => {
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  return { day, month, year };
};

const Day = ({ date, events, user, startDate, endDate, openModal }) => {
  const [active, setActive] = useState({});
  let colors = useTheme();
  let { day: today, month: thisMonth, year: thisYear } = todaysDate();

  let isToday =
    date.day === today && date.month === thisMonth && date.year === thisYear;
  let hasEvent = events.length > 0;
  return (
    <>
      <DayNumber
        onClick={() => {
          setActive({
            day: date.day,
            month: date.month,
            year: date.year,
          });
        }}
        $bgColor={
          isToday
            ? colors.theme.brand
            : colors.theme.name === "light"
            ? "#fff"
            : colors.theme.black
        }
        $color={
          isToday
            ? colors.theme.textPrimary
            : colors.theme.name === "light"
            ? "#000"
            : colors.theme.badgeTextColor
        }
      >
        {date.day}

        <BarsContainer>
          {hasEvent &&
            events.slice(0, 3).map((ev, idx) => {
              return <Bar key={idx} event={ev}></Bar>;
            })}
        </BarsContainer>
        {events.length > 3 && <MoreEvents>more</MoreEvents>}

        <AddEventContainer
          onClick={() => {
            openModal(date);
          }}
        ></AddEventContainer>
      </DayNumber>
    </>
  );
};

const MonthTab = ({
  user,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  data,
  client,
  openModal,
}) => {
  let daysWithEvents = [];

  daysWithEvents =
    data?.calendarEvents.map((event) => {
      let days = [];
      let currentDate = new Date(event.start);

      while (currentDate <= new Date(event.end)) {
        days.push({ date: new Date(currentDate), title: event.title });
        currentDate.setDate(currentDate.getDate() + 1);
      }

      return days;
    }) ?? [];

  const barPositions = [
    0, 8, 16, 24, 32, 40, 48, 56, 64, 72, 80, 88, 96, 104, 112, 120,
  ];

  let daysWithEventsBars = daysWithEvents
    .map((event, idx) => {
      let randomColor = getRandomColor(idx);

      return event.map((element) => ({
        id: idx,
        day: element.date,
        color: randomColor,
        title: element.title,
      }));
    })
    .flat();

  const weekdays = [
    { name: "Mon", offset: 0 },
    { name: "Tue", offset: 1 },
    { name: "Wed", offset: 2 },
    { name: "Thu", offset: 3 },
    { name: "Fri", offset: 4 },
    { name: "Sat", offset: 5 },
    { name: "Sun", offset: 6 },
  ];

  //function to create layout offset for each month based on the first day
  const createOffset = (firstDay) => {
    let day = firstDay.weekdayShort;
    let offset = weekdays.filter((el) => el.name === day);
    let offsetArray = [];
    for (let i = 0; i <= offset[0]?.offset - 1; i++) {
      offsetArray.push(i);
    }
    return offsetArray;
  };

  return (
    <>
      <EventsInfo>
        <TimeFrame>
          {`${DateTime.fromISO(startDate)

            .startOf("month")
            .toFormat("MMM dd yyyy")} - ${DateTime.fromISO(endDate)
            .endOf("month")
            .toFormat("MMM dd yyyy")}`}
        </TimeFrame>
        <CalendarButtons>
          <CalendarButton
            onClick={() => {
              setStartDate(
                DateTime.fromISO(startDate).minus({ month: 1 }).startOf("month")
              );
              setEndDate(
                DateTime.fromISO(endDate).minus({ month: 1 }).endOf("month")
              );
            }}
          >
            <IoIosArrowBack size={20} />
          </CalendarButton>
          <CalendarButton
            onClick={() => {
              setStartDate(
                DateTime.fromISO(startDate).plus({ month: 1 }).startOf("month")
              );
              setEndDate(
                DateTime.fromISO(endDate).plus({ month: 1 }).endOf("month")
              );
            }}
          >
            <IoIosArrowForward size={20} />
          </CalendarButton>
        </CalendarButtons>
      </EventsInfo>

      <CalendarBody>
        <DayContainer>
          {weekdays.map((day, idx) => (
            <Weekday key={idx}>{day.name}</Weekday>
          ))}
        </DayContainer>

        <DayContainer>
          {createOffset(startDate).map((el, idx) => (
            <div key={idx}></div>
          ))}
          {getCalendarDays(startDate).map((date) => (
            <Day
              startDate={startDate}
              endDate={endDate}
              key={date.day}
              date={date}
              user={user}
              openModal={openModal}
              events={
                daysWithEvents.length > 0
                  ? daysWithEventsBars.filter(
                      (e) =>
                        e.day.getDate() === date.day &&
                        e.day.getMonth() + 1 === date.month &&
                        e.day.getFullYear() === date.year
                    )
                  : []
              }
            />
          ))}
        </DayContainer>
      </CalendarBody>
    </>
  );
};

export default MonthTab;
