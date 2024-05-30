import React, { useState, useEffect } from "react";
import styled, { useTheme } from "styled-components";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { DateTime } from "luxon";
import { AiFillFolder, AiFillFolderOpen } from "react-icons/ai";

import agent from "../../utils/agent";
import { ActionButton, BtnGeneric, Loader, Refresh } from "../generic";
import ErrorBoundary from "../ErrorBoundary";
import { useNotification } from "../actionNotification/NotificationProvider";
import ConfirmationModal from "../ConfirmationModal";
import ModalHook from "../ModalHook";
import ViewDocument from "../ViewDocument";
import UploadDocuments from "../modalHookViews/UploadDocuments";
import PCR, { usePermissions } from "../PCR";
import { PERMISSIONS } from "../../config/permissions";
import AnimateHeight from "react-animate-height";
import {
  FaCheck,
  FaCheckCircle,
  FaEllipsisH,
  FaFile,
  FaTimes,
  FaTimesCircle,
  FaTrash,
} from "react-icons/fa";
import { useClientKycDocuments } from "../../utils/hooks/serverHooks";
import useSelectedBrand from "../../utils/hooks/useSelectedBrand";
import { ButtonContainer } from "../formComponents/FormGeneric";

const DocumentsOuter = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const DocumentRow = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 5px;
  color: ${({ theme }) => theme.white};
  text-transform: capitalize;
`;

const ViewDoc = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  color: ${({ theme }) => theme.textSecondary};

  &:hover p {
    text-decoration: underline;
  }

  & span {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;

  & svg {
    cursor: pointer;
  }

  & svg.unavailable {
    filter: grayscale(1);
    pointer-events: none;
  }
`;

const StatusSc = styled.div`
  color: ${({ theme, isSuccess }) =>
    isSuccess ? theme.success : theme.errorMsg};
`;

const ScrollContainer = styled.div`
  /* overflow: auto;
  height: calc(100% - 80px); */
  overflow-y: scroll;
  height: 520px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;

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

const Folder = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const InnerRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  /* gap: 10px; */
  flex-direction: column;
  padding: 10px;

  & ${ViewDoc} {
    margin-left: 20px;
  }

  & svg {
    cursor: pointer;
  }
`;

const InnerDoc = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-bottom: 5px;
  padding-top: 5px;
  border-bottom: 1px solid ${({ theme }) => theme.secondary};
  &:hover {
    background-color: ${({ theme }) => theme.secondary};
  }
`;

const InfoLeft = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 5px;
`;

const DocumentsCategoryContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 15px;
  background-color: ${({ theme }) => theme.secondary};
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
`;

const NoFiles = styled.div`
  color: ${({ theme }) => theme.textSecondary};
`;

const KycActionContainer = styled.div`
  padding: 10px 20px;
  color: ${({ theme }) => theme.white};
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid ${({ theme }) => theme.secondary};
  border-top: 1px solid ${({ theme }) => theme.secondary};
