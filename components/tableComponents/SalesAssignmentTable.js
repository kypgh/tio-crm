import React, { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import styled from "styled-components";

import {
  TableOuter,
  Cell,
  FilterContainer,
  FilterInnerContainer,
  Row,
  TableData,
  TableLoader,
} from "./TableGeneric";
import { countryDataCodes } from "../../config/countries";
import ModalHook from "../ModalHook";
import { FormTitle, Checkbox, InputField } from "../formComponents/FormGeneric";
import { ActionButton, ButtonBlue } from "../generic";
import { useNotification } from "../actionNotification/NotificationProvider";
import agent from "../../utils/agent";
import { usePermissions } from "../PCR";
import { PERMISSIONS } from "../../config/permissions";
import { useRouter } from "next/router";
import { useSalesCrmUsers } from "../../utils/hooks/serverHooks";
import useSelectedBrand from "../../utils/hooks/useSelectedBrand";
import { useDebounce } from "usehooks-ts";
import { searchScore } from "../../utils/helpers";

const CusInput = styled.input`
  max-width: 300px;
  width: 100%;
  background-color: ${({ theme }) => theme.secondary};
  color: ${({ theme }) => theme.textSecondary};
  border-radius: 5px;
  padding: 2px 5px;
  font-size: 14px;
  border-color: transparent;
  box-shadow: none;

  &:focus-visible {
    outline: none;
  }
`;

const CountryBG = styled.div`
  background-color: ${({ theme }) => theme.brand};
  border-radius: 5px;
  padding: 2px;
  min-width: 20px;
  max-width: 30px;
  text-align: center;
  font-weight: 700;
  color: ${({ theme }) => theme.secondary};
`;

const Outer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  gap: 15px;
  max-width: 800px;
  width: 100%;
  padding: 20px;
  background-color: ${({ theme }) => theme.secondary};
  border-radius: 5px;
  position: relative;
`;

const Inner = styled.div`
  display: flex;
  justify-content: space-evenly;
  height: 500px;
`;

const CountriesContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 450px;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  gap: 3px;
  padding: 3px 5px;
  background-color: ${({ theme }) => theme.primary};
  border-radius: 5px;

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

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 3px 5px;
  border: 1px solid ${({ theme }) => theme.primary};
  background-color: ${({ theme }) => theme.secondary};
  border-radius: 5px;
  cursor: pointer;

  & label {
    width: 100%;
    cursor: pointer;
  }
`;

const Right = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const CountriesSelect = ({
  preselectedCountries,
  salesAgentId,
  closeModal,
  params,
}) => {
  const [selectedCountries, setSelectedCountries] =
    useState(preselectedCountries);

  const [countriesData, setCountriesData] = useState(countryDataCodes);
  const [search, setSearch] = useState("");

  const actionNotification = useNotification();
  const queryClient = useQueryClient();

  const [selectedBrand] = useSelectedBrand();

  const updateSalesCountryRotation = useMutation(
    ({ salesAgentId, countriesArr }) => {
      let countriesToAdd = countriesArr.filter(
        (country) => !preselectedCountries.includes(country)
      );
      let countriesToRemove = preselectedCountries.filter(
        (country) => !countriesArr.includes(country)
      );
      return Promise.all([
        agent().addSaleCountriesRotation(salesAgentId, countriesToAdd),
        agent().deleteSaleCountriesRotation(salesAgentId, countriesToRemove),
      ]);
    },
    {
      onSuccess: () => {
        actionNotification.SUCCESS("Countries updated successfully");
        queryClient.invalidateQueries([selectedBrand, "salesCrmUsers"]);
        closeModal();
      },
      mutationKey: ["updateSalesCountryRotation", salesAgentId],
    }
  );

  useEffect(() => {
    setCountriesData(
      countryDataCodes.filter((el) =>
        el.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search]);
  const isShowingAllSelected =
    countriesData.every((el) =>
      selectedCountries.includes(el.iso2.toUpperCase())
    ) && countriesData.length === selectedCountries.length;
  return (
    <Outer>
      <FormTitle style={{ width: "100%" }}>Select Countries</FormTitle>
      <Inner>
        <CountriesContainer>
          {countriesData.map((el, idx) => (
            <CheckboxContainer key={idx}>
              <Checkbox
                id={el.iso2}
                value={el.iso2.toUpperCase()}
                checked={selectedCountries.includes(el.iso2.toUpperCase())}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedCountries([
                      ...selectedCountries,
                      e.target.value,
                    ]);
                  } else {
                    setSelectedCountries(
                      selectedCountries.filter((el) => el !== e.target.value)
                    );
                  }
                }}
              />
              <label htmlFor={el.iso2}>
                {`${el.name.replace(/\(.*\)/g, "")} (${el.iso2.toUpperCase()})`}
              </label>
            </CheckboxContainer>
          ))}
        </CountriesContainer>
        <Right>
          <InputField
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <ActionButton
            invert
            onClick={() => {
              setSelectedCountries(
                countryDataCodes.map((el) => el.iso2.toUpperCase())
              );
              setSearch("");
            }}
          >
            Select All
          </ActionButton>
          <ActionButton
            invert
            onClick={() => {
              setSelectedCountries([]);
              setSearch("");
            }}
          >
            Clear All
          </ActionButton>
          <ActionButton
            invert={isShowingAllSelected}
            onClick={() => {
              if (!isShowingAllSelected) {
                setCountriesData(
                  countryDataCodes.filter((el) =>
                    selectedCountries.includes(el.iso2.toUpperCase())
                  )
                );
              } else {
                setCountriesData(countryDataCodes);
              }
              setSearch("");
            }}
          >
            {!isShowingAllSelected
              ? `Show selected (${selectedCountries.length})`
              : "Show all"}
          </ActionButton>
          <ActionButton invert onClick={closeModal}>
            Cancel
          </ActionButton>
        </Right>
      </Inner>
      <ActionButton
        invert
        style={{ maxWidth: "100px", margin: "auto" }}
        onClick={() =>
          updateSalesCountryRotation.mutate({
            salesAgentId,
            countriesArr: selectedCountries,
          })
        }
      >
        Save
      </ActionButton>
    </Outer>
  );
};

