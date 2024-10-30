import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import styled from "styled-components";
import useTheme from "../../utils/hooks/useTheme";
import { countryDataCodes } from "../../config/countries";
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

const HcDonut = ({ userCountryData, chartTitle }) => {
  const [countryData, setCountryData] = useState(userCountryData);

  useEffect(() => {
    setCountryData(userCountryData);
  }, [userCountryData]);

  const dataObjectArray = countryData.map((countryUsers) => ({
    continent: countryDataCodes.find(
      (country) => countryUsers[0] === country.iso2.toUpperCase()
    )?.continent,
    users: countryUsers[1],
    country: countryDataCodes.find(
      (country) => countryUsers[0] === country.iso2.toUpperCase()
    )?.name,
  }));

  let continents = Array.from(new Set(dataObjectArray.map((b) => b.continent)));

  let usersPerContinent = dataObjectArray.reduce((acc, curr) => {
    acc[curr.continent] = (acc[curr.continent] || 0) + curr.users;
    return acc;
  }, {});

  const dataSet = continents.map((continent, index) => ({
    y: usersPerContinent[continent],
    // color: Highcharts.getOptions().colors[index + 1],
    drilldown: {
      name: continent,
      categories: dataObjectArray
        .filter((e) => e.continent === continent)
        .map((e) => e.country?.replace(/\(.*\)/g, "")),
      data: dataObjectArray
        .filter((e) => e.continent === continent)
        .map((e) => e.users),
    },
  }));

  const categories = continents,
    data = dataSet,
    continentData = [],
    countrysData = [],
    dataLen = data.length;

  let i, j, drillDataLen, brightness;

  // Build the data arrays
  for (i = 0; i < dataLen; i += 1) {
    // add continent data
    continentData.push({
      name: categories[i],
      y: data[i].y,
      color: data[i].color,
    });

    // add country data
    drillDataLen = data[i].drilldown.data.length;
    for (j = 0; j < drillDataLen; j += 1) {
      const name = data[i].drilldown.categories[j];
      brightness = 0.2 - j / drillDataLen / 5;
      countrysData.push({
        name,
        y: data[i].drilldown.data[j],
        // color: Highcharts.color(data[i].color).brighten(brightness).get(),
        custom: {
          country: name?.split(" ")[1] || name?.split(" ")[0],
        },
      });
    }
  }

  const options = {
    chart: {
      type: "pie",
      backgroundColor: "transparent",
    },
    title: {
      text: "",
      display: false,
      align: "left",
    },
    subtitle: {
      text: "",
      align: "left",
    },
    plotOptions: {
      pie: {
        shadow: false,
        center: ["50%", "50%"],
      },
    },
    tooltip: {
      valueSuffix: "",
    },
    series: [
      {
        name: "Continent",
        data: continentData,
        size: "45%",
        dataLabels: {
          color: "#ffffff",
          distance: "-50%",
        },
      },
      {
        name: "Country",
        data: countrysData,
        size: "78%",
        innerSize: "60%",
        dataLabels: {
          color: "#fff",
          format: `<b style='outline:none'>{point.name}: </b><span>{y}</span>`,
          filter: {
            property: "y",
            operator: ">",
            value: 1,
          },
          style: {
            fontWeight: "normal",
          },
        },
        id: "countries",
      },
    ],
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 400,
          },
          chartOptions: {
            series: [
              {},
              {
                id: "countries",
                dataLabels: {
                  distance: 1,
                  format: "{point.custom.country}",
                  filter: {
                    property: "percentage",
                    operator: ">",
                    value: 2,
                  },
                },
              },
            ],
          },
        },
      ],
    },
  };
  return (
    <ChartBox>
      <MiniTitle>{chartTitle}</MiniTitle>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </ChartBox>
  );
};

export default HcDonut;
