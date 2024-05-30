import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { FaPlayCircle } from "react-icons/fa";
import scheduledFunctionsAgent from "../../utils/scheduledFunctionsAgent";
import { useNotification } from "../actionNotification/NotificationProvider";
import { ButtonBlue } from "../generic";

const CronTaskForceRunButton = ({ cronTask }) => {
  const queryClient = useQueryClient();
  const notification = useNotification();
  const forceRunMutation = useMutation(
    async () => {
      return scheduledFunctionsAgent().forceRunTask(cronTask.id);
    },
    {
      onSuccess: () => {
        notification.SUCCESS("Task has was forced to run successfully");
        queryClient.invalidateQueries(["cronTaskResults", cronTask.id]);
      },
      onError: (error) => {
        let errorMsg =
          error?.response?.data?.message ||
          "An error occurred while trying to force run task";
        notification.ERROR(errorMsg);
      },
    }
  );
  return (
    <ButtonBlue
      type="button"
      style={{
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        display: "flex",
        flexWrap: "wrap",
        flex: "1 0 auto",
      }}
      onClick={(ev) => {
        ev.stopPropagation();
        forceRunMutation.mutate();
      }}
    >
      {!forceRunMutation.isLoading ? (
        <>
          Force Run <FaPlayCircle />
        </>
      ) : (
        "Loading..."
      )}
    </ButtonBlue>
  );
};

export default CronTaskForceRunButton;
