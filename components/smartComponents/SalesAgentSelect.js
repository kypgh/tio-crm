import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import useSelectedBrand from "../../utils/hooks/useSelectedBrand";
import agent from "../../utils/agent";
import { Select } from "../formComponents/FormGeneric";
import styled from "styled-components";
import { BtnGeneric, ButtonBlue } from "../generic";
import { FaSave } from "react-icons/fa";
import { useNotification } from "../actionNotification/NotificationProvider";
import { useCrmUsers } from "../../utils/hooks/serverHooks";

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 5px;

  & > *:first-child {
    width: 100%;
  }
`;

const SalesAgentSelect = ({ user, defaultSalesAgent }) => {
  const [selectedBrand] = useSelectedBrand();
  const { data } = useCrmUsers(1, 1000);
  const notify = useNotification();
  const [assignedSalesAgent, setAssignedSalesAgent] =
    useState(defaultSalesAgent);
  const queryClient = useQueryClient();
  const updateSalesAgentMutation = useMutation(
    (salesAgentId) =>
      agent()
        .updateClientSalesAgent(user._id, salesAgentId)
        .then((res) => res.data),
    {
      onSuccess: () => {
        notify.SUCCESS("Sales Agent Updated");
        queryClient.invalidateQueries([selectedBrand, "client", user._id]);
      },
      onError: () => {
        notify.ERROR("Error updating Sales Agent");
      },
    }
  );
  useEffect(() => {
    setAssignedSalesAgent(defaultSalesAgent);
  }, [defaultSalesAgent]);
  return (
    <Container>
      <Select
        value={assignedSalesAgent?._id || ""}
        onChange={(ev) => {
          const salesAgent = data?.docs?.find((x) => x._id === ev.target.value);
          setAssignedSalesAgent(salesAgent);
        }}
      >
        <option value={""}>Not assigned</option>
        {data?.docs?.map((sales_agent) => (
          <option key={sales_agent._id} value={sales_agent._id}>
            {sales_agent.first_name} {sales_agent.last_name} (
            {sales_agent.department})
          </option>
        ))}
      </Select>
      <ButtonBlue
        disabled={
          defaultSalesAgent?._id === assignedSalesAgent?._id ||
          !assignedSalesAgent ||
          updateSalesAgentMutation.isLoading
        }
        onClick={() => {
          updateSalesAgentMutation.mutate(assignedSalesAgent?._id);
        }}
      >
        <FaSave />
      </ButtonBlue>
    </Container>
  );
};

export default SalesAgentSelect;
