import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import styled, { useTheme } from "styled-components";

import { FaRegEdit, FaSignInAlt } from "react-icons/fa";
import { RiDeleteBin2Line } from "react-icons/ri";

import agent from "../../utils/agent";
import {
  TableOuter,
  FilterContainer,
  TableData,
  Row,
  Cell,
  FilterInnerContainer,
  SortLink,
  PaginationSettings,
} from "./TableGeneric";
import { Loader, Modal, ButtonBlue } from "../generic";
import { colors } from "../../config/colors";
import CreateCrmUser from "../administration/CreateCrmUser";
import DeleteCrmUser from "../administration/DeleteCrmUser";
import EditCrmUser from "../administration/EditCrmUser";
import ModalHook from "../ModalHook";
import PCR from "../PCR";
import { useRouter } from "next/router";
import { useCrmUsers } from "../../utils/hooks/serverHooks";
import { useDebounce } from "usehooks-ts";
import { searchScore } from "../../utils/helpers";
import CopyCrmUser from "../administration/CopyCrmUser";
import TooltipWrapper from "../TooltipWrapper";
import EditCrmUserWhitelistCountries from "../administration/EditCrmUserWhitelistCountries";

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

const ActionBtn = styled.div`
  color: ${({ theme }) => theme.white};
  border-radius: 5px;
  padding: 3px 10px;
  cursor: pointer;
  background-color: ${({ theme, create }) => create && theme.success};
  background-color: ${({ theme, edit }) => edit && theme.edit};
  background-color: ${({ theme, del }) => del && theme.errorMsg};
  background-color: ${({ theme, copy }) => copy && theme.brand};

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  min-width: 100px;
  opacity: ${({ unchecked }) => unchecked && 0.5};
  transition: 0.3s all ease;
  pointer-events: ${({ unchecked }) => unchecked && "none"};

  & svg {
    color: ${({ theme }) => theme.blue};
  }
`;

const WhitelistCountrySpan = styled.div`
  display: flex;
  gap: 5px;
  overflow: hidden;
  width: 100%;
  height: 100%;
  & span {
    display: inline-block;
    white-space: nowrap;
    background-color: ${({ theme }) => theme.primary};
    padding: 3px 5px;
    border-radius: 5px;
  }
`;

function CrmTable() {
  const theme = useTheme();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data, isLoading, isFetching } = useCrmUsers(
    router.query.page,
    router.query.limit,
    router.query.sort,
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  );
  const [filter, setFilter] = useState("");
  const debouncedFilter = useDebounce(filter, 500);
  const crmUsersToShow = useMemo(() => {
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
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [data, debouncedFilter]);

  const loginAsMut = useMutation({
    mutationFn: (id) => agent().loginAsAnotherCrmUser(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries([]);
      router.push("/");
    },
  });

  return (
    <TableOuter>
      {loginAsMut.isLoading && <Loader />}
      {isLoading || isFetching ? (
        <Loader />
      ) : (
        <>
          <FilterContainer style={{ justifyContent: "space-between" }}>
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

            <PCR.createCrmUser>
              <FilterInnerContainer style={{ justifyContent: "flex-end" }}>
                <PCR.isAdmin>
                  <ModalHook
                    componentToShow={<CopyCrmUser params={router.query} />}
                  >
                    {({ openModal }) => (
                      <ActionBtn onClick={openModal} copy>
                        <FaRegEdit />
                        <p>Copy</p>
                      </ActionBtn>
                    )}
                  </ModalHook>
                </PCR.isAdmin>
                <ModalHook
                  componentToShow={<CreateCrmUser params={router.query} />}
                >
                  {({ openModal }) => (
                    <ActionBtn onClick={openModal} create>
                      <FaRegEdit />
                      <p>Create</p>
                    </ActionBtn>
                  )}
                </ModalHook>
              </FilterInnerContainer>
            </PCR.createCrmUser>
          </FilterContainer>
          <TableData>
            <Row header>
              <Cell>
                First Name
                <SortLink field={"first_name"} limit={router.query.limit} />
              </Cell>
              <Cell>
                Last Name
                <SortLink field={"last_name"} limit={router.query.limit} />
              </Cell>
              <Cell>
                Email
                <SortLink field={"email"} limit={router.query.limit} />
              </Cell>
              <Cell isMedium>
                Department
                <SortLink field={"department"} limit={router.query.limit} />
              </Cell>
              <Cell isMedium>Role</Cell>
              <Cell>Whitelisted Countries</Cell>
              <Cell isNormal>Actions</Cell>
            </Row>
            {crmUsersToShow.map((el, idx) => (
              <Row key={idx} isDisabled={el.suspended}>
                <Cell>{el.first_name}</Cell>
                <Cell>{el.last_name}</Cell>
                <Cell>{el.email}</Cell>
                <Cell
                  isMedium
                  style={{
                    textTransform: "capitalize",
                  }}
                >
                  {el.department}
                </Cell>
                <Cell
                  isMedium
                  style={{
                    textTransform: "capitalize",
                  }}
                >
                  {el.role?.name}
                </Cell>
                <ModalHook
                  componentToShow={<EditCrmUserWhitelistCountries user={el} />}
                >
                  {({ openModal }) => (
                    <Cell actionable onClick={() => openModal()}>
                      <TooltipWrapper tooltip="Edit whitelist">
                        <WhitelistCountrySpan key={el}>
                          {!el.enable_country_whitelist ? (
                            "Disabled"
                          ) : el.whitelist_countries?.length > 0 ? (
                            <>
                              {el.whitelist_countries?.slice(0, 8).map((el) => (
                                <span key={el}>{el}</span>
                              ))}
                              {el.whitelist_countries?.length > 8 && ". . . ."}
                            </>
                          ) : (
                            "None selected"
                          )}
                        </WhitelistCountrySpan>
                      </TooltipWrapper>
                    </Cell>
                  )}
                </ModalHook>
                <Cell
                  isNormal
                  style={{ justifyContent: "flex-start", gap: "10px" }}
                >
                  <PCR.updateCrmUser>
                    <ModalHook
                      componentToShow={
                        <EditCrmUser user={el} params={router.query} />
                      }
                    >
                      {({ openModal }) => (
                        <FaRegEdit
                          onClick={openModal}
                          color={theme.blue}
                          size={15}
                        />
                      )}
                    </ModalHook>
                  </PCR.updateCrmUser>
                  <PCR.deleteCrmUser>
                    <ModalHook
                      componentToShow={
                        <DeleteCrmUser user={el} params={router.query} />
                      }
                    >
                      {({ openModal }) => (
                        <RiDeleteBin2Line
                          onClick={openModal}
                          color={theme.errorMsg}
                          size={15}
                        />
                      )}
                    </ModalHook>
                  </PCR.deleteCrmUser>
                  <PCR.isAdmin>
                    {el?.role?.name !== "admin" && (
                      <TooltipWrapper tooltip={`Login as ${el.first_name}`}>
                        <FaSignInAlt
                          onClick={() => loginAsMut.mutate(el._id)}
                        />
                      </TooltipWrapper>
                    )}
                  </PCR.isAdmin>
                </Cell>
              </Row>
            ))}
          </TableData>
          <PaginationSettings params={router.query} data={data} />
        </>
      )}
    </TableOuter>
  );
}

export default CrmTable;
