import _ from "lodash";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";

import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  IoIosArrowDown,
  IoIosArrowUp,
  IoIosRemove,
  IoMdClose,
} from "react-icons/io";

import { BsFilterLeft } from "react-icons/bs";
import { FaFileExport } from "react-icons/fa";
import { pruneNullOrUndefinedFields } from "../../utils/functions";
import useDebounce from "../../utils/hooks/useDebounce";
import useFieldsLocalStorage from "../../utils/hooks/useFieldsLocalStorage";
import { useNotification } from "../actionNotification/NotificationProvider";
import { ButtonBlue, Draggable, Loader, Switch } from "../generic";
import { useMutation } from "@tanstack/react-query";

const TableOuterSC = styled.div`
  background-color: ${({ theme }) => theme.primary};
  border-radius: 3px;
  padding: 5px;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-height: 150px;
`;

/**
 *
 * @param {{ style: React.CSSProperties }} param0
 * @returns
 */
export const TableOuter = ({ children, style }) => {
  return <TableOuterSC style={style}>{children}</TableOuterSC>;
};

const FilterContainerSC = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  width: 100%;
  background-color: ${({ theme }) => theme.primary};
  padding: 3px 5px;
  border-bottom: 2px solid ${({ theme }) => theme.secondary};
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
`;

/**
 * @param {{style: React.CSSProperties}} param0
 * @returns {React.Component}
 *
 * This is used with the table component!
 */
export const FilterContainer = ({ children, style }) => {
  return <FilterContainerSC style={style}>{children}</FilterContainerSC>;
};

const FilterInnerContainerSC = styled.div`
  display: flex;
  align-items: stretch;
  gap: 5px;
  white-space: nowrap;

  & > p {
    color: ${({ theme }) => theme.textSecondary};
    line-height: 1.7;
    width: 100%;
    text-align: center;
  }
`;

/**
 * @param {{style: React.CSSProperties, }} param0
 * @returns {React.Component}
 *
 */
export const FilterInnerContainer = ({ children, style }) => {
  return (
    <FilterInnerContainerSC style={style}>{children}</FilterInnerContainerSC>
  );
};

const TableDataSC = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: ${({ theme }) =>
    theme.name == "light" ? "transparent" : theme.secondary};
  min-height: 50px;
  max-height: 600px;
  overflow-y: scroll;

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

/**
 * @param {{style: React.CSSProperties, }} param0
 * @returns {React.Component}
 *
 */
export const TableData = ({ children, style }) => {
  return <TableDataSC style={style}>{children}</TableDataSC>;
};

const RowSC = styled.div`
  display: flex;
  /* gap: 10px; */
  align-items: stretch;
  justify-content: space-between;
  border-bottom: ${({ header, theme }) =>
    !header ? "1px " + theme.tableBorder + " solid" : ""};
  border-top: ${({ header, filterExists }) =>
    header && filterExists && "2px solid #2a353e"};
  font-weight: ${({ header }) => header && "bold"};
  margin-bottom: ${({ header }) => header && "-5px"};
  position: ${({ header }) => header && "sticky"};
  top: 0;
  z-index: ${({ header }) => header && "1"};
  background-color: ${({ theme, header }) =>
    header ? (theme.name == "light" ? theme.secondary : theme.primary) : ""};
  color: ${({ theme, header }) => (header ? theme.white : theme.textPrimary)};
  color: ${({ isDisabled }) => isDisabled && "grey"};
  pointer-events: ${({ isDisabled }) => isDisabled && "none"};

  & svg {
    color: ${({ isDisabled }) => isDisabled && "grey !important"};
  }

  &:hover {
    background-color: ${({ theme, actionable }) => actionable && theme.primary};
  }

  & a {
    color: ${({ theme, header }) => (header ? theme.white : theme.textPrimary)};
    height: 100%;
    text-decoration: none;
  }
