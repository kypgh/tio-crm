import React, { useState, useEffect } from "react";
import styled from "styled-components";
import useTheme from "../../utils/hooks/useTheme";
import { useGetUserCalendarEvents } from "../../utils/hooks/serverHooks";
import { DateTime } from "luxon";
import { ButtonBlue, Loader } from "../generic";
import ModalHook from "../ModalHook";
import ClientCalendarInfo from "../../components/clients/ClientCalendarInfo";
import MonthTab from "./MonthTab";
import ListTab from "./ListTab";

const CalendarContainer = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  right: 0;
  transform: ${({ isToggle }) =>
    isToggle ? "translateX(0%)" : "translateX(100%)"};
  top: 0;
  height: 100%;
  padding: 10px;
  z-index: 10;
  background-color: ${(props) => props.theme.secondary};
  border: 2px solid ${(props) => props.theme.secondaryFaded};
  border-radius: 6px 0px 0px 6px;
  transition: all 0.15s linear;
  width: 400px;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr auto;
  gap: 5px;
`;

const ToggleBtn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  filter: drop-shadow(0px 0 5px ${(props) => props.theme.secondaryFaded});
  transition: width 0.45s linear;
  cursor: pointer;
  overflow: hidden;
  width: 45px;
  z-index: 11;
  border-radius: 6px 0px 0px 6px;
  height: 50px;
  background-color: ${(props) => props.theme.secondary};
  border: 2px solid ${(props) => props.theme.secondaryFaded};
  border-right: none;
  position: absolute;
  right: 100%;
  top: 10px;
`;

const IconContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  position: relative;
`;

const Line1 = styled.div`
  display: flex;
  width: 20px;
  height: 5px;
  background-color: ${(props) => props.theme.brand};
  position: absolute;
  border-radius: 8px 8px 0px 0px;
  top: 30%;
  transition: transform 0.5s linear;
  transform: translateX(50%);
  &.open {
    border-top: none;
    border: none;
    transform: rotate(120deg);
    box-shadow: ${(props) => props.theme.brand} 2px -15.5px 0px -100px,
      ${(props) => props.theme.brand} -10px -15.5px 0px -100px;
    width: 20px;
    border-radius: 2px 0px 0px 0px;
    border-left: 2px solid ${(props) => props.theme.brand};
    height: 15px;
    width: 15px;
    left: 10px;
    top: 35%;
    background: none;
  }
`;

const Line2 = styled.div`
  display: flex;
  transition: all 0.5s linear;
  border: 2px solid ${(props) => props.theme.brand};
  width: 20px;
  height: 20px;
  top: 30%;
  border-radius: 4px;
  transform: translateX(50%);
  position: absolute;
  &.open {
    border-top: none;
    border: none;
    transform: rotate(238deg);
    width: 20px;
    border-radius: 0px 0px 0px 2px;
    border-left: 2px solid ${(props) => props.theme.brand};
    height: 15px;
    width: 15px;
    left: 10px;
    background: none;
    top: 27%;
    background-color: none;
  }
`;

const Line3 = styled.div`
  display: flex;
  background-color: ${(props) => props.theme.brand};
  transition: all 0.5s linear;
  box-shadow: ${(props) => props.theme.brand} 2px -14.5px 0px -0.5px,
    ${(props) => props.theme.brand} -10px -14.5px 0px -0.5px;
  width: 3px;
  height: 3px;
  top: 35%;
  transform: translate(22px, 10px);
  position: absolute;
  &.open {
    transition: all 0.15s linear;

    transform: translate(-180%, 10px);
  }
`;

const TabHeader = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  background-color: ${(props) => props.theme.secondary};
  margin-bottom: 2px;
  align-items: stretch;
  color: ${(props) => props.theme.textPrimary};
`;

const TabLabel = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  padding: 8px;
  align-items: center;
  border: 2px solid ${(props) => props.theme.secondary};
  border-bottom: none;
  font-size: 12px;
  background-color: ${(props) => props.$bgColor};

  &:hover {
    background-color: ${(props) => props.theme.primary};
    cursor: pointer;
  }

  &:active {
    transform: translateY(4px);
  }
