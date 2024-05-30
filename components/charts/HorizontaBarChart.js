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
} from "chart.js";
import { Bar } from "react-chartjs-2";

//Register Controllers for ChartJS
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ChartBox = styled.div`
  padding: 10px;
  border-radius: 4px;
  display: flex;
  background-color: ${({ theme }) => theme.primary};
  width: 100%;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;
`;

const MiniTitle = styled.p`
  display: flex;
  width: 100%;
  color: ${({ theme }) => theme.textSecondary};
`;

const HorizontaBarChart = ({ chartData, labelData, chartTitle }) => {
  const theme = useTheme();
  const data = {
    labels: labelData,
    datasets: [
      {
        maxBarThickness: 30,
        data: chartData,
      },
    ],
  };

  const options = {
    type: "horizontalBar",
    indexAxis: "y",
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
        text: chartTitle,
        align: "start",
      },
    },
    elements: {
      bar: {
        backgroundColor: theme.secondaryFaded,
        borderRadius: 3,
        borderColor: theme.secondary,
        borderWidth: 2,
        barThickness: 0.2,
      },
    },

    scales: {
      xAxis: {
        display: true,
        grid: {
          color: theme.secondary,
          z: 10,
          lineWidth: 0.4,
        },
      },
      yAxis: {
        grid: {
          color: theme.secondary,
          z: 10,
          lineWidth: 0.4,
        },
        display: true,
      },
    },
  };
  return (
    <ChartBox>
      <MiniTitle>{chartTitle}</MiniTitle>
      <Bar data={data} width={100} height={40} options={options} />
    </ChartBox>
  );
};

export default HorizontaBarChart;
