import React from "react";
import styled from "styled-components";
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
} from "chart.js";
import { Line } from "react-chartjs-2";

//Register Controllers for ChartJS
ChartJS.register(
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
  position: absolute;
  right: 0;
  bottom: 0;
  width: 170px;
`;

const ChartOne = ({
  isUp,
  chartData,
  chartLabels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
  ],
}) => {
  const data = {
    labels: chartLabels,
    datasets: [
      {
        data: chartData,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false,
      },
    },
    elements: {
      line: {
        tension: 0,
        borderWidth: 2,
        borderColor: isUp ? "rgba(47,97,68,1)" : "tomato",
        fill: "start",
        backgroundColor: isUp ? "rgba(47,97,68,0.2)" : "rgba(255,99,71,0.2)",
      },
      point: {
        radius: 0,
        hitRadius: 0,
      },
    },
    scales: {
      xAxis: {
        display: false,
      },
      yAxis: {
        display: false,
      },
    },
  };
  return (
    <ChartBox>
      <Line data={data} width={100} height={30} options={options} />
    </ChartBox>
  );
};

export default ChartOne;
