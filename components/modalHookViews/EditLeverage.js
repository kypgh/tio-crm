import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import styled from "styled-components";
import { colors } from "../../config/colors";
import { FormTitle, Label, Select } from "../formComponents/FormGeneric";
import agent from "../../utils/agent";
import { useNotification } from "../actionNotification/NotificationProvider";
import { LEVERAGES } from "../../config/enums";
import useSelectedBrand from "../../utils/hooks/useSelectedBrand";

const FullContainer = styled.div`
  max-width: 100%;

  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Outer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  min-height: 150px;
  background-color: ${({ theme }) => theme.secondary};
  border-radius: 3px;
  padding: 10px;
  position: relative;
  max-width: 700px;
  position: relative;
`;

const LeverageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
`;

const Btns = styled.button`
  :disabled {
  }
  margin-left: auto;
  max-width: 100px;
  width: 100%;
  padding: 10px;
  text-align: center;
  color: ${({ theme }) => theme.white};
  border-radius: 5px;
  cursor: pointer;

  background-color: ${({ theme }) => theme.primary};

  &.edit {
    background-color: ${({ theme }) => theme.blue};
  }
`;

const EditLeverage = ({ account, closeModal }) => {
  const { id, user, account_type, leverage } = account; //accountid , user object

  const [leverageValues, setLeverageValues] = useState(LEVERAGES[0].value);
  const [leverageValue, setLeverageValue] = useState(leverage);
  const [accountType, setAccountType] = useState(account_type);

  const queryClient = useQueryClient();
  const actionNotification = useNotification();

  const [selectedBrand] = useSelectedBrand();

  const updateLeverage = useMutation(
    ({ id, accountType, leverageValue }) =>
      agent().updateClientAccount(id, leverageValue, accountType),
    {
      onSuccess: () => {
        queryClient
          .invalidateQueries([selectedBrand, "clientAccounts"])
          .then(() => closeModal());
        actionNotification.SUCCESS("Account updated successfully");
      },
      mutationKey: ["updateLeverage"],
    }
  );

  return (
    <Outer>
      <FormTitle>Edit Leverage</FormTitle>
      <LeverageContainer>
        <FullContainer>
          <Label>Type:</Label>
          <Select
            defaultValue={accountType}
            style={{ padding: "14px" }}
            onChange={(e) => {
              setAccountType(e.target.value);
              setLeverageValues(
                LEVERAGES.find((x) => x.name === e.target.value).value
              );
            }}
          >
            {LEVERAGES.map((el, idx) => (
              <option key={idx} value={el.name}>
                {el.name}
              </option>
            ))}
          </Select>
        </FullContainer>

        <FullContainer>
          <Label>Leverage:</Label>
          <Select
            defaultValue={leverageValue}
            style={{ padding: "14px" }}
            onChange={(e) => setLeverageValue(e.target.value)}
          >
            {leverageValues.map((el, idx) => (
              <option key={idx} value={el}>
                {el}
              </option>
            ))}
          </Select>
        </FullContainer>
      </LeverageContainer>
      <Btns
        className="edit"
        onClick={() => {
          updateLeverage.mutate({ id, accountType, leverageValue });
        }}
      >
        Edit
      </Btns>
    </Outer>
  );
};

export default EditLeverage;