`;

const statusIcons = (theme) => ({
  pending: (
    <FaEllipsisH color={theme.textSecondary} style={{ cursor: "default" }} />
  ),
  approved: (
    <FaCheckCircle color={theme.success} style={{ cursor: "default" }} />
  ),
  rejected: (
    <FaTimesCircle color={theme.errorMsg} style={{ cursor: "default" }} />
  ),
});

/**
 *
 * @param {import("styled-components").DefaultTheme} theme
 * @param {string} status
 * @returns
 */
const kycStatusIcon = (theme, status) =>
  ({
    approved: (
      <>
        <FaCheckCircle color={theme.success} style={{ cursor: "default" }} />
        <p>Approved</p>
      </>
    ),
    pending: (
      <>
        <FaEllipsisH color={theme.pendingColor} style={{ cursor: "default" }} />
        Pending
      </>
    ),
    rejected: (
      <>
        <FaTimesCircle color={theme.errorMsg} style={{ cursor: "default" }} />
        Rejected
      </>
    ),
    missingDocuments: (
      <>
        <FaEllipsisH color={theme.pendingColor} style={{ cursor: "default" }} />
        Waiting For Documents
      </>
    ),
  }[status] || status);

export default function DocumentsTab({ user }) {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const actionNotification = useNotification();

  const [formattedDocuments, setFormattedDocuments] = useState([]);
  const docsMapping = {
    id_document: "id_document",
    id_document_history: "id_document",
    proof_of_address: "proof_of_address",
    proof_of_address_history: "proof_of_address",
    compliance: "compliance",
    other: "other",
    translations: "translations",
    funding: "funding",
  };

  const [openedCategories, setOpenedCategories] = useState([0, 1]);
  const [hasDocuments, setHasDocuments] = useState(false);

  const [selectedBrand] = useSelectedBrand();

  const { isLoading, error, data, isFetching } = useClientKycDocuments(
    user._id,
    {
      onSuccess: (data) => {
        const formatted = {
          id_document: [],
          proof_of_address: [],
          compliance: [],
          other: [],
          translations: [],
          funding: [],
        };
        data.forEach((doc) => {
          if (!formatted[docsMapping[doc.document_type]]) {
            formatted[docsMapping[doc.document_type]] = [];
          }
          formatted[docsMapping[doc.document_type]].push(doc);
        });
        //check if object is empty
        if (Object.keys(formatted).length > 0) {
          setFormattedDocuments(formatted);
          setHasDocuments(true);
        }
      },
      refetchOnMount: true,
    }
  );

  const acceptDocument = useMutation(
    (documentID) => agent().acceptUserDocument(documentID),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([selectedBrand, "clientDocuments"]);
        queryClient.invalidateQueries([selectedBrand, "clientKycDocuments"]);
        queryClient.invalidateQueries([selectedBrand, "client", user._id]);
        actionNotification.SUCCESS("Document accepted");
      },
      onError: () => {
        actionNotification.ERROR("Something went wrong");
      },
      mutationKey: ["acceptDocument"],
    }
  );

  const rejectDocument = useMutation(
    (documentID) => agent().rejectUserDocument(documentID),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([selectedBrand, "clientDocuments"]);
        queryClient.invalidateQueries([selectedBrand, "client", user._id]);
        queryClient.invalidateQueries([selectedBrand, "clientKycDocuments"]);
        actionNotification.WARNING("Document rejected");
      },
      onError: () => {
        actionNotification.ERROR("Something went wrong");
      },
      mutationKey: ["rejectDocument"],
    }
  );

  const pendingChangeDocument = useMutation(
    (documentID) => agent().pendingChangeUserDocument(documentID),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([selectedBrand, "clientDocuments"]);
        queryClient.invalidateQueries([selectedBrand, "client", user._id]);
        queryClient.invalidateQueries([selectedBrand, "clientKycDocuments"]);
        actionNotification.WARNING("Document set to pending confirmation");
      },
      onError: (err) => {
        actionNotification.ERROR(err.response.data.message);
      },
      mutationKey: ["pendingChangeDocument"],
    }
  );

  const deleteDocument = useMutation(
    (documentID) => agent().deleteDocument(documentID),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([selectedBrand, "clientDocuments"]);
        queryClient.invalidateQueries([selectedBrand, "client", user._id]);
        queryClient.invalidateQueries([selectedBrand, "clientKycDocuments"]);
        actionNotification.WARNING("Document deleted");
      },
      onError: () => {
        actionNotification.ERROR("Something went wrong");
      },
      mutationKey: ["deleteDocument"],
    }
  );

  const { isAllowed: isAllowedDocsPerId } = usePermissions([
    PERMISSIONS.DOCUMENTS.view_document_per_id.value,
  ]);
  const { isAllowed: isAllowedUpdateDoc } = usePermissions([
    PERMISSIONS.DOCUMENTS.update_document.value,
  ]);

  const updateKYC = useMutation(
    ({ status }) => agent().setKycStatus(user._id, status),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([selectedBrand, "client"]);
      },
    }
  );

  if (
    !data ||
    isLoading ||
    isFetching ||
    acceptDocument.isLoading ||
    rejectDocument.isLoading ||
    deleteDocument.isLoading
  ) {
    return <Loader />;
  }
  return (
    <DocumentsOuter>
      <Refresh
        onClick={() =>
          queryClient.invalidateQueries([selectedBrand, "clientKycDocuments"])
        }
      />
      <PCR.forceChangeKycStatus>
        <KycActionContainer>
          <p>KYC Actions:</p>
          <ButtonContainer>
            {user?.flags?.kycStatus !== "rejected" && (
              <BtnGeneric
                isLoading={updateKYC.isLoading}
                endsWith={<FaTimes color={theme.errorMsg} />}
                onClick={() => {
                  updateKYC.mutate({
                    status: "rejected",
                  });
                }}
              >
                Reject
              </BtnGeneric>
            )}
            {user?.flags?.kycStatus !== "missingDocuments" && (
              <BtnGeneric
                isLoading={updateKYC.isLoading}
                endsWith={<FaFile color={theme.blue} />}
                onClick={() => {
                  updateKYC.mutate({
                    status: "missingDocuments",
                  });
                }}
              >
                Wait for documents
              </BtnGeneric>
            )}
            {user?.flags?.kycStatus !== "approved" && (
              <BtnGeneric
                isLoading={updateKYC.isLoading}
                endsWith={<FaCheck color={theme.success} />}
                onClick={() => {
                  updateKYC.mutate({
                    status: "approved",
                  });
                }}
              >
                Approve
              </BtnGeneric>
            )}
          </ButtonContainer>
          <p>Current status:</p>
          {kycStatusIcon(theme, user.flags?.kycStatus)}
        </KycActionContainer>
      </PCR.forceChangeKycStatus>
      <ErrorBoundary hasError={error} errorMessage={"Something went wrong."}>
        <ScrollContainer>
          {Object.keys(formattedDocuments).map((docType, i) => (
            <DocumentRow key={i}>
              <DocumentsCategoryContainer
                onClick={() =>
                  setOpenedCategories(
                    openedCategories.includes(i)
                      ? openedCategories.filter((x) => x !== i)
                      : [...openedCategories, i]
                  )
                }
              >
                <Folder>
                  {openedCategories.includes(i) ? (
                    <AiFillFolderOpen />
                  ) : (
                    <AiFillFolder />
                  )}
                  <p>{docType.replaceAll("_", " ")}</p>
                  <small style={{ color: theme.textSecondary }}>
                    ({formattedDocuments[docType]?.length || 0} files)
                  </small>
                </Folder>
                <PCR.uploadUserDocuments>
                  <ModalHook
                    componentToShow={
                      <UploadDocuments document={docType} userId={user._id} />
                    }
                  >
                    {({ openModal }) => (
                      <ActionButton
                        style={{ width: "15%" }}
                        onClick={(ev) => {
                          ev.stopPropagation();
                          openModal();
                        }}
                      >
                        Upload
                      </ActionButton>
                    )}
                  </ModalHook>
                </PCR.uploadUserDocuments>
              </DocumentsCategoryContainer>

              <AnimateHeight
                duration={500}
                height={openedCategories.includes(i) ? "auto" : 0}
              >
                <InnerRow>
                  {formattedDocuments[docType]?.length === 0 ? (
                    <NoFiles>- Empty folder -</NoFiles>
                  ) : (
                    formattedDocuments[docType]
                      ?.sort(
                        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                      )
                      .map((el, idx) => (
                        <InnerDoc key={idx}>
                          <InfoLeft>
                            <ModalHook
                              componentToShow={
                                <ViewDocument documentID={el._id} />
                              }
                            >
                              {({ openModal }) => (
                                <ViewDoc
                                  onClick={() =>
                                    isAllowedDocsPerId && openModal()
                                  }
                                >
                                  <p>
                                    {DateTime.fromISO(el.createdAt).toFormat(
                                      "dd /MM / yyyy - HH:mm"
                                    )}
                                  </p>
                                  <span>
                                    <FaFile color={theme.blue} />
                                  </span>
                                </ViewDoc>
                              )}
                            </ModalHook>

                            <PCR.deleteDocument>
                              <ConfirmationModal message="Are you sure you want to delete this document?">
                                {(confirm) => (
                                  <FaTrash
                                    color={theme.errorMsg}
                                    size={16}
                                    onClick={confirm(() =>
                                      deleteDocument.mutate(el._id)
                                    )}
                                  />
                                )}
                              </ConfirmationModal>
                            </PCR.deleteDocument>
                            {typeof statusIcons === "function" &&
                              statusIcons(theme)[el.status]}
                          </InfoLeft>
                          <PCR.updateDocument>
                            {el.status !== "na" && (
                              <ButtonsContainer>
                                <ConfirmationModal message="Are you sure you want to Approve this document?">
                                  {(confirm) => (
                                    <ActionButton
                                      onClick={confirm(() =>
                                        acceptDocument.mutate(el._id)
                                      )}
                                      inactive={el.status === "approved"}
                                    >
                                      Approve
                                    </ActionButton>
                                  )}
                                </ConfirmationModal>
                                <ConfirmationModal message="Are you sure you want to Reject this document?">
                                  {(confirm) =>
                                    el.status !== "approved" && (
                                      <ActionButton
                                        inactive={el.status === "rejected"}
                                        onClick={confirm(() =>
                                          rejectDocument.mutate(el._id)
                                        )}
                                      >
                                        Reject
                                      </ActionButton>
                                    )
                                  }
                                </ConfirmationModal>
                                <ConfirmationModal message="Are you sure you want to set this to Pending?">
                                  {(confirm) =>
                                    el.status !== "approved" && (
                                      <ActionButton
                                        inactive={
                                          el.status === "pendingChanges"
                                        }
                                        onClick={confirm(() =>
                                          pendingChangeDocument.mutate(el._id)
                                        )}
                                      >
                                        Pending
                                      </ActionButton>
                                    )
                                  }
                                </ConfirmationModal>
                              </ButtonsContainer>
                            )}
                          </PCR.updateDocument>
                        </InnerDoc>
                      ))
                  )}
                </InnerRow>
              </AnimateHeight>
            </DocumentRow>
          ))}
        </ScrollContainer>
      </ErrorBoundary>
    </DocumentsOuter>
  );
}
