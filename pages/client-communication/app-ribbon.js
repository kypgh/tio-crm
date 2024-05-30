import React, { useState } from "react";
import styled from "styled-components";

import { Title, PageOuter } from "../../components/generic";
import ClientDetails from "../../components/ClientDetails";
import CreateRibbon from "../../components/ribbon/CreateRibbon";
import { colors } from "../../config/colors";
import SegmentsSelect from "../../components/ribbon/SegmentsSelect";

const SectionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const TabsOuter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  border: 1px solid ${({ theme }) => theme.primary};
  border-radius: 5px;
  padding: 5px;
`;

const TabRow = styled.div`
  display: flex;
  align-items: center;
  margin: -5px;
  background-color: ${({ theme }) => theme.primary};
  padding: 5px 10px;
  padding-bottom: 0;
`;

const Tab = styled.div`
  padding: 5px 10px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  color: ${({ theme }) => theme.textPrimary};
  cursor: pointer;
  background-color: ${({ theme, selected }) => selected && theme.secondary};
  transition: 0.3s all ease;
`;

const AppRibbon = () => {
  const [selectedTab, setSelectedTab] = useState("client");

  const [segment_id, setSegment_id] = useState(null);
  const [userId, setUserId] = useState("");
  const [activeRibbon, setActiveRibbon] = useState(null);
  return (
    <PageOuter>
      <SectionsContainer>
        <Title>App Ribbon</Title>
        <TabsOuter style={{ borderWidth: "5px" }}>
          <TabRow>
            <Tab
              selected={selectedTab === "client"}
              onClick={() => {
                setSegment_id(null);
                setUserId("");
                setSelectedTab("client");
              }}
            >
              Client ID
            </Tab>
            <Tab
              selected={selectedTab === "segments"}
              onClick={() => {
                setSegment_id(null);
                setUserId("");
                setSelectedTab("segments");
              }}
            >
              Segments
            </Tab>
          </TabRow>
          {selectedTab === "client" && (
            <ClientDetails
              value={userId}
              onSelect={(user) => {
                setUserId(user._id);
                setActiveRibbon(user.active_ribbon);
              }}
            />
          )}
          {selectedTab === "segments" && (
            <SegmentsSelect
              segmentId={segment_id}
              setSegmentId={setSegment_id}
            />
          )}
        </TabsOuter>
        {((selectedTab === "client" && userId !== "") ||
          (selectedTab === "segments" && !!segment_id)) && (
          <CreateRibbon
            type={selectedTab}
            activeRibbon={activeRibbon}
            id={selectedTab === "client" ? userId : segment_id}
            navigateToSegment={(segmentId) => {
              setSelectedTab("segments");
              setSegment_id(segmentId);
            }}
          />
        )}
      </SectionsContainer>
    </PageOuter>
  );
};

export default AppRibbon;

export async function getStaticProps(context) {
  return {
    props: {},
  };
}