`;

export const Row = ({
  children,

  header = false,
  filterExists = true,
  actionable = false,
  isDisabled = false,
}) => {
  return (
    <RowSC
      header={header}
      filterExists={filterExists}
      actionable={actionable}
      isDisabled={isDisabled}
    >
      {children}
    </RowSC>
  );
};

const CellSC = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 3px;
  justify-content: ${({ center }) => center && "center"};
  padding: 10px 5px;
  width: 100%;
  min-width: 60px;
  max-width: ${({ isExtraSmall }) => isExtraSmall && "60px"};
  max-width: ${({ isSmall }) => isSmall && "85px"};
  max-width: ${({ isNormal }) => isNormal && "110px"};
  max-width: ${({ isMedium }) => isMedium && "170px"};
  max-width: ${({ isLarge }) => isLarge && "250px"};
  max-width: ${({ isCheckbox }) => isCheckbox && "50px"};
  min-width: ${({ isCheckbox }) => isCheckbox && "50px"};

  overflow-wrap: break-word;
  word-break: break-all;
  font-size: 12px;

  border-right: 1px ${({ theme }) => theme.tableBorder} solid;
  text-transform: ${({ typeDocument }) => typeDocument && "capitalize"};
  flex-direction: ${({ right }) => right && "row-reverse"};
  cursor: ${({ actionable }) => actionable && "pointer"};

  &:hover {
    background-color: ${({ theme, actionable }) => actionable && theme.primary};
  }

  &:last-child {
    border-bottom: none;
    border-right: none;
  }

  & svg {
    cursor: pointer;
  }

  & input[type="checkbox"] {
    cursor: pointer;
  }

  & a {
    display: flex;
    align-items: center;
    width: 100%;
  }

  //these are for the sort icon
  & .sortBtn {
    width: unset;
  }
  & .sortBtn.desc svg {
    transform: rotate(180deg);
  }
  & .sortBtn.desc {
    transform: rotate(180deg);
  }
`;

/**
 * @param {{style: React.CSSProperties,children,isExtraSmall,isSmall,isNormal,isMedium,isLarge,isCheckbox, center, onClick, typeDocument, right, actionable , sortDirection}} param0
 * @returns {React.Component}
 *
 * This is used with the table component!
 */
export const Cell = ({
  children,

  isExtraSmall,
  isSmall,
  isNormal,
  isMedium,
  isLarge,
  isCheckbox,
  center,
  onClick,
  typeDocument,
  style,
  right,
  actionable = false,
  sortDirection,
}) => {
  return (
    <CellSC
      onClick={onClick}
      isExtraSmall={isExtraSmall}
      isSmall={isSmall}
      isNormal={isNormal}
      isMedium={isMedium}
      isLarge={isLarge}
      isCheckbox={isCheckbox}
      center={center}
      typeDocument={typeDocument}
      style={style}
      right={right}
      actionable={actionable}
    >
      {children}
    </CellSC>
  );
};

const NavigateBtnsContainerSC = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 5px;
  min-width: 260px;
  & p {
    color: ${({ theme }) => theme.textSecondary};
    padding: 0 5px;
  }
`;

export const NavigateBtnsContainer = ({ children, theme }) => {
  return <NavigateBtnsContainerSC>{children}</NavigateBtnsContainerSC>;
};

export const TableLoader = ({ theme }) => {
  return (
    <TableOuter>
      <FilterContainer>
        <FilterInnerContainer />
      </FilterContainer>
      <TableData>
        <Row header>
          <Cell />
        </Row>
      </TableData>
      <Loader />
    </TableOuter>
  );
};

export const SortLink = ({ field, limit }) => {
  const router = useRouter();
  const [sortDirection, setSortDirection] = useState("asc");

  useEffect(() => {
    setSortDirection(router.query?.sort?.split(":")[1]);
  }, [router.query?.sort]);

  return (
    <Link
      href={{
        pathname: router.pathname,
        query: {
          ...router.query,
          page: 1,
          limit: limit || 50,
          sort: `${field}:${sortDirection === "asc" ? "desc" : "asc"}`,
        },
      }}
      passHref
    >
      <a className="sortBtn">
        {router.query?.sort?.split(":")[0] === field ? (
          sortDirection === "asc" ? (
            <IoIosArrowDown />
          ) : (
            <IoIosArrowUp />
          )
        ) : (
          <IoIosRemove />
        )}
      </a>
    </Link>
  );
};

const LimitInput = styled.input`
  max-width: 40px;
  width: 100%;
  background-color: ${({ theme }) => theme.secondary};
  color: ${({ theme }) => theme.textSecondary};
  border-radius: 5px;
  padding: 2px 5px;
  font-size: 14px;
  border-color: transparent;
  box-shadow: none;
  position: relative;

  &:focus-visible {
    outline: none;
  }

  /* Chrome, Safari, Edge, Opera */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  /* Firefox */
  &[type="number"] {
    -moz-appearance: textfield;
  }
