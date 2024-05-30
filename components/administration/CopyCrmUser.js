import React, { useState } from "react";
import styled from "styled-components";
import { FormTitle, Select } from "../formComponents/FormGeneric";
import { useGetOtherCrmUsers } from "../../utils/hooks/serverHooks";
import { ActionButton } from "../generic";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import agent from "../../utils/agent";
import { useNotification } from "../actionNotification/NotificationProvider";

const Outer = styled.div`
  max-width: 850px;
  width: 100%;
  background-color: ${({ theme }) => theme.secondary};
  border-radius: 5px;
  padding: 40px 15px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
  min-height: 741px;
`;

const ScrollArea = styled.div`
  max-height: 500px;
  height: 100%;
  overflow-y: auto;
  width: 100%;
  background-color: ${({ theme }) => theme.primary};
  border-radius: 5px;
  padding: 5px;
  display: flex;
  flex-wrap: wrap;
`;

const Details = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.white};
  gap: 5px;

  & > span {
    font-weight: 700;
    color: ${({ theme }) => theme.textSecondary};
  }
`;

const Item = styled.div`
  transition: 0.1s all ease;
  cursor: pointer;
  border: 1px solid ${({ theme }) => theme.brand};
  max-width: calc(50% - 6px);
  width: 100%;
  margin: 3px;
  padding: 5px;
  border-radius: 3px;
  background-color: ${({ theme, isSelected }) => isSelected && theme.secondary};
  user-select: none;

  &:hover {
    background-color: ${({ theme }) => theme.secondary};
  }
`;

const CusInput = styled.input`
  max-width: 300px;
  width: 100%;
  background-color: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.textSecondary};
  border-radius: 5px;
  padding: 2px 5px;
  font-size: 14px;
  border-color: transparent;
  box-shadow: none;

  &:focus-visible {
    outline: none;
  }
`;

const ChooseBrand = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.white};
  gap: 5px;
  & > span {
    font-weight: 700;
    color: ${({ theme }) => theme.textSecondary};
  }
`;

const CopyCrmUser = () => {
  const { data } = useGetOtherCrmUsers();
  const [selectedId, setSelectedId] = useState();
  const [filterText, setFilterText] = useState("");
  const [otherBrand, setOtherBrand] = useState("");
  const [otherBrandArr, setOtherBrandArr] = useState([]);

  const queryClient = useQueryClient();
  const actionNotification = useNotification();

  const copyCrmUser = useMutation(
    ({ crmuserId, otherBrand }) =>
      agent().copyCrmUser({ crmuserId, otherBrand }),
    {
      onSuccess: () => {
        setSelectedId(null);
        setOtherBrand("");
        setOtherBrandArr([]);
        setFilterText("");
        queryClient.invalidateQueries("crmUsers");
        actionNotification.SUCCESS("User copied successfully");
      },
      onError: (err) => {
        actionNotification.ERROR("Failed to copy user");
        console.error(err);
      },
    }
  );

  return (
    <Outer>
      <FormTitle>CopyCrmUser</FormTitle>
      <CusInput
        type="text"
        placeholder="Search..."
        value={filterText}
        onChange={(e) => {
          setSelectedId(null);
          setFilterText(e.target.value);
        }}
      />
      <ScrollArea>
        {data?.docs?.length === 0 && (
          <Details style={{ textAlign: "center", margin: "auto" }}>
            No users found
          </Details>
        )}
        {data?.docs
          ?.filter(
            (el) =>
              el.first_name.toLowerCase().includes(filterText.toLowerCase()) ||
              el.last_name.toLowerCase().includes(filterText.toLowerCase()) ||
              el.email.toLowerCase().includes(filterText.toLowerCase())
          )
          .map((el) => (
            <Item
              key={el._id}
              isSelected={selectedId === el._id}
              onClick={() => {
                setSelectedId(selectedId === el._id ? null : el._id);
                setOtherBrandArr(el.brands);
                setOtherBrand("");
              }}
            >
              <Details>
                <span>Name:</span>
                <p>{`${el.first_name} ${el.last_name}`}</p>
              </Details>
              <Details>
                <span>Email:</span>
                <p>{`${el.email}`}</p>
              </Details>
              <Details>
                <span>Brands:</span>
                <p>{`${el.brands?.join(", ")}`}</p>
              </Details>
            </Item>
          ))}
      </ScrollArea>
      <ChooseBrand>
        <span>Choose brand:</span>
        <Select
          value={otherBrand}
          onChange={(e) => {
            setOtherBrand(e.target.value);
          }}
        >
          <option value="" disabled>
            Select
          </option>
          {otherBrandArr?.map((el) => (
            <option key={el} value={el}>
              {el}
            </option>
          ))}
        </Select>
      </ChooseBrand>

      <ActionButton
        invert
        inactive={!selectedId || !otherBrand}
        onClick={() => {
          copyCrmUser.mutate({ crmuserId: selectedId, otherBrand });
        }}
      >
        Copy
      </ActionButton>
    </Outer>
  );
};

export default CopyCrmUser;
