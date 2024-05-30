import { DateTime } from "luxon";
import styled, { useTheme } from "styled-components";
import { Checkbox } from "../formComponents/FormGeneric";
import { GiAlarmClock } from "react-icons/gi";
import { RiChatFollowUpFill } from "react-icons/ri";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import agent from "../../utils/agent";
import useSelectedBrand from "../../utils/hooks/useSelectedBrand";
import { useNotification } from "../actionNotification/NotificationProvider";
import { Loader } from "../generic";
import { CalendarButton } from "../generic";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import EmptyBoundary from "../EmptyBoundary";

const EventContainer = styled.div`
  width: 100%;
  border: 2px solid ${(props) => props.theme.secondary};
  margin-bottom: 2px;
  padding: 5px;
`;

const DateContainer = styled.div`
  width: 100%;
  font-size: 16px;
  display: flex;
  padding: 8px;
  justify-content: space-around;
  background-color: ${(props) => props.theme.secondary};
`;

const Time = styled.div`
  width: 100%;
  font-size: 14px;
`;

const EventContent = styled.div`
  width: 100%;
  background-color: ${(props) => props.theme.primary};
  display: flex;
  justify-content: space-between;
  padding: 7px;
`;

const EventTitle = styled.div`
  width: 80%;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const EventStatus = styled.div`
  width: 20%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  height: 100%;
`;

const TabContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const ListEvents = styled.div`
  height: 90%;
  width: 100%;
  overflow: auto;
`;

const EventsInfo = styled.div`
  width: 100%;
  height: 10%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 10px;
`;

const CalendarButtons = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 6px;
`;

const TimeFrame = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
`;

const formatDateToTime = (date) => {
  let time = DateTime.fromISO(date).toFormat("hh:mm a").toLowerCase();
  return time;
};

const formatDate = (date) => {
  let readableDate = new Date(date);
  return readableDate.toDateString();
};

const iconType = (type, theme) => {
  switch (type) {
    case "follow_up":
      return <RiChatFollowUpFill color={theme.white} size={20} />;
  }
};

const groupByDays = (data) => {
  let group = [];
  let days = [];

  data?.calendarEvents.forEach((follow_up) => {
    let day = DateTime.fromISO(follow_up.start).toFormat("dd");

    if (!days.includes(day)) {
      days.push(day);
      group.push({
        day: DateTime.fromISO(follow_up.start).toFormat("EEEE"),
        date: DateTime.fromISO(follow_up.start).toFormat("MMM dd yyyy"),
        endDate: DateTime.fromISO(follow_up.end).toFormat("MMM dd yyyy"),
        follow_ups: [follow_up],
      });
    } else {
      let index = days.indexOf(day);
      group[index].follow_ups.push(follow_up);
    }
  });

  return group;
};

const ListTab = ({
  data,
  client,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}) => {
  const [selectedBrand] = useSelectedBrand();
  const queryClient = useQueryClient();
  const theme = useTheme();
  const notify = useNotification();

  const { isLoading, mutate } = useMutation(
    ({ status, event }) =>
      agent().updadeCalendarEventStatus({
        status,
        selectedBrand,
        event,
      }),
    {
      onSuccess: () => {
        notify.SUCCESS("Calendar updated successfully");
        queryClient.invalidateQueries([
          selectedBrand,
          "getUserCalendarEvents",
          client._id,
          startDate.valueOf(),
          endDate.valueOf(),
        ]);
      },
      onError: (err) => {
        setErrorState(true);
        setErrorMsg(err.response.data.message);
      },
    }
  );

  return (
    <TabContent>
      <EventsInfo>
        <TimeFrame>
          {`${DateTime.fromISO(startDate).toFormat(
            "MMM dd yyyy"
          )} - ${DateTime.fromISO(endDate).toFormat("MMM dd yyyy")}`}
        </TimeFrame>
        <CalendarButtons>
          <CalendarButton
            onClick={() => {
              setStartDate(
                DateTime.fromISO(startDate).minus({ days: 7 }).startOf("day")
              );
              setEndDate(
                DateTime.fromISO(endDate).minus({ days: 7 }).endOf("day")
              );
            }}
          >
            <IoIosArrowBack size={20} />
          </CalendarButton>
          <CalendarButton
            onClick={() => {
              setStartDate(
                DateTime.fromISO(startDate).plus({ days: 7 }).startOf("day")
              );
              setEndDate(
                DateTime.fromISO(endDate).plus({ days: 7 }).endOf("day")
              );
            }}
          >
            <IoIosArrowForward size={20} />
          </CalendarButton>
        </CalendarButtons>
      </EventsInfo>

      <EmptyBoundary
        size={60}
        isEmpty={data?.calendarEvents?.length === 0}
        message={`No Calendar events for ${DateTime.fromISO(startDate).toFormat(
          "MMMM dd yyyy"
        )} - ${DateTime.fromISO(endDate).toFormat("MMMM dd yyyy")} `}
      />
      <ListEvents>
        {data &&
          groupByDays(data).map((group, idx) => (
            <div key={idx}>
              <DateContainer>
                <p>{group.day}</p>
                <p>{group.date}</p>
              </DateContainer>
              {group.follow_ups.map((follow_up, index) => (
                <EventContainer key={index}>
                  <p style={{ fontSize: "12px" }}>
                    {formatDate(follow_up.start)}-{formatDate(follow_up.end)}
                  </p>
                  <Time>{`${formatDateToTime(
                    follow_up.start
                  )} - ${formatDateToTime(follow_up.end)}`}</Time>
                  <EventContent>
                    <EventTitle>
                      {follow_up.title}
                      {iconType(follow_up.eventType, theme)}
                    </EventTitle>
                    <EventStatus>
                      {isLoading ? (
                        <Loader />
                      ) : (
                        <>
                          <GiAlarmClock color={theme.blue} size={20} />
                          <Checkbox
                            onChange={() => {
                              mutate({
                                status: !follow_up.completed,
                                event: follow_up._id,
                              });
                            }}
                            checked={follow_up.completed}
                            invert
                          />
                        </>
                      )}
                    </EventStatus>
                  </EventContent>
                </EventContainer>
              ))}
            </div>
          ))}
      </ListEvents>
    </TabContent>
  );
};

export default ListTab;
