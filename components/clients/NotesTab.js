import React, { useState } from "react";
import styled from "styled-components";
import {
  useQuery,
  useMutation,
  useQueryClient,
  useIsMutating,
} from "@tanstack/react-query";

import { FaCheck } from "react-icons/fa";

import agent from "../../utils/agent";
import NoteInfo from "./NoteInfo";
import { Loader, Refresh } from "../generic";
import { useNotification } from "../actionNotification/NotificationProvider";
import EmptyBoundary from "../EmptyBoundary";
import ErrorBoundary from "../ErrorBoundary";
import PCR from "../PCR";
import { useNotes } from "../../utils/hooks/serverHooks";
import useSelectedBrand from "../../utils/hooks/useSelectedBrand";

const NotesTabWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: calc(100vh - 250px);
`;

const NoteInputContainer = styled.div`
  display: flex;
`;

const NoteSubmit = styled.button`
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

const NoteInput = styled.input`
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

const NoteInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  overflow: auto;
  padding-right: 5px;
`;

export default function NotesTab({ user }) {
  const [newNote, setNewNote] = useState("");
  const queryClient = useQueryClient();

  let deleteIsLoading = useIsMutating("deleteNote");
  let editIsLoading = useIsMutating("editNote");
  const actionNotif = useNotification();

  const { data, isLoading, isFetching, error } = useNotes(user._id, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const [selectedBrand] = useSelectedBrand();

  const createNewNoteMutation = useMutation(
    (note) => agent().createNote(user._id, note),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([selectedBrand, "notes"]);
        actionNotif.SUCCESS("Note created");
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
    <NotesTabWrapper>
      <Refresh
        onClick={() => queryClient.invalidateQueries([selectedBrand, "notes"])}
      />
      <ErrorBoundary hasError={error || createNewNoteMutation.error}>
        <PCR.createNote>
          <NoteInputContainer>
            <NoteInput
              placeholder="Add a note..."
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
            <NoteSubmit
              onClick={() => {
                if (newNote) {
                  createNewNoteMutation.mutate(newNote);
                  setNewNote("");
                }
              }}
            >
              <FaCheck />
            </NoteSubmit>
          </NoteInputContainer>
        </PCR.createNote>
        <NoteInfoContainer>
          <EmptyBoundary
            isEmpty={data.length === 0 || !data}
            message="No Notes yet..."
          >
            {data
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .sort((a, b) => b.isPinned - a.isPinned)
              .map((el, idx) => (
                <NoteInfo
                  key={idx}
                  userId={user._id}
                  first_name={el.created_by?.first_name || "Deleted"}
                  last_name={el.created_by?.last_name || "User"}
                  note={el.note}
                  noteId={el._id}
                  updatedAt={el.updatedAt}
                  isPinned={el.isPinned}
                />
              ))}
          </EmptyBoundary>
        </NoteInfoContainer>
      </ErrorBoundary>
    </NotesTabWrapper>
  );
}