const SalesAssignmentTable = () => {
  const router = useRouter();
  const { data, isLoading, isFetching } = useSalesCrmUsers();
  const [filter, setFilter] = useState("");
  const debouncedFilter = useDebounce(filter, 500);
  const salesToShow = useMemo(() => {
    if (!data) return [];
    if (!debouncedFilter) return data.docs || [];
    return data.docs
      .map((el) => {
        const score =
          searchScore(el.email, debouncedFilter) * 0.5 +
          searchScore(el.first_name, debouncedFilter) * 0.3 +
          searchScore(el.last_name, debouncedFilter) * 0.2;
        return {
          ...el,
          score,
        };
      })
      .filter((el) => el.score > 2)
      .sort((a, b) => b.score - a.score);
  }, [data, debouncedFilter]);
  const { isAllowed } = usePermissions(
    [
      PERMISSIONS.CRM_USERS.add_crm_user_sales_countries.value,
      PERMISSIONS.CRM_USERS.remove_crm_user_sales_countries.value,
    ],
    true
  );
  if (isLoading || isFetching) return <TableLoader />;

  return (
    <TableOuter>
      <FilterContainer>
        <FilterInnerContainer>
          <CusInput
            type="text"
            placeholder="Search..."
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
            }}
          />
          <ButtonBlue onClick={() => setFilter("")}>Reset</ButtonBlue>
        </FilterInnerContainer>
      </FilterContainer>
      <TableData>
        <Row header>
          <Cell>First Name</Cell>
          <Cell>Last Name</Cell>
          <Cell>Email</Cell>
          <Cell isLarge>Assigned Countries</Cell>
          <Cell isMedium>Department</Cell>
        </Row>
        {salesToShow.map((el, idx) => (
          <Row key={idx}>
            <Cell style={{ alignItems: "flex-start" }}>{el.first_name}</Cell>
            <Cell style={{ alignItems: "flex-start" }}>{el.last_name}</Cell>
            <Cell style={{ alignItems: "flex-start" }}>{el.email}</Cell>
            <ModalHook
              componentToShow={
                <CountriesSelect
                  preselectedCountries={el.sales_rotation_countries}
                  salesAgentId={el._id}
                  params={router.query}
                />
              }
            >
              {({ openModal }) => (
                <Cell
                  isLarge
                  actionable={isAllowed}
                  onClick={() => isAllowed && openModal()}
                  style={{
                    justifyContent: "flex-start",
                    flexWrap: "wrap",
                  }}
                >
                  {el.sales_rotation_countries.slice(0, 5).map((code, i) => (
                    <CountryBG key={i}>{code}</CountryBG>
                  ))}
                  {el.sales_rotation_countries.length > 5 &&
                    `- and ${el.sales_rotation_countries.length - 5} more...`}
                </Cell>
              )}
            </ModalHook>
            <Cell isMedium style={{ alignItems: "flex-start" }}>
              {el.department}
            </Cell>
          </Row>
        ))}
      </TableData>
    </TableOuter>
  );
};

export default SalesAssignmentTable;
