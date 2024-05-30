import styled from "styled-components";
import { ImArrowUp, ImArrowDown } from "react-icons/im";
import ChartOne from "../charts/ChartOne";
import { Loader } from "../generic";

const DataBox = styled.div`
  min-height: 100px;
  width: 100%;
  border-radius: 10px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.primary};
`;

const Text = styled.div`
  text-align: left;
  width: 100%;
  font-size: 14px;
  color: ${({ theme }) => theme.textSecondary};
`;

const Data = styled.div`
  display: flex;
  font-size: 20px;
  font-weight: bold;
  color: ${({ theme }) => theme.textSecondary};
`;
const Data2 = styled.div`
  display: flex;
  font-size: 14px;
  font-weight: 500;
  color: ${({ percentIncrease }) =>
    typeof percentIncrease === "number"
      ? percentIncrease > 0
        ? "rgba(47,97,68,1)"
        : "tomato"
      : "rgba(77,77,77,1)"};
  margin-right: 5px;
`;

const Icon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  position: relative;
  margin-left: 10px;
  color: ${({ theme }) => theme.textSecondary};
  & p {
    position: absolute;
    font-size: 9px;
    font-weight: 700;
    top: 3px;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${({ theme }) => theme.primary};
  }
`;

const DataText = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  z-index: 2;
`;
const DataText2 = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  z-index: 2;
`;

const DataLoader = styled.div`
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
  border-radius: 0 0 10px 10px;
`;

const ChartContainer = styled.div`
  display: flex;
  position: relative;
`;
/**
 *
 * @param {{
 *  style: React.CSSProperties?
 * }} param0
 * @returns
 */
function ChartInfoBox({
  title,
  data,
  extra,
  percentIncrease,
  chartData,
  chartLabels,
  isLoading = false,
  style,
}) {
  data = data?.toString();
  return (
    <DataBox style={style}>
      <Text>{title}</Text>
      {isLoading ? (
        <DataLoader>
          <Loader width={150} height={150} bgOpacity={0.2} />
        </DataLoader>
      ) : (
        <>
          <DataText>
            <Data>{data}</Data>
            <Icon>{extra && <p>{extra}</p>}</Icon>
          </DataText>
          <DataText2>
            <Data2 percentIncrease={percentIncrease}>
              {typeof percentIncrease === "number"
                ? `${percentIncrease.toFixed(2)}%`
                : "NA"}
            </Data2>
            {typeof percentIncrease === "number" &&
              (percentIncrease > 0 ? (
                <ImArrowUp color="rgba(47,97,68,1)" size={12} />
              ) : (
                <ImArrowDown color="tomato" size={12} />
              ))}
          </DataText2>
          <ChartContainer>
            <ChartOne
              chartLabels={chartLabels}
              isUp={percentIncrease > 0}
              chartData={chartData}
            />
          </ChartContainer>
        </>
      )}
    </DataBox>
  );
}

export default ChartInfoBox;
