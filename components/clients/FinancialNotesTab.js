import React, { useState } from "react";
import styled from "styled-components";
import {
  useQuery,
  useMutation,
  useQueryClient,
  useIsMutating,
  MutationObserver,
} from "@tanstack/react-query";

import { FaCheck } from "react-icons/fa";
import { TiRefresh } from "react-icons/ti";

import { colors } from "../../config/colors";
import agent from "../../utils/agent";
import { Loader, Refresh } from "../generic";
import FinancialNoteInfo from "./FinancialNoteInfo";
import EmptyBoundary from "../EmptyBoundary";
import ErrorBoundary from "../ErrorBoundary";
import { useNotification } from "../actionNotification/NotificationProvider";
import PCR from "../PCR";
import { useFinancialNotes } from "../../utils/hooks/serverHooks";
import useSelectedBrand from "../../utils/hooks/useSelectedBrand";

const FinancialNotesTabWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: calc(100vh - 250px);
`;

const FinancialNoteInputContainer = styled.div`
  display: flex;
`;

const FinancialNoteSubmit = styled.button`
  background-color: ${({ theme }) => theme.blue};
  border: none;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  color: ${({ theme }) => theme.white};
  font-size: 1rem;
  max-width: 40px;
  width: 100%;
  transition: 0.3s all ease;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  /* &:hover {
    background-color: ${({ theme }) => theme.secondary};
  } */
  & svg {
    color: ${({ theme }) => theme.white};
    font-size: 16px;
  }
`;

const FinancialNoteInput = styled.input`
  background-color: ${({ theme }) => theme.secondary};
  border: none;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  color: ${({ theme }) => theme.white};
  padding: 10px;
  width: 100%;
  transition: 0.3s all ease;
  &:focus-visible {
    outline: none;
  }
`;

const FinancialNoteInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  overflow: auto;
`;

export default function FinancialNotesTab({ user }) {
  const [newNote, setNewNote] = useState("");
  const queryClient = useQueryClient();
  const actionNotification = useNotification();

  let deleteIsLoading = useIsMutating(["deleteFinancialNote"]);
  let editIsLoading = useIsMutating(["editFinancialNote"]);

  const [selectedBrand] = useSelectedBrand();

  const { data, isLoading, isFetching, error } = useFinancialNotes(user._id, {
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
  const createNewNoteMutation = useMutation(
    (note) => agent().createFinancialNote(user._id, note),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([
          selectedBrand,
          "financialNotes",
          user._id,
        ]);
        actionNotification.SUCCESS("Financial Note created successfully");
      },
    }
  );

  if (
    isLoading ||
    isFetching ||
    deleteIsLoading ||
    editIsLoading ||
    createNewNoteMutation.isLoading
  )
    return <Loader />;

  return (
    <FinancialNotesTabWrapper>
      <Refresh
        onClick={() =>
          queryClient.invalidateQueries([
            selectedBrand,
            "financialNotes",
            user._id,
          ])
        }
      />
      <ErrorBoundary hasError={error}>
        <PCR.createFinancialNote>
          <FinancialNoteInputContainer>
            <FinancialNoteInput
              placeholder="Add a financial note..."
              onChange={(e) => setNewNote(e.target.value)}
              value={newNote}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (newNote) {
                    createNewNoteMutation.mutate(newNote);
                    setNewNote("");
                  }
                }
              }}
            />
            <FinancialNoteSubmit
              onClick={() => {
                if (newNote) {
                  createNewNoteMutation.mutate(newNote);
                  setNewNote("");
                }
              }}
            >
              <FaCheck />
            </FinancialNoteSubmit>
          </FinancialNoteInputContainer>
        </PCR.createFinancialNote>
        <FinancialNoteInfoContainer>
          <EmptyBoundary
            isEmpty={data.length === 0 || !data}
            message="No Financial Notes yet..."
          >
            {data?.docs
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((el, idx) => (
                <FinancialNoteInfo
                  key={idx}
                  userId={user._id}
                  first_name={el.created_by?.first_name || "Deleted"}
                  last_name={el.created_by?.last_name || "User"}
                  note={el.note}
                  noteId={el._id}
                  updatedAt={el.updatedAt}
                />
              ))}
          </EmptyBoundary>
        </FinancialNoteInfoContainer>
      </ErrorBoundary>
    </FinancialNotesTabWrapper>
  );
}