`;

const NavigateBtn = styled.div`
  max-width: 80px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: ${({ theme, disabled }) =>
    disabled ? theme.disabled : theme.secondary};
  color: ${({ theme, disabled }) =>
    disabled ? theme.black : theme.textPrimary};
  border-radius: 5px;
  cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};
  pointer-events: ${({ disabled }) => (disabled ? "none" : "auto")};

  & a {
    text-decoration: none;
    color: inherit;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
`;

const HintText = styled.p`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 12px;
  display: flecx;
  align-items: center;
  margin: auto;
  width: 100%;
  align-self: center;
  justify-content: center;
  opacity: 0.7;
  & > span {
    text-decoration: underline;
  }
`;

/**
 *
 * This is used with the table component! You need to pass the  params and data
 */
export const PaginationSettings = ({ data }) => {
  const [cusLimit, setCusLimit] = useState(data?.limit || 50);
  const router = useRouter();

  return (
    <FilterContainer>
      <FilterInnerContainer style={{ minWidth: "210px" }}>
        <p>Limit Results:</p>
        <LimitInput
          type="number"
          min="1"
          value={cusLimit}
          onChange={(e) => {
            let value = e.target.value.replace(/\D/g, "");
            if (parseInt(value) > 0 || value === "") {
              if (value > 100) {
                setCusLimit(100);
                return;
              }
              setCusLimit(value);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              // lol
              if (e.target.value === "") return;
              router.push(
                {
                  pathname: router.pathname,
                  query: {
                    ...pruneNullOrUndefinedFields(router.query),
                    page: 1,
                    limit: cusLimit,
                  },
                },
                undefined,
                { shallow: true }
              );
            }
          }}
        />
        <ButtonBlue
          onClick={() => {
            if (cusLimit === "") return;
            router.push(
              {
                pathname: router.pathname,
                query: {
                  ...pruneNullOrUndefinedFields(router.query),
                  page: 1,
                  limit: cusLimit,
                },
              },
              undefined,
              { shallow: true }
            );
          }}
        >
          Apply
        </ButtonBlue>
      </FilterInnerContainer>
      <FilterInnerContainer style={{ minWidth: "140px" }}>
        <p>Total Results: {data?.totalDocs}</p>
      </FilterInnerContainer>
      <HintText>
        Hint: <span>scroll wheel</span> is vertical scroll but{" "}
        <span>shift + scroll wheel</span> is horizontal scroll
      </HintText>
      <NavigateBtnsContainer>
        <p>
          Page {data?.page} of {data?.totalPages}
        </p>
        <Link
          href={{
            pathname: router.pathname,
            query: {
              ...pruneNullOrUndefinedFields(router.query),
              page: data?.prevPage,
              limit: data?.limit || 50,
            },
          }}
          shallow
        >
          <NavigateBtn disabled={!data?.hasPrevPage}>Previous</NavigateBtn>
        </Link>
        <Link
          href={{
            pathname: router.pathname,
            query: {
              ...pruneNullOrUndefinedFields(router.query),
              page: data?.nextPage,
              limit: data?.limit || 50,
            },
          }}
          shallow
        >
          <NavigateBtn disabled={!data?.hasNextPage}>Next</NavigateBtn>
        </Link>
      </NavigateBtnsContainer>
    </FilterContainer>
  );
};

const Spin = keyframes`
  0% {
    transform: rotateZ(0deg);
  }
  100% {
    transform: rotateZ(360deg);
  }
`;

const Spinner = styled.div`
  animation: ${Spin} 0.5s linear infinite;
  display: flex;
  align-items: center;
  justify-content: center;
`;

/**
 *
 *
 * Same as PaginationSettings but used without url params, you need to pass states from the parent component,
 * Limit and page need to be passed in the array name of useQuery, so it refetched when they change
 */
export const NoParamsPaginationSettings = ({
  data,
  limit,
  setLimit,
  setPage,
}) => {
  const [cusLimit, setCusLimit] = useState(limit || 50);

  const handleOnChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (parseInt(value) > 0 || value === "") {
      if (value > 100) {
        setCusLimit(100);
        return;
      }
      setCusLimit(value);
    }
  };

  const { debouncedValue, isDebouncing } = useDebounce(
    cusLimit,
    500,
    (value) => {
      if (value === "" || cusLimit === limit) return;
      setLimit(value);
      setPage(1);
    }
  );

  return (
    <FilterContainer>
      <FilterInnerContainer>
        <p style={{ width: "unset" }}>Limit Results:</p>
        <LimitInput
          type="number"
          min="1"
          value={cusLimit}
          onChange={handleOnChange}
        />
        {debouncedValue !== cusLimit && (
          <Spinner>
            <AiOutlineLoading3Quarters />
          </Spinner>
        )}
      </FilterInnerContainer>
      <NavigateBtnsContainer>
        <p>
          Page {data.page} of {data.totalPages}
        </p>
        <NavigateBtn
          disabled={!data.hasPrevPage}
          onClick={() => {
            if (!data.hasPrevPage) return;
            setPage(data.prevPage);
          }}
        >
          Previous
        </NavigateBtn>
        <NavigateBtn
          disabled={!data.hasNextPage}
          onClick={() => {
            if (!data.hasNextPage) return;
            setPage(data.nextPage);
          }}
        >
          Next
        </NavigateBtn>
      </NavigateBtnsContainer>
    </FilterContainer>
  );
};

//TODO: MAYBE REFACTOR THIS

/**
 *
 * Wrap the Cells with this and pass a prop ex.: sortField={'loginId'} on the Cells you want to be sortable.
 * You will also need setSort, sortField, setSortField, sortDirection, setSortDirection states to be passed from the parent component
 * (the states can be null, but you need to pass them)
 */
export const NoParamsSortLink = ({
  children,
  setSort,
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
}) => {
  useEffect(() => {
    if (sortField && sortDirection) setSort(`${sortField}:${sortDirection}`);
  }, [sortDirection, sortField, setSort]);

  return children.map((child, idx) => (
    <React.Fragment key={idx}>
      {child.props?.sortField ? (
        <Cell {...child.props}>
          {child.props.children}
          <IoIosArrowDown
            className={`sortBtn ${sortDirection}`}
            onClick={() => {
              setSortField(child.props.sortField);
              setSortDirection(sortDirection === "asc" ? "desc" : "asc");
            }}
          />
        </Cell>
      ) : (
        child
      )}
    </React.Fragment>
  ));
};

const SearchOuterContainer = styled.div`
  position: relative;
  width: fit-content;
`;

const ClearContainer = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 3px;
  display: flex;
  align-items: center;
  width: fit-content;
  color: ${({ theme }) => theme.textSecondary};
  cursor: pointer;
  transition: 0.3s all ease;
`;

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

export const SearchQuery = ({ theme }) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(router.query.search || "");

  useDebounce(searchQuery, 500, (search) => {
    let query = { ...router.query };
    if (search === "") {
      delete query.search;
      router.push({
        pathname: router.pathname,
        query,
      });
    } else {
      router.push({
        pathname: router.pathname,
        query: {
          ...query,
          search,
        },
      });
    }
  });

  return (
    <SearchOuterContainer>
      <CusInput
        type="text"
        placeholder="Search..."
        onChange={(e) => {
          setSearchQuery(e.target.value);
        }}
        value={searchQuery}
      />
      {searchQuery && (
        <ClearContainer onClick={() => setSearchQuery("")}>
          <IoMdClose />
        </ClearContainer>
      )}
    </SearchOuterContainer>
  );
};

const FieldsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  color: ${({ theme }) => theme.textPrimary};
`;

const FieldItemSC = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const FieldItem = ({ field, onChange }) => {
  return (
    <FieldItemSC>
      <Switch
        checked={field.selected}
        onChange={onChange}
        id={"field_" + field.value}
      />
      <label
        style={{ cursor: "pointer", display: "flex", flex: "1 1 auto" }}
        htmlFor={"field_" + field.value}
      >
        {field.label}
      </label>
    </FieldItemSC>
  );
};

export const FieldsFilter = ({ availbleFields = [], title }) => {
  const [fields, setFields] = useFieldsLocalStorage(availbleFields);
  const [isOpen, setIsOpen] = useState(false);
  const [initState, setInitState] = useState({ x: 0, y: 0 });

  return (
    <>
      <ButtonBlue
        active={isOpen}
        onClick={(e) => {
          setIsOpen(!isOpen);
          setInitState({ x: e.clientX, y: e.clientY });
        }}
      >
        Fields <BsFilterLeft />
      </ButtonBlue>
      {isOpen && (
        <Draggable
          title={title}
          initState={initState}
          closeSelf={() => setIsOpen(false)}
          reset={() =>
            setFields(
              availbleFields
                .filter((x) => typeof x.custom !== "boolean" && !x.custom)
                .map((x) => {
                  if (_.isObject(x))
                    return {
                      ...x,
                      selected: x.hasOwnProperty("selected")
                        ? x.selected
                        : false,
                    };
                  return { value: x, label: x, selected: false };
                })
            )
          }
        >
          <FieldsContainer>
            {fields.map((field) => (
              <FieldItem
                key={field.value}
                field={field}
                onChange={() => {
                  setFields(
                    fields.map((x) => {
                      if (x.value === field.value) {
                        return { ...x, selected: !field.selected };
                      }
                      return x;
                    })
                  );
                }}
              />
            ))}
          </FieldsContainer>
        </Draggable>
      )}
    </>
  );
};

const loadingAnimation = keyframes`
  0% {
    background: linear-gradient(300deg, rgba(255,255,255,1) 0%, rgba(0,115,56,1) 50%, rgba(255,255,255,1) 100%);
    background-size: 200% 100%;
    background-position-x: 200%;

  }
  50% {
    background: linear-gradient(300deg, rgba(255,255,255,1) 0%, rgba(0,115,56,1) 50%, rgba(255,255,255,1) 100%);
    background-size: 200% 100%;
    background-position-x: 100%;

  }
  100% {
    background: linear-gradient(300deg, rgba(255,255,255,1) 0%, rgba(0,115,56,1) 50%, rgba(255,255,255,1) 100%);
    background-size: 200% 100%;
    background-position-x: 0% ;
  }
