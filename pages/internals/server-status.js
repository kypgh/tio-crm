import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";

import { AiOutlineReload } from "react-icons/ai";
import {
  GiBadGnome,
  GiBiohazard,
  GiClosedBarbute,
  GiFriedEggs,
  GiMissileLauncher,
  GiPerpendicularRings,
  GiUfo,
} from "react-icons/gi";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { IoWarningOutline } from "react-icons/io5";
import { MdRamenDining } from "react-icons/md";
import { TiThumbsOk } from "react-icons/ti";

import { useWindowSize } from "usehooks-ts";
import { PageOuter, Title } from "../../components/generic";
import TooltipWrapper from "../../components/TooltipWrapper";
import scheduledFunctionsAgent from "../../utils/scheduledFunctionsAgent";

const Outer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  /* justify-content: center; */
  max-height: calc(100vh - 120px);
  overflow-y: auto;
  padding-right: 5px;
  max-width: 900px;
  width: 100%;
  margin: auto;

  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.primary};
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.brand};
    border-radius: 50px;
  }
`;

const Item = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 5px 20px;
  border: ${({ theme }) => `5px solid ${theme.primary}`};
  border-radius: 10px;
  color: ${({ theme }) => theme.textPrimary};
  gap: 10px;

  @media (max-width: 768px) {
    flex-wrap: wrap;
  }
`;

const Cell = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  width: 100%;
  flex: 1;

  & > p {
    color: ${({ theme }) => theme.brand};
  }

  &:last-child {
    justify-content: flex-end;
  }

  @media (max-width: 768px) {
    &:last-child {
      justify-content: center;
    }
  }
`;

const ServerStatus = () => {
  const iconSize = 30;
  const statusColors = {
    Ready: "green",
    Launching: "yellow",
    Updating: "yellow",
    Terminating: "red",
    Terminated: "red",
  };
  const healthStatusColors = {
    Ok: "green",
    Warning: "yellow",
    Degraded: "red",
    Severe: "red",
    Info: "turquoise",
    Pending: "yellow",
    Uknown: "grey",
    Suspended: "grey",
  };

  const { width } = useWindowSize();

  const statusIcons = {
    Ready: <TiThumbsOk size={iconSize} color={statusColors["Ready"]} />,
    Launching: (
      <GiMissileLauncher size={iconSize} color={statusColors["Launching"]} />
    ),
    Updating: (
      <AiOutlineReload size={iconSize} color={statusColors["Updating"]} />
    ),
    Terminating: (
      <MdRamenDining size={iconSize} color={statusColors["Terminating"]} />
    ),
    Terminated: (
      <GiClosedBarbute size={iconSize} color={statusColors["Terminated"]} />
    ),
  };
  const healthStatusIcons = {
    Ok: <TiThumbsOk size={iconSize} color={healthStatusColors["Ok"]} />,
    Warning: (
      <IoWarningOutline size={iconSize} color={healthStatusColors["Warning"]} />
    ),
    Degraded: (
      <GiFriedEggs size={iconSize} color={healthStatusColors["Degraded"]} />
    ),
    Severe: <GiBadGnome size={iconSize} color={healthStatusColors["Severe"]} />,
    Info: (
      <IoMdInformationCircleOutline
        size={iconSize}
        color={healthStatusColors["Info"]}
      />
    ),
    Pending: (
      <GiPerpendicularRings
        size={iconSize}
        color={healthStatusColors["Pending"]}
      />
    ),
    Uknown: <GiUfo size={iconSize} color={healthStatusColors["Uknown"]} />,
    Suspended: (
      <GiBiohazard size={iconSize} color={healthStatusColors["Suspended"]} />
    ),
  };

  const { data } = useQuery(
    ["serverStatus"],
    () =>
      scheduledFunctionsAgent()
        .getServerHealth()
        .then((res) => res.data),
    {
      enabled: true,
    }
  );

  return (
    <PageOuter>
      <Title>Server Status</Title>
      <Outer>
        {data?.awEnviromnets &&
          data.awEnviromnets.map((item) => (
            <Item key={item.id}>
              <Cell>
                <p>
                  <strong>{item.name}</strong>
                </p>
              </Cell>
              <Cell>
                {width > 768 ? (
                  <>
                    <strong>Status:</strong>
                    <p style={{ color: statusColors[item.status] }}>
                      {item.status}
                    </p>
                    <TooltipWrapper tooltip={item.status}>
                      {statusIcons[item.status]}
                    </TooltipWrapper>
                    <strong>Health Status:</strong>
                    <p style={{ color: healthStatusColors[item.healthStatus] }}>
                      {item.healthStatus}
                    </p>
                    <TooltipWrapper tooltip={item.healthStatus}>
                      {healthStatusIcons[item.healthStatus]}
                    </TooltipWrapper>
                  </>
                ) : (
                  <>
                    <p style={{ color: statusColors[item.status] }}>
                      {item.status}
                    </p>
                    <TooltipWrapper tooltip={item.status}>
                      {statusIcons[item.status]}
                    </TooltipWrapper>
                    <p style={{ color: healthStatusColors[item.healthStatus] }}>
                      {item.healthStatus}
                    </p>
                    <TooltipWrapper tooltip={item.healthStatus}>
                      {healthStatusIcons[item.healthStatus]}
                    </TooltipWrapper>
                  </>
                )}
              </Cell>
            </Item>
          ))}
      </Outer>
    </PageOuter>
  );
};

export default ServerStatus;

export async function getStaticProps(context) {
  return {
    props: {},
  };
}
