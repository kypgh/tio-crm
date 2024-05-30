import React, { useEffect, useState } from "react";
import styled, { useTheme } from "styled-components";

import { useQueryClient, useMutation } from "@tanstack/react-query";
import { DateTime } from "luxon";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { GiConfirmed, GiCancel } from "react-icons/gi";

import { colors } from "../../config/colors";
import agent from "../../utils/agent";
import { useNotification } from "../actionNotification/NotificationProvider";
import PCR from "../PCR";
import useSelectedBrand from "../../utils/hooks/useSelectedBrand";

const FinancialNoteBox = styled.div`
  display: flex;
  align-items: stretch;
  gap: 10px;
  padding: 5px;
  border: 1px solid ${({ theme }) => theme.secondary};
  border-radius: 5px;
`;

const FinancialNoteLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;

  width: 100%;
`;

const FinancialNoteRight = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  max-width: 80px;
  width: 100%;
`;

const FinancialNoteRightInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 5px;
  color: ${({ theme }) => theme.white};
  font-size: 14px;

  & svg {
    /* color: ${({ theme }) => theme.blue}; */
    cursor: pointer;
    font-size: 20px;
  }
`;

const CreatedBy = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: ${({ theme }) => theme.textSecondary};
  font-size: 12px;

  & p {
    color: ${({ theme }) => theme.white};
  }
`;

const Note = styled.div`
  color: ${({ theme }) => theme.white};
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

const DeleteNoteModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.8);
`;

const DeleteNoteConfirmationContainer = styled.div`
  max-width: 500px;
  width: 100%;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
  border-radius: 5px;
  background-color: ${({ theme }) => theme.secondary};
  color: ${({ theme }) => theme.white};
  padding: 20px 10px;
`;

const DeleteBtnsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  max-width: 100%;
  width: 100%;
`;

const DeleteBtns = styled.div`
  max-width: 100px;
  width: 100%;
  padding: 10px;
  text-align: center;
  color: ${({ theme }) => theme.white};
  border-radius: 5px;
  cursor: pointer;
  background-color: ${({ theme }) => theme.primary};

  &.yes {
    background-color: ${({ theme }) => theme.errorMsg};
  }
`;

export default function FinancialNoteInfo({
  userId,
  first_name,
  last_name,
  note,
  updatedAt,
  noteId,
}) {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const actionNotification = useNotification();
  const [deleteNoteConfirmation, setDeleteNoteConfirmation] = useState(false);
  const [editNote, setEditNote] = useState({
    state: false,
    note: note,
  });

  const [selectedBrand] = useSelectedBrand();

  const deleteFinancialNoteMutation = useMutation(
    () => agent().deleteFinancialNote(userId, noteId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([
          selectedBrand,
          "financialNotes",
          userId,
        ]);
        actionNotification.WARNING("Financial Note deleted successfully");
      },
      mutationKey: ["deleteFinancialNote"],
    }
  );

  const editFinancialNoteMutation = useMutation(
    (note) => agent().editFinancialNote(userId, noteId, note),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([
          selectedBrand,
          "financialNotes",
          userId,
        ]);
        actionNotification.SUCCESS("Financial Note edited successfully");
      },
      mutationKey: ["editFinancialNote"],
    }
  );

  return (
    <>
      <FinancialNoteBox>
        <FinancialNoteLeft>
          <CreatedBy>
            <span>Created By: </span>
            <p>{`${first_name} ${last_name}`}</p>
            <span>Updated At: </span>
            <p>
              {DateTime.fromISO(updatedAt).toFormat("dd/MM/yyyy - HH:mm:ss")}
            </p>
          </CreatedBy>
          {editNote.state ? (
            <FinancialNoteInput
              placeholder="Update note..."
              value={editNote.note}
              onChange={(e) =>
                setEditNote((prevState) => ({
                  ...prevState,
                  note: e.target.value,
                }))
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  editFinancialNoteMutation.mutate(editNote.note);
                  setEditNote((prevState) => ({
                    ...prevState,
                    state: false,
                  }));
                }
              }}
            />
          ) : (
            <Note>{editNote.note}</Note>
          )}
        </FinancialNoteLeft>
        <FinancialNoteRight>
          <FinancialNoteRightInner>
            {editNote.state ? (
              <>
                <p>Confirm: </p>
                <GiConfirmed
                  color={theme.success}
                  onClick={() => {
                    editFinancialNoteMutation.mutate(editNote.note);
                    setEditNote((prevState) => ({
                      ...prevState,
                      state: false,
                    }));
                  }}
                />
              </>
            ) : (
              <PCR.updateFinancialNote>
                <p>Edit: </p>
                <FaRegEdit
                  color={theme.blue}
                  onClick={() =>
                    setEditNote((prevState) => ({
                      ...prevState,
                      state: true,
                    }))
                  }
                />
              </PCR.updateFinancialNote>
            )}
          </FinancialNoteRightInner>
          <FinancialNoteRightInner>
            {editNote.state ? (
              <>
                <p>Cancel: </p>
                <GiCancel
                  color={theme.errorMsg}
                  onClick={() =>
                    setEditNote((prevState) => ({
                      ...prevState,
                      state: false,
                    }))
                  }
                />
              </>
            ) : (
              <PCR.deleteFinancialNote>
                <p>Delete: </p>
                <MdDeleteForever
                  color={theme.errorMsg}
                  onClick={() => {
                    setDeleteNoteConfirmation(true);
                  }}
                />
              </PCR.deleteFinancialNote>
            )}
          </FinancialNoteRightInner>
        </FinancialNoteRight>
      </FinancialNoteBox>

      {deleteNoteConfirmation && (
        <DeleteNoteModal>
          <DeleteNoteConfirmationContainer>
            <p>Are you sure you want to delete this note?</p>
            <DeleteBtnsContainer>
              <DeleteBtns
                className="yes"
                onClick={() => {
                  deleteFinancialNoteMutation.mutate();
                  setDeleteNoteConfirmation(false);
                }}
              >
                Yes
              </DeleteBtns>
              <DeleteBtns
                onClick={() => {
                  setDeleteNoteConfirmation(false);
                }}
              >
                No
              </DeleteBtns>
            </DeleteBtnsContainer>
          </DeleteNoteConfirmationContainer>
        </DeleteNoteModal>
      )}
    </>
  );
}