`;

const ExportExcl = styled.div`
  color: #007338;
  border: 1px solid #007338;
  padding: 3px 10px;
  background-color: ${({ theme }) => theme.secondary};
  border-radius: 5px;
  cursor: ${({ $isLoading }) => ($isLoading ? "not-allowed" : "pointer")};
  user-select: none;
  /* margin-left: auto; */
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  transition: 0.3s all ease;
  &:hover {
    background-color: #007338;
    color: ${({ theme }) => theme.white};
  }
  animation: ${({ $isLoading }) => $isLoading && loadingAnimation} 1s linear
    infinite;

  & p {
    mix-blend-mode: ${({ $isLoading }) => $isLoading && "color-burn"};
  }
`;

const ExportModal = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  width: 100%;
  min-height: 150px;
  background-color: ${({ theme }) => theme.secondary};
  border-radius: 3px;
  padding: 10px;
  position: relative;
  max-width: 700px;
  color: ${({ theme }) => theme.white};
  justify-content: center;
  & > * {
    width: calc(50% - 5px);
  }
`;

/**
 *
 * @param {{
 *   exportFunction: (params: { exportType: string, filters: any }) => Promise<any>;
 *   exportType: "excel" | "csv";
 * }} param0
 * @returns
 */
export const TableExport = ({ exportFunction, exportType = "csv" }) => {
  const router = useRouter();
  const notify = useNotification();
  const { isLoading, mutate } = useMutation({
    mutationFn: ({ filters }) => exportFunction({ exportType, filters }),
    onSuccess: (res) => {
      const filename =
        res.headers["content-disposition"]?.split("=")[1] ?? "export";
      const link = document.createElement("a");
      var file = new Blob([res.data], {
        type: res.headers["content-type"],
      });
      link.href = URL.createObjectURL(file);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      notify.SUCCESS("Exported");
    },
    onError: () => {
      notify.ERROR("Export failed");
    },
  });
  return (
    <ExportExcl
      $isLoading={isLoading}
      onClick={() => {
        if (isLoading) return;
        mutate({
          filters: router.query.filters,
        });
      }}
    >
      <p>Export</p>
      <FaFileExport />
    </ExportExcl>
  );
};

/**
 * @param {{style: React.CSSProperties, field }} param0
 * @returns {React.Component}
 *
 * This is used with the table component!
 */
export const TableSort = ({ field, style }) => {
  const router = useRouter();
  const [sortedField, sortDirection] = router.query.sort
    ? router.query.sort.split(":")
    : ["", ""];

  function setSort() {
    const newSort = `${field}:${sortDirection !== "asc" ? "asc" : "desc"}`;
    router.push(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          sort: newSort,
        },
      },
      undefined,
      { shallow: true }
    );
  }
  return (
    <span
      onClick={setSort}
      style={{
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
    >
      {sortedField === field ? (
        sortDirection === "asc" ? (
          <IoIosArrowDown />
        ) : (
          <IoIosArrowUp />
        )
      ) : (
        <IoIosRemove />
      )}
    </span>
  );
};
