import React, { useState } from "react";
import styled from "styled-components";

import { PageOuter, Title, AddBtn } from "../../components/generic";
import ModalHook from "../../components/ModalHook";
import CreateOrUpdateSegment from "../../components/segments/CreateOrUpdateSegment";
import ClientSegmentsData from "../../components/ClientSegmentsData";

const OuterSegments = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 15px;
  width: 100%;
  background-color: ${({ theme }) => theme.primary};
  border-radius: 5px;
  color: ${({ theme }) => theme.textPrimary};
`;

const ClientSegments = () => {
  const [selectedSegment, setSelectedSegment] = useState(null);
  return (
    <PageOuter>
      <Title>Client Segments</Title>
      <OuterSegments>
        <ModalHook
          componentToShow={<CreateOrUpdateSegment segment={selectedSegment} />}
        >
          {({ openModal }) => (
            <>
              <AddBtn
                invert
                onClick={() => {
                  setSelectedSegment(null);
                  openModal();
                }}
              >
                Add Segment
              </AddBtn>
              <ClientSegmentsData
                setSelectedSegment={(segment) => {
                  setSelectedSegment(segment);
                  openModal();
                }}
              />
            </>
          )}
        </ModalHook>
        {/* <ClientSegmentTable  /> */}
      </OuterSegments>
    </PageOuter>
  );
};

export default ClientSegments;

export async function getStaticProps(context) {
  return {
    props: {},
  };
}