`;

const TabContent = styled.div`
  width: 100%;
  height: 100%;
  /* overflow: hidden; */
  background-color: ${(props) => props.theme.primary};
  color: ${(props) => props.theme.textPrimary};
`;

const AddEventButton = styled.div`
  background-color: ${(props) => props.theme.secondary};
`;

const startTime = ({ activeTab }) => {
  if (activeTab === 0) {
    return DateTime.local();
    // return DateTime.local().startOf("month");
  } else if (activeTab === 1) {
    return DateTime.local().startOf("month");
  } else {
    console.log("list tab");
    return DateTime.local();
  }
};

const endTime = ({ activeTab }) => {
  if (activeTab === 0) {
    return DateTime.local().plus({ days: 7 });
    // return DateTime.local().endOf("month");
  } else if (activeTab === 1) {
    return DateTime.local().endOf("month");
  } else {
    return DateTime.local().plus({ days: 7 });
  }
};
const now = Date.now();

const Calendar = ({ user }) => {
  const [activeTab, setActiveTab] = useState(0);

  const [startDate, setStartDate] = useState(DateTime.now().startOf("day"));
  const [endDate, setEndDate] = useState(
    DateTime.now().plus({ days: 7 }).endOf("day")
  );

  const [isToggle, setIsToggle] = useState(false);

  useEffect(() => {
    setStartDate(startTime({ activeTab }));
    setEndDate(endTime({ activeTab }));
  }, [activeTab]);

  const { data, isLoading } = useGetUserCalendarEvents({
    user_id: user?._id,
    start: startDate.toMillis(),
    end: endDate.toMillis(),
  });

  const colors = useTheme();

  // const tabLabels = ["month", "day", "list"];

  const tabLabels = ["List view", "Calendar view"];

  return (
    <CalendarContainer isToggle={isToggle}>
      <ModalHook
        componentToShow={
          <ClientCalendarInfo client={user} start={startDate} end={endDate} />
        }
      >
        {({ openModal }) => (
          <>
            <ToggleBtn
              isToggle={isToggle}
              onClick={() => setIsToggle(!isToggle)}
            >
              <IconContainer>
                <Line1 className={isToggle ? "open" : "close"}></Line1>
                <Line2 className={isToggle ? "open" : "close"}></Line2>
                <Line3 className={isToggle ? "open" : "close"}></Line3>
              </IconContainer>
            </ToggleBtn>
            {isLoading && <Loader />}
            <TabHeader>
              {tabLabels.map((label, index) => (
                <TabLabel
                  key={index}
                  $bgColor={
                    index === activeTab
                      ? colors.theme.primary
                      : colors.theme.secondary
                  }
                  onClick={() => setActiveTab(index)}
                >
                  {label}
                </TabLabel>
              ))}
            </TabHeader>
            <TabContent>
              {
                [
                  // "Content for Tab 3",
                  <ListTab
                    key={"list"}
                    data={data}
                    client={user}
                    startDate={startDate}
                    setStartDate={setStartDate}
                    endDate={endDate}
                    setEndDate={setEndDate}
                    onClick={() => setActiveTab(0)}
                  />,
                  <MonthTab
                    key={"calendar"}
                    data={data}
                    client={user}
                    user={user}
                    startDate={startDate}
                    setStartDate={setStartDate}
                    endDate={endDate}
                    setEndDate={setEndDate}
                    openModal={openModal}
                    onClick={() => {
                      setActiveTab(1);
                    }}
                  />,
                ][activeTab]
              }
            </TabContent>
            <AddEventButton>
              <ButtonBlue
                style={{
                  width: "100%",
                  height: "100%",
                  justifyContent: "center",
                }}
                onClick={() => openModal()}
              >
                Add Event
              </ButtonBlue>
            </AddEventButton>
          </>
        )}
      </ModalHook>
    </CalendarContainer>
  );
};

export default Calendar;
