import React, { useEffect, useState } from "react";
import styled, { useTheme } from "styled-components";

import { useQueryClient, useMutation } from "@tanstack/react-query";
import { DateTime } from "luxon";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { GiConfirmed, GiCancel } from "react-icons/gi";
import { SiPinboard } from "react-icons/si";

import agent from "../../utils/agent";
import { useNotification } from "../actionNotification/NotificationProvider";
import PCR from "../PCR";
import useSelectedBrand from "../../utils/hooks/useSelectedBrand";
import { Dropdown } from "../generic";
import TooltipWrapper from "../TooltipWrapper";
import { CgMoreO } from "react-icons/cg";

const NoteBox = styled.div`
  display: flex;
  align-items: stretch;
  gap: 10px;
  padding: 5px;
  border: solid
    ${({ theme, isPinned }) =>
      isPinned ? `2px ${theme.brand}` : `1px ${theme.secondary}`};
  border-radius: 5px;
  position: ${({ isPinned }) => (isPinned ? "sticky" : "relative")};
  background-color: ${({ theme }) => theme.primary};
  z-index: ${({ isPinned }) => isPinned && 2};
  top: 0;
`;

const NoteLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;

  width: 100%;
`;

const NoteRight = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
`;

const NoteRightInner = styled.div`
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
  z-index: 99;
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

export default function NoteInfo({
  userId,
  first_name,
  last_name,
  note,
  updatedAt,
  noteId,
  isPinned,
}) {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const [deleteNoteConfirmation, setDeleteNoteConfirmation] = useState(false);
  const [editNote, setEditNote] = useState({
    state: false,
    note: note,
  });
  const actionNotif = useNotification();

  const [selectedBrand] = useSelectedBrand();

  const deleteNoteMutation = useMutation(
    () => agent().deleteNote(userId, noteId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([selectedBrand, "notes"]);
        actionNotif.WARNING("Note deleted");
      },
      mutationKey: ["deleteNote"],
    }
  );

  const editNoteMutation = useMutation(
    (note) => agent().editNote(userId, noteId, note),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([selectedBrand, "notes"]);
        actionNotif.SUCCESS("Note edited");
      },
      mutationKey: ["editNote"],
    }
  );

  const pinNote = useMutation(
    ({ note, isPinned }) => agent().editNote(userId, noteId, note, isPinned),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([selectedBrand, "notes"]);
        actionNotif.SUCCESS(!isPinned ? "Note pinned" : "Note unpinned");
      },
      mutationKey: ["pinNote"],
    }
  );

  return (
    <>
      <NoteBox isPinned={isPinned}>
        {isPinned && (
          <SiPinboard
            color={theme.brand}
            size={20}
            style={{ alignSelf: "center" }}
          />
        )}
        <NoteLeft>
          <CreatedBy>
            <span>Created By: </span>
            <p>{`${first_name} ${last_name}`}</p>
            <span>Updated At: </span>
            <p>
              {DateTime.fromISO(updatedAt).toFormat("dd/MM/yyyy - HH:mm:ss")}
            </p>
          </CreatedBy>
          {editNote.state ? (
            <NoteInput
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
                  editNoteMutation.mutate(editNote.note);
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
        </NoteLeft>
        <NoteRight>
          {editNote.state ? (
            <>
              <NoteRightInner>
                <p>Confirm: </p>
                <GiConfirmed
                  color={theme.success}
                  onClick={() => {
                    editNoteMutation.mutate(editNote.note);
                    setEditNote((prevState) => ({
                      ...prevState,
                      state: false,
                    }));
                  }}
                />
              </NoteRightInner>
              <NoteRightInner>
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
              </NoteRightInner>
            </>
          ) : (
            <Dropdown
              dropdownComponent={
                <DropdownComponent
                  theme={theme}
                  isPinned={isPinned}
                  onEdit={() =>
                    setEditNote((prevState) => ({
                      ...prevState,
                      state: true,
                    }))
                  }
                  onDelete={() => {
                    setDeleteNoteConfirmation(true);
                  }}
                  onPin={() => {
                    pinNote.mutate({
                      note: note,
                      isPinned: true,
                    });
                  }}
                  onUnpin={() => {
                    pinNote.mutate({
                      note: note,
                      isPinned: false,
                    });
                  }}
                />
              }
            >
              <TooltipWrapper tooltip="More">
                <CgMoreO color={theme.blue} size={16} />
              </TooltipWrapper>
            </Dropdown>
          )}
        </NoteRight>
      </NoteBox>

      {deleteNoteConfirmation && (
        <DeleteNoteModal>
          <DeleteNoteConfirmationContainer>
            <p>Are you sure you want to delete this note?</p>
            <DeleteBtnsContainer>
              <DeleteBtns
                className="yes"
                onClick={() => {
                  deleteNoteMutation.mutate();
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

const DropdownOuter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  background-color: ${({ theme }) => theme.primary};
  padding: 5px;
  border-radius: 5px;
  border: ${({ theme }) => `1px solid ${theme.secondary}`};
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 2px 5px;
  border-radius: 3px;

  &:hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.secondary};
  }
`;

const DropdownComponent = ({
  onDelete,
  onEdit,
  onPin,
  onUnpin,
  theme,
  isPinned,
}) => {
  return (
    <DropdownOuter>
      <PCR.updateNote>
        <Flex onClick={onEdit}>
          <p>Edit: </p>
          <FaRegEdit color={theme.blue} size={15} />
        </Flex>
      </PCR.updateNote>
      {isPinned ? (
        <PCR.updateNote>
          <Flex onClick={onUnpin}>
            <p>Unpin: </p>
            <SiPinboard color={theme.blue} size={15} />
          </Flex>
        </PCR.updateNote>
      ) : (
        <PCR.updateNote>
          <Flex onClick={onPin}>
            <p>Pin: </p>
            <SiPinboard color={theme.blue} size={15} />
          </Flex>
        </PCR.updateNote>
      )}
      <PCR.deleteNote>
        <Flex onClick={onDelete}>
          <p>Delete: </p>
          <MdDeleteForever color={theme.errorMsg} size={16} />
        </Flex>
      </PCR.deleteNote>
    </DropdownOuter>
  );
};
