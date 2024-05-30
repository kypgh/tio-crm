import React from "react";
import styled, { useTheme } from "styled-components";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  BarElement,
  RadialLinearScale,
  ArcElement,
} from "chart.js";
import { PolarArea } from "react-chartjs-2";

//Register Controllers for ChartJS
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  RadialLinearScale,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
);

const ChartContainer = styled.div`
  min-height: 500px;
  padding: 10px;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.primary};
  align-items: center;
  justify-content: center;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
`;

const MiniTitle = styled.p`
  width: 100%;
  display: flex;
  color: ${({ theme }) => theme.textSecondary};
`;

const PolarChart = ({
  chartData = [20, 10, 10],
  labelData = ["iOS", "Android", "Windows"],
  chartTitle,
  colorsArr,
}) => {
  const theme = useTheme();
  const labelMapping = {
    iOS: "iOS",
    android: "Android",
    win: "Windows",
  };

  const data = {
    labels: labelData,
    datasets: [
      {
        data: chartData,
        backgroundColor: colorsArr,
        borderColor: theme.primary,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: false,
    scales: {
      r: {
        pointLabels: {
          display: true,
          centerPointLabels: true,
          font: {
            size: 14,
          },
        },
        // max: 28,
        // min: 0,
        ticks: {
          // stepSize: 4,
          showLabelBackdrop: false,
          borderRadius: 20,
          font: {
            size: 10,
          },
          color: theme.textPrimary,
          backdropColor: "rgba(0,0,0,0)",
          backdropPadding: 3,
          z: 11,
        },

        grid: {
          color: theme.secondary,
          z: 10,
          lineWidth: 0.4,
        },
      },
    },
    plugins: {
      legend: {
        position: "bottom",
        display: true,
      },
      title: {
        display: false,
        align: "start",
        text: chartTitle,
      },
    },
  };
  return (
    <ChartContainer theme={theme}>
      <MiniTitle theme={theme}>{chartTitle}</MiniTitle>
      <PolarArea data={data} width={500} height={400} options={options} />
    </ChartContainer>
  );
};

export default PolarChart;
