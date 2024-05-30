import { useMutation, useQueryClient } from "@tanstack/react-query";
import styled from "styled-components";

import { FcDocument } from "react-icons/fc";

import agent from "../../utils/agent";
import ViewDocument from "../ViewDocument";
import { useNotification } from "../actionNotification/NotificationProvider";
import { ActionButton } from "../generic";
import {
  FilterContainer,
  FilterInnerContainer,
  PaginationSettings,
} from "./TableGeneric";

import { DateTime } from "luxon";
import { useRouter } from "next/router";
import availableFields from "../../config/tablesAvailableFields";
import useSelectedBrand from "../../utils/hooks/useSelectedBrand";
import useTabledQuery from "../../utils/hooks/useTabledQuery";
import ModalHook, { ConfirmationModal } from "../ModalHook";
import GridTable from "./GridTable";
import RefreshButton from "./RefreshButton";

const ActionBtnContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 15px;
  font-size: 18px;

  & svg {
    cursor: pointer;
  }
`;

function DocumentsTable({ status }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const actionNotification = useNotification();

  const [selectedBrand] = useSelectedBrand();

  const {
    data: newData,
    isLoading,
    isFetching,
    selectedFields,
    tableRows,
    reorderFields,
    resizeFields,
    refetch,
  } = useTabledQuery(
    ["clientDocuments", router.query],
    async (params) => {
      return agent()
        .getAllClientsDocuments({ ...params, status })
        .then((res) => res.data);
    },
    {
      availableFields: availableFields.DOCUMENTS,
      fieldFunctionality: {
        readableId: {
          onClick: (v, el) => {
            return router.push(`/clients/${el.user._id}/documents`);
          },
        },
        updatedAt: {
          format: (v) => DateTime.fromISO(v).toFormat("dd/MM/yyyy | HH:mm"),
        },
        document_type: {
          format: (v) => v.replace(/_/g, " "),
        },
        _id: {
          format: (v) => {
            return (
              <ModalHook componentToShow={<ViewDocument />}>
                {({ openModal }) => (
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      height: "100%",
                    }}
                    onClick={() => {
                      openModal(v);
                    }}
                  >
                    View Document
                    <FcDocument
                      style={{
                        marginLeft: "5px",
                      }}
                    />
                  </span>
                )}
              </ModalHook>
            );
          },
        },
        actions: {
          format: (v, el) => (
            <ActionBtnContainer>
              <ModalHook
                componentToShow={
                  <ConfirmationModal
                    message={"Are you sure want to approve this document?"}
                    onConfirm={(data) => {
                      return acceptDocument.mutate(data._id);
                    }}
                  />
                }
              >
                {({ openModal }) => (
                  <ActionButton invert onClick={() => openModal(el)}>
                    Approve
                  </ActionButton>
                )}
              </ModalHook>
              <ModalHook
                componentToShow={
                  <ConfirmationModal
                    message={"Are you sure want to reject this document?"}
                    onConfirm={(data) => {
                      return rejectDocument.mutate(data._id);
                    }}
                  />
                }
              >
                {({ openModal }) => (
                  <ActionButton invert onClick={() => openModal(el)}>
                    Reject
                  </ActionButton>
                )}
              </ModalHook>
              {status !== "pendingChanges" && (
                <ModalHook
                  componentToShow={
                    <ConfirmationModal
                      message={
                        "Are you sure want to set this document to pending?"
                      }
                      onConfirm={(data) => {
                        return pendingChangeDocument.mutate(data._id);
                      }}
                    />
                  }
                >
                  {({ openModal }) => (
                    <ActionButton invert onClick={() => openModal(el)}>
                      Pending
                    </ActionButton>
                  )}
                </ModalHook>
              )}
            </ActionBtnContainer>
          ),
        },
      },
    }
  );

  const acceptDocument = useMutation(
    (documentID) => agent().acceptUserDocument(documentID),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([selectedBrand, "clientDocuments"]);
        queryClient.invalidateQueries([selectedBrand, "document"]);
        actionNotification.SUCCESS("Document accepted");
      },
      onError: (err) => {
        actionNotification.ERROR(err.response.data.message);
      },
      mutationKey: ["acceptDocument"],
    }
  );

  const rejectDocument = useMutation(
    (documentID) => agent().rejectUserDocument(documentID),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([selectedBrand, "clientDocuments"]);
        queryClient.invalidateQueries([selectedBrand, "document"]);
        actionNotification.WARNING("Document rejected");
      },
      onError: (err) => {
        actionNotification.ERROR(err.response.data.message);
      },
      mutationKey: ["rejectDocument"],
    }
  );
  const pendingChangeDocument = useMutation(
    (documentID) => agent().pendingChangeUserDocument(documentID),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([selectedBrand, "clientDocuments"]);
        queryClient.invalidateQueries([selectedBrand, "document"]);
        actionNotification.WARNING("Document set to pending confirmation");
      },
      onError: (err) => {
        actionNotification.ERROR(err.response.data.message);
      },
      mutationKey: ["pendingChangeDocument"],
    }
  );

  return (
    <div>
      <FilterContainer style={{ justifyContent: "space-between" }}>
        <FilterInnerContainer style={{ alignItems: "stretch" }}>
          <RefreshButton
            onClick={() =>
              refetch().then(() => {
                actionNotification.SUCCESS("Table Refreshed");
              })
            }
            isLoading={isLoading || isFetching}
          />
        </FilterInnerContainer>
      </FilterContainer>
      <GridTable
        isLoading={isLoading || isFetching}
        headers={selectedFields}
        onReorder={reorderFields}
        onResize={resizeFields}
        minusHeight={260}
      >
        {({ Row, Cell }) =>
          tableRows.map((row, idx) => (
            <Row key={idx}>
              {row.fields.map((field) => (
                <Cell
                  actionable={["user.readableId", "_id"].includes(field.key)}
                  key={field.key}
                  onClick={field.onClick}
                  style={{
                    textTransform: ["document_type", "status"].includes(
                      field.key
                    )
                      ? "capitalize"
                      : "none",
                    cursor: ["user.readableId", "_id"].includes(field.key)
                      ? "pointer"
                      : "default",
                  }}
                >
                  {field.value}
                </Cell>
              ))}
            </Row>
          ))
        }
      </GridTable>
      <PaginationSettings data={newData || {}} />
    </div>
  );
}

export default DocumentsTable;
