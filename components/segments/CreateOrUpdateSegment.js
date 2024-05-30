import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { parse, v4 as uuidv4 } from "uuid";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { colors } from "../../config/colors";
import { FormTitle, InputField } from "../formComponents/FormGeneric";
import { AddBtn, ActionButton, Loader } from "../generic";
import { useNotification } from "../actionNotification/NotificationProvider";
import agent from "../../utils/agent";
import {
  formatSegmentFilters,
  parseFiltersStringToFiltersObj,
  parseFiltersStringToFiltersObjSegments,
} from "../../utils/functions";
import SelectFiltersRow from "./SelectFiltersRow";
import { filterTypesArr } from "./filters";
import useSelectedBrand from "../../utils/hooks/useSelectedBrand";

const Outer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  border-radius: 5px;
  max-width: 700px;
  width: 100%;
  background-color: ${({ theme }) => theme.secondary};
  padding: 15px;
  position: relative;
`;

const NameContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;

  & span::after {
    content: "*";
    margin-left: 5px;
    color: red;
  }
`;

const AddBtnOuter = styled.div`
  position: relative;
  width: fit-content;
  padding-right: 5px;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #111111;
    border-radius: 5px;
    opacity: 0.5;
    display: ${({ isInactive }) => (isInactive ? "block" : "none")};
    cursor: not-allowed;
  }
`;

const CreateOrUpdateSegment = ({ segment, closeModal }) => {
  const [allFilterTypes, setAllFilterTypes] = useState(filterTypesArr);

  const [segmentName, setSegmentName] = useState(segment ? segment.name : "");
  const [segmentFilters, setSegmentFilters] = useState(
    segment ? parseFiltersStringToFiltersObjSegments(segment.filtersString) : []
  );

  const actionNotification = useNotification();
  const queryClient = useQueryClient();

  const [selectedBrand] = useSelectedBrand();

  useEffect(() => {
    setAllFilterTypes(filterTypesArr);
  }, []);

  const createOrUpdateSegment = useMutation(
    ({ _id, segmentName, segmentFilters }) =>
      !!_id
        ? agent().updateSegment(_id, segmentName, segmentFilters)
        : agent().createSegment(segmentName, segmentFilters),
    {
      mutationKey: "createSegment",
      onSuccess: () => {
        queryClient.invalidateQueries([selectedBrand, "clientsSegments"]);
        actionNotification.SUCCESS("Segment saved successfully");
        closeModal();
      },
    }
  );

  const availableFilters = allFilterTypes.filter(
    (v) => !segmentFilters.some((v2) => v2.type === v.type)
  );
  return (
    <Outer>
      {createOrUpdateSegment.isLoading && <Loader />}
      <FormTitle>Create Segment</FormTitle>
      <NameContainer>
        <span>Name of Segment</span>
        <InputField
          value={segmentName}
          onChange={(e) => setSegmentName(e.target.value)}
          placeholder="Segment Name"
        />
      </NameContainer>
      {segmentFilters.map((filter) => (
        <SelectFiltersRow
          key={filter.uuid}
          availableFilters={availableFilters}
          filter={filter}
          setFilter={(value) => {
            setSegmentFilters((v) => {
              return v.map((filt) => (filt.uuid === value.uuid ? value : filt));
            });
          }}
          filterOptions={
            allFilterTypes.find((f) => f.type === filter.type) ?? {
              name: "",
              type: "",
              operators: [],
              values: [],
              inputType: "",
            }
          }
          onDelete={() => {
            setSegmentFilters((v) => v.filter((f) => f.uuid !== filter.uuid));
          }}
        />
      ))}

      <AddBtnOuter isInactive={segmentFilters.length === allFilterTypes.length}>
        <AddBtn
          onClick={() => {
            setSegmentFilters((v) => [
              ...v,
              {
                uuid: uuidv4(),
                type: "",
                operator: "",
                value: "",
                inputType: "",
              },
            ]);
          }}
        >
          Add Filter
        </AddBtn>
      </AddBtnOuter>
      {segmentFilters.length > 0 && (
        <ActionButton
          invert
          style={{ maxWidth: "100px", margin: "auto" }}
          onClick={() => {
            if (
              segmentFilters.some(
                (f) => f.type === "" || f.operator === "" || f.value === ""
              )
            ) {
              actionNotification.INFO("Please fill all the fields");
              return;
            }
            if (segmentName.length === 0) {
              actionNotification.INFO("Please enter segment name");
              return;
            }
            if (segmentFilters.length === 0) {
              actionNotification.INFO("Please add atleast one filter");
              return;
            }

            createOrUpdateSegment.mutate({
              ...(segment ? { _id: segment._id } : {}),
              segmentName,
              segmentFilters: formatSegmentFilters(segmentFilters),
            });
          }}
        >
          Save
        </ActionButton>
      )}
      <ActionButton
        invert
        style={{ maxWidth: "100px", margin: "auto" }}
        onClick={() => {
          closeModal();
        }}
      >
        Cancel
      </ActionButton>
    </Outer>
  );
};

export default CreateOrUpdateSegment;
