import React from "react";
import styled from "styled-components";
import { Loader } from "./generic";
import { useClientSegments } from "../utils/hooks/serverHooks";

const ClientSegmentsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
`;

const ClientSegmentContainer = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  background-color: ${({ theme }) => theme.secondary};
  color: ${({ theme }) => theme.textPrimary};
  border-radius: 5px;
  padding: 10px;
  cursor: pointer;
  transition: all 0.2s linear;
  & :nth-child(even) {
    text-align: right;
  }
  & :first-child,
  & :nth-child(2) {
    color: ${({ theme }) => theme.brand};
  }
  &:hover {
    transform: scale(1.01);
  }
`;

const ClientSegmentsData = ({ setSelectedSegment }) => {
  const { data, isLoading } = useClientSegments({
    initialData: [],
    refetchOnMount: true,
  });
  return (
    <ClientSegmentsContainer>
      {isLoading && <Loader />}
      {data.map((segment) => (
        // <DragToAction key={segment._id}>
        <ClientSegmentContainer
          key={segment._id}
          onClick={() => {
            setSelectedSegment(segment);
          }}
        >
          <p>Name</p>
          <p>Users</p>
          <p>{segment.name}</p>
          <p>{segment.totalUsers}</p>
        </ClientSegmentContainer>
        // </DragToAction>
      ))}
    </ClientSegmentsContainer>
  );
};

export default ClientSegmentsData;
