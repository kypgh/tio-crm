import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import _ from "lodash";

import { FaFilter } from "react-icons/fa";
import { GiBroom } from "react-icons/gi";

import { colors } from "../../config/colors";
import { ButtonBlue, FilterBtn, Loader } from "../generic";
import ModalHook from "../ModalHook";
import FilterModal from "../modalHookViews/FilterModal";
import {
  filtersToString,
  parseFiltersStringToFiltersObj,
} from "../../utils/functions";
import TooltipWrapper from "../TooltipWrapper";

const Outer = styled.div`
  display: flex;
  align-items: stretch;
  gap: 5px;
  position: relative;
`;

const operatorMap = {
  eq: "=",
  neq: "!=",
  gt: ">",
  gte: ">=",
  lt: "<",
  lte: "<=",
  in: "=",
  nin: "!=",
};

const FiltersBar = ({ allowedFilters, closeModal }) => {
  const router = useRouter();
  const filters = parseFiltersStringToFiltersObj(router.query.filters || "");
  const [selectedFilter, setSelectedFilter] = useState(null);

  useEffect(() => {
    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        filters: localStorage.getItem(`${router.pathname} - filters`),
      },
    });
  }, []);

  function saveFiltersToLocalStorage(filters) {
    const { pathname } = router;
    localStorage.setItem(`${pathname} - filters`, filtersToString(filters));
  }
  function deleteFiltersFromLocalStorage() {
    const { pathname } = router;
    localStorage.removeItem(`${pathname} - filters`);
  }

  function deleteFilter(filter) {
    const result = filtersToString(
      filters.filter((x) => x.type !== filter.type)
    );
    let query = { ...router.query };
    if (!result) {
      delete query.filters;
      deleteFiltersFromLocalStorage();
    } else {
      query.filters = result;
      saveFiltersToLocalStorage(result);
    }
    return router.push({
      pathname: router.pathname,
      query,
    });
  }

  function onAddFilter(filter) {
    saveFiltersToLocalStorage([...filters, filter]);
    return router.push(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          page: 1,
          filters: filtersToString([...filters, filter]),
        },
      },
      undefined,
      { shallow: true }
    );
  }

  function onSaveFilter(filter, originalFilter) {
    saveFiltersToLocalStorage(
      filters.map((x) => (x.type === originalFilter.type ? filter : x))
    );
    return router.push(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          page: 1,
          filters: filtersToString(
            filters.map((x) => (x.type === originalFilter.type ? filter : x))
          ),
        },
      },
      undefined,
      { shallow: true }
    );
  }

  return (
    <Outer>
      <ModalHook
        componentToShow={
          <FilterModal
            allowedFilters={allowedFilters.filter(
              (v) =>
                selectedFilter === v.type ||
                !filters.some((x) => x.type === v.type)
            )}
            onAddFilter={onAddFilter}
            onSaveFilter={onSaveFilter}
          />
        }
      >
        {({ openModal }) => (
          <>
            <TooltipWrapper tooltip="Add Filters" position="top-right">
              <ButtonBlue
                style={{ height: "100%" }}
                onClick={() => {
                  setSelectedFilter(null);
                  openModal();
                }}
              >
                <FaFilter /> Add Filter
              </ButtonBlue>
            </TooltipWrapper>
            {filters.length > 0 && (
              <TooltipWrapper tooltip="Clear Filters" position="top-right">
                <ButtonBlue
                  style={{ height: "100%" }}
                  onClick={() => {
                    let query = { ...router.query };
                    delete query.filters;
                    deleteFiltersFromLocalStorage();
                    return router.push({
                      pathname: router.pathname,
                      query,
                    });
                  }}
                >
                  <GiBroom />
                </ButtonBlue>
              </TooltipWrapper>
            )}
            {filters.map((el) => (
              <FilterBtn
                key={`${el.operator}_${el.type}`}
                onClick={() => {
                  setSelectedFilter(el.type);
                  openModal(el);
                }}
                onDelete={() => deleteFilter(el)}
              >
                {_.startCase(el.type)} {operatorMap[el.operator] || el.operator}{" "}
                {el.value.join(",")}
              </FilterBtn>
            ))}
          </>
        )}
      </ModalHook>
    </Outer>
  );
};

export default FiltersBar;
