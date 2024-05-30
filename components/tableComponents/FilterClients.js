import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Link from "next/link";

import { colors } from "../../config/colors";

import {
  FormTitle,
  Label,
  Checkbox,
  DatePicker,
  Select,
} from "../formComponents/FormGeneric";
import { countryDataCodes } from "../../config/countries";
import { ActionButton } from "../generic";

const Input = styled.input`
  width: fit-content;
  font-size: 18px;
  padding: 10px;
  border: none;
  border-radius: 3px;
  ::placeholder {
    color: palevioletred;
  }
  width: 150px;
  background-color: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.white};
`;

const Outer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-width: 700px;
  width: 100%;
  padding: 20px;
  background-color: ${({ theme }) => theme.secondary};
  border-radius: 5px;
  position: relative;
`;

const CusLabel = styled.label`
  color: ${({ theme }) => theme.textPrimary};
  font-size: 14px;
`;

const IpnutContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  width: fit-content;
`;

const Row = styled.div`
  display: flex;
  gap: 15px;
  width: 100%;
  flex-wrap: wrap;
`;

const BtnsContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
`;

const Btns = styled.div`
  max-width: 100px;
  width: 100%;
  padding: 10px;
  text-align: center;
  color: ${({ theme }) => theme.white};
  border-radius: 5px;
  background-color: ${({ theme, isDisabled }) =>
    isDisabled ? theme.errorMsg : theme.primary};
  cursor: ${({ isDisabled }) => (isDisabled ? "not-allowed" : "pointer")};
`;

const DescContainer = styled.div`
  background-color: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.textPrimary};
  padding: 15px;
  border-radius: 5px;
`;

const DatePickerContainer = styled.div`
  display: flex;
  align-content: center;
  justify-content: center;
  gap: 5px;
  color: ${({ theme }) => theme.textPrimary};
`;

const SelectContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const CountriesContainer = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: center;
  width: 100%;
  flex-wrap: wrap;
  overflow-y: auto;
  max-height: 300px;
  background-color: ${({ theme }) => theme.primary};
  padding: 3px 0;
  border-radius: 5px;
  gap: 5px;

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

const Country = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  max-width: calc(100% / 3 - 5px);
  width: 100%;
  padding: 2px 3px;
  border-radius: 5px;
  background-color: ${({ theme }) => theme.secondary};

  & > label {
    cursor: pointer;
    width: 100%;
  }
`;

