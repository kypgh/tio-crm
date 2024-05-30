import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import styled from "styled-components";
import scheduledFunctionsAgent from "../../utils/scheduledFunctionsAgent";
import CronTask from "./CronTask";
import { colors } from "../../config/colors";

const ScheduledFunctionContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-y: hidden;
  & > * {
    margin-bottom: 10px;
  }

  @media (max-width: 768px) {
    max-height: calc(100vh - 150px);
    overflow-y: auto;
    font-size: 14px;

    &::-webkit-scrollbar {
      width: 5px;
    }
    &::-webkit-scrollbar-track {
      background: ${({ theme }) => theme.primary};
    }
    &::-webkit-scrollbar-thumb {
      background: ${({ theme }) => theme.blue};
      border-radius: 50px;
    }
  }
`;

const ScheduledFunctionsList = () => {
  const [expandedSection, setExpandedSection] = useState(null);
  const { data, isLoading } = useQuery(["cronTasks"], async () => {
    return scheduledFunctionsAgent().getCronTasks();
  });
  return (
    <ScheduledFunctionContainer>
      {isLoading
        ? "Loading..."
        : data?.map((cronTask) => (
            <CronTask
              key={cronTask.id}
              cronTask={cronTask}
              expandedSection={expandedSection}
              setExpandedSection={setExpandedSection}
            ></CronTask>
          ))}
    </ScheduledFunctionContainer>
  );
};

export default ScheduledFunctionsList;
