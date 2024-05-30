import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import _ from "lodash";

import { colors } from "../../config/colors";
import agent from "../../utils/agent";
import { Select, Details, Label } from "../formComponents/FormGeneric";
import { parseSegmentFilters } from "../../utils/functions";
import { Loader } from "../generic";
import ModalHook from "../ModalHook";
import SegmentedClientsPreview from "../modalHookViews/SegmentedClientsPreview";
import {
  useClientBySegment,
  useClientSegments,
} from "../../utils/hooks/serverHooks";

const Outer = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  position: relative;
`;

const CusLabel = styled.div`
  color: ${({ theme }) => theme.textSecondary};
  font-weight: 700;
`;

const SegmentSelectContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const DetailsOuter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const FiltersOuter = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;

  & > * {
    max-width: calc(33% - 5px);
    width: 100%;
  }
`;

const Oranj = styled.span`
  font-weight: 700;
  color: ${({ theme }) => theme.brand};
`;

const ViewSegmentedClients = styled.div`
  color: ${({ theme }) => theme.blue};
  font-weight: 700;
  cursor: pointer;
  width: fit-content;
`;

const SegmentsSelect = ({ segmentId, setSegmentId }) => {
  const [selectedSegment, setSelectedSegment] = useState({});
  const [segmentToDisplay, setSegmentToDisplay] = useState(null);
  // const [segmentId, setSegmentId] = useState(null);

  const deviceMap = {
    android: "Android",
    iOS: "iOS",
    win: "Windows",
  };
  const mappedFields = {
    kycStatus: "KYC Status",
    deviceType: "Device Type",
    liveAccounts: "Live Accounts",
    demoAccounts: "Demo Accounts",
    ftdAmount: "FTD Amount",
    createdAt: "Created At",
    country: "Country",
    userDeposits: "User Deposits",
    fromDate: "From Date",
    toDate: "To Date",
  };

  const { data, isLoading, isFetching, isError, refetch } = useClientSegments({
    onSuccess: (res) => {
      let segment = {};
      if (segmentId) {
        segment = res.find((s) => s._id === segmentId);
      }
      setSelectedSegment(segment ?? {});
    },
  });

  const {
    data: segmentedClients,
    isLoading: segmentedClientsLoading,
    isFetching: segmentedClientsFetching,
    refetch: refetchSegmentedClients,
  } = useClientBySegment({ enabled: false });

  useEffect(() => {
    if (!_.isEmpty(selectedSegment)) {
      setSegmentToDisplay(parseSegmentFilters(selectedSegment.filtersString));
    } else {
      setSegmentToDisplay(null);
    }
  }, [selectedSegment]);

  useEffect(() => {
    refetch();
  }, [segmentId]);

  if (isLoading || isFetching)
    return (
      <Outer>
        <Loader />
      </Outer>
    );

  return (
    <Outer>
      <SegmentSelectContainer>
        {/* <CusLabel >Select a segment:</CusLabel> */}
        <Select
          style={{ fontSize: "18px", width: "100%" }}
          value={segmentId || ""}
          onChange={(e) => {
            setSelectedSegment(data.find((s) => s._id === e.target.value));
            setSegmentId(e.target.value);
          }}
        >
          <option value="" disabled>
            Select
          </option>
          {data.map((el, idx) => (
            <option key={idx} value={el._id}>
              {el.name}
            </option>
          ))}
        </Select>
      </SegmentSelectContainer>
      {segmentToDisplay && (
        <DetailsOuter>
          <Label>Filters:</Label>
          <FiltersOuter>
            {segmentToDisplay.map((el, idx) => (
              <Details key={idx}>
                {`${idx + 1}. `}
                <strong>{`${mappedFields[el.field]} `}</strong>
                <Oranj>{`${el.operator}`}</Oranj>{" "}
                {Array.isArray(el.value)
                  ? el.value.join(", ")
                  : deviceMap[el.value] || el.value}
              </Details>
            ))}
          </FiltersOuter>
        </DetailsOuter>
      )}
      {segmentedClients && (
        <ModalHook
          componentToShow={<SegmentedClientsPreview data={segmentedClients} />}
        >
          {({ openModal }) => (
            <ViewSegmentedClients onClick={openModal}>
              View Segmented Clients
            </ViewSegmentedClients>
          )}
        </ModalHook>
      )}
    </Outer>
  );
};

export default SegmentsSelect;