const convertCsvToExcelBuffer = (csvString) => {
  const arrayOfArrayCsv = csvString
    .replace(/\"/g, "")
    .split("\n")
    .map((row) => {
      return row.split(",");
    });
  const wb = XLSX.utils.book_new();
  const newWs = XLSX.utils.aoa_to_sheet(arrayOfArrayCsv);

  Object.keys(newWs).forEach((key) => {
    if (key[0] === "!") return;
    if (key.match(/^([A-Z][1])$/)) {
      newWs[key].s = {
        font: {
          sz: 14,
          bold: true,
          outline: true,
          shadow: true,
        },
        fill: { fgColor: { rgb: "FFD3D3D3" } },
      };
      newWs[key].v = HeaderRowMap[newWs[key].v] || newWs[key].v;
    } else {
      newWs[key].s = {
        font: { sz: 12 },
      };
    }
  });

  wb.SheetNames.push("Transactions");
  wb.Sheets["Transactions"] = newWs;
  const rawExcel = XLSX.write(wb, { type: "base64" });
  return rawExcel;
};

const FilterClients = ({ params, closeModal }) => {
  const [allCountries, setAllCountries] = useState("");
  const [liveAccounts, setLiveAccounts] = useState("");
  const [ftdAmount, setftdAmount] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [ftdDate, setFtdDate] = useState("");
  const [deviceType, setDeviceType] = useState("all");
  const [kycStatus, setKycStatus] = useState("all");

  const [countriesToExport, setCountriesToExport] = useState(
    countryDataCodes.map((x) => x.iso2)
  );

  //set previous valus if they exist
  useEffect(() => {
    setAllCountries(countriesToExport);

    let filtersArray = params.filters?.split(",");
    let obj;
    filtersArray
      ? (obj = Object.fromEntries(
          filtersArray?.map((value) => [
            value.split(":")[0],
            value.split(":")[1],
          ])
        ))
      : (obj = {});

    obj.hasOwnProperty("liveAccounts[gt]")
      ? setLiveAccounts(obj["liveAccounts[gt]"])
      : 0;

    obj.hasOwnProperty("fromDate") ? setFromDate(obj["fromDate"]) : "";

    obj.hasOwnProperty("toDate") ? setToDate(obj["toDate"]) : "";

    obj.hasOwnProperty("fromTransactionDate")
      ? setFtdDate(obj["fromTransactionDate"])
      : "";

    obj.hasOwnProperty("ftdAmount[gt]")
      ? setftdAmount(obj["ftdAmount[gt]"])
      : "";

    obj.hasOwnProperty("deviceType") ? setDeviceType(obj["deviceType"]) : "";

    obj.hasOwnProperty("kycStatus") ? setKycStatus(obj["kycStatus"]) : "";

    obj.hasOwnProperty("country")
      ? setCountriesToExport(
          obj["country"].split("|").map((element) => {
            return element.toLowerCase();
          })
        )
      : "";
  }, [params]);

  const validateFilters = () => {
    let filters = "";

    if (kycStatus && kycStatus != "all") {
      filters = filters + `kycStatus:${kycStatus}`;
    }

    //check countries filters
    if (
      countriesToExport.length != 0 &&
      JSON.stringify(allCountries) != JSON.stringify(countriesToExport)
    ) {
      const countriesFilter = countriesToExport
        .map((country) => `${country.toUpperCase()}`)
        .join("|");

      countriesFilter != ""
        ? (filters = `${filters},country:${countriesFilter}`)
        : "";
    }

    //check Dates
    fromDate != "" ? (filters = `${filters},fromDate:${fromDate}`) : "";

    toDate != "" ? (filters = `${filters},toDate:${toDate}`) : "";

    //check live accounts
    liveAccounts != ""
      ? (filters = `${filters},liveAccounts[gt]:${liveAccounts}`)
      : "";

    //first Transaction Date
    ftdDate != ""
      ? (filters = `${filters},fromTransactionDate:${ftdDate}`)
      : "";

    //first Transaction Amount
    ftdAmount != "" ? (filters = `${filters},ftdAmount[gt]:${ftdAmount}`) : "";
    switch (deviceType) {
      case "android":
      case "iOS":
      case "win":
        filters = `${filters},deviceType:${deviceType}`;
        break;
      case "all":
        filters = `${filters},deviceType:android|iOS|win`;
        break;
    }

    filters = filters.replace(/^,/, ""); //remove extra , in the begging of the the filter string

    return filters;
  };
  return (
    <Outer>
      <FormTitle>Clients Filters</FormTitle>
      <DescContainer>
        <Label>Filters</Label>
      </DescContainer>

      <Row>
        <SelectContainer>
          <Label>Device Type</Label>
          <Select
            value={deviceType}
            style={{ width: "fit-content" }}
            onChange={(e) => setDeviceType(e.target.value)}
          >
            <option value="all">All</option>
            <option value="win">Windows</option>
            <option value="iOS">iOS</option>
            <option value="android">Android</option>
          </Select>
        </SelectContainer>
        <SelectContainer>
          <Label>KYC Status</Label>
          <Select
            value={kycStatus}
            style={{ width: "fit-content" }}
            onChange={(e) => setKycStatus(e.target.value)}
          >
            <option value="all">All</option>
            <option value="true">Approved</option>
            <option value="false">Not Approved</option>
          </Select>
        </SelectContainer>
        <SelectContainer>
          <Label>Live Accounts</Label>
          <IpnutContainer>
            <Input
              placeholder={"0"}
              value={liveAccounts}
              onChange={(e) => {
                const re = /^[0-9\b]+$/; //accept only numbers
                if (e.target.value === "" || re.test(e.target.value)) {
                  setLiveAccounts(e.target.value);
                }
              }}
            ></Input>
          </IpnutContainer>
        </SelectContainer>
        <SelectContainer>
          <Label>FTD Amount (USD)</Label>
          <IpnutContainer>
            <Input
              placeholder={"0"}
              value={ftdAmount}
              onChange={(e) => {
                const re = /^[0-9]*\.?[0-9]*$/; //accept only numbers
                if (e.target.value === "" || re.test(e.target.value)) {
                  setftdAmount(e.target.value);
                }
              }}
            ></Input>
          </IpnutContainer>
        </SelectContainer>
        <Row>
          <DatePickerContainer>
            From:
            <DatePicker
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              max={toDate}
            ></DatePicker>
          </DatePickerContainer>
          <DatePickerContainer>
            To:
            <DatePicker
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              min={fromDate}
            ></DatePicker>
          </DatePickerContainer>
          <DatePickerContainer>
            FtdDate:
            <DatePicker
              type="date"
              value={ftdDate}
              onChange={(e) => setFtdDate(e.target.value)}
              max={toDate}
            ></DatePicker>
          </DatePickerContainer>
        </Row>
      </Row>
      <Row>
        <Row>
          <Label>Countries</Label>
          <ActionButton
            invert
            onClick={() =>
              setCountriesToExport(countryDataCodes.map((el) => el.iso2))
            }
          >
            Select All
          </ActionButton>
          <ActionButton invert onClick={() => setCountriesToExport([])}>
            Clear All
          </ActionButton>
        </Row>
        <CountriesContainer>
          {countryDataCodes.map((el, idx) => (
            <Country key={idx}>
              <Checkbox
                id={el.iso2}
                value={el.iso2}
                checked={countriesToExport.includes(el.iso2)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setCountriesToExport([...countriesToExport, el.iso2]);
                  } else {
                    setCountriesToExport(
                      countriesToExport.filter((lang) => lang !== el.iso2)
                    );
                  }
                }}
              />
              <CusLabel htmlFor={el.iso2}>{el.name}</CusLabel>
            </Country>
          ))}
        </CountriesContainer>
      </Row>
      <BtnsContainer>
        <Link
          href={{
            pathname: "/clients",
            query: {
              page: params.page,
              limit: params.limit,
              filters: validateFilters() ? validateFilters() : params.filters,
            },
          }}
        >
          <Btns onClick={() => closeModal()}>Apply</Btns>
        </Link>
      </BtnsContainer>
    </Outer>
  );
};

export default FilterClients;
