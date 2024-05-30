import React from "react";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin2Line } from "react-icons/ri";
import { PERMISSIONS_MAP } from "../../config/permissions";
import {
  TableLoader,
  Cell,
  FilterContainer,
  FilterInnerContainer,
  Row,
  TableData,
  TableOuter,
} from "./TableGeneric";
import { ButtonBlue } from "../generic";
import ModalHook from "../ModalHook";
import EditRole from "../modalHookViews/EditRole";
import AddRole from "../modalHookViews/AddRole";
import DeleteRole from "../modalHookViews/DeleteRole";
import { useTheme } from "styled-components";
import { useUserRoles } from "../../utils/hooks/serverHooks";

const CrmUsersPermissionsTable = () => {
  const theme = useTheme();
  const { data, isLoading, isFetching } = useUserRoles();
  if (isLoading || isFetching) return <TableLoader />;

  return (
    <TableOuter>
      <FilterContainer>
        <FilterInnerContainer>
          <ModalHook componentToShow={<AddRole />}>
            {({ openModal }) => (
              <ButtonBlue onClick={openModal}>Add Role</ButtonBlue>
            )}
          </ModalHook>
        </FilterInnerContainer>
      </FilterContainer>
      <TableData>
        <Row header>
          <Cell isNormal>Actions</Cell>
          <Cell isLarge>Role</Cell>
          <Cell>Permissions</Cell>
        </Row>
        {data.roles.map((el, idx) => (
          <Row key={idx}>
            <Cell
              isNormal
              style={{ justifyContent: "flex-start", gap: "10px" }}
            >
              <ModalHook
                componentToShow={
                  <EditRole
                    roleID={el._id}
                    preselectedPermissions={el.permissions}
                    roleName={el.name}
                  />
                }
              >
                {({ openModal }) => (
                  <FaRegEdit
                    onClick={openModal}
                    color={theme.blue}
                    size="16px"
                    style={{ cursor: "pointer" }}
                  />
                )}
              </ModalHook>
              <ModalHook
                componentToShow={
                  <DeleteRole roleID={el._id} roleName={el.name} />
                }
              >
                {({ openModal }) => (
                  <RiDeleteBin2Line
                    onClick={openModal}
                    color={theme.errorMsg}
                    size="16px"
                    style={{ cursor: "pointer" }}
                  />
                )}
              </ModalHook>
            </Cell>
            <Cell isLarge>{el.name}</Cell>
            <Cell
              style={{
                justifyContent: "flex-start",
                gap: "5px",
                flexWrap: "wrap",
              }}
            >
              {el.permissions.map((x, i) => (
                <div key={i}>{PERMISSIONS_MAP[x]}</div>
              ))}
            </Cell>
          </Row>
        ))}
      </TableData>
    </TableOuter>
  );
};

export default CrmUsersPermissionsTable;
