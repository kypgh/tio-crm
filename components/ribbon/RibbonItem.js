import { useState } from "react";
import styled from "styled-components";

import { IoMdClose } from "react-icons/io";

import {
  Checkbox,
  ColorPicker,
  InputField,
  Label,
} from "../formComponents/FormGeneric";
import { colors } from "../../config/colors";
import { ActionButton, BetterSwitch } from "../generic";
import useUser from "../../utils/hooks/useUser";
import { FaCheck, FaSave, FaTimes } from "react-icons/fa";
import PreviewRibbon from "./PreviewRibbon";
import PCR from "../PCR";

const FieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-direction: ${({ row }) => row && "row"};
  align-items: ${({ row }) => row && "center"};
  gap: 5px;
  width: 100%;
  background-color: ${({ theme }) => theme.primary};
  padding: 10px;
`;

const PreviewContainer = styled.div`
  padding: 10px;
  grid-column: 3;
  grid-row: 2 / span 3;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr;
  gap: 10px;
`;

const PreviewTypography = styled.h4`
  font-size: large;
  font-weight: 400;
  color: ${({ theme }) => theme.textPrimary};
`;

const CusLabel = styled.label`
  color: ${({ theme }) => theme.textPrimary};
  cursor: pointer;
`;

const RibbonItemOuter = styled.div`
  border: 5px solid ${({ theme }) => theme.secondary};
  padding: 5px;
  border-radius: 5px;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 5px;
  position: relative;
  background-color: ${({ theme }) => theme.primary};
`;

const ActionButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  & > :not(:last-child) {
    margin-right: 5px;
  }
  & .unsaved {
    color: ${({ theme }) => theme.brand};
    animation: pulse 1s infinite;
  }
  @keyframes pulse {
    0% {
      transform: scale(0.97);
    }
    50% {
      transform: scale(1.03);
    }
    100% {
      transform: scale(0.97);
    }
  }
`;

const ReadOnly = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  transition: 0.3s all ease;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background-color: #000000ab;
  }
  &:hover::after {
    content: "View Segment";
    color: ${({ theme }) => theme.blue};
    font-weight: 700;
  }
`;

const ActiveRibbon = styled.div`
  color: ${({ theme }) => theme.success};
  display: flex;
  align-items: center;
  grid-column: 1 / span 3;
  margin-left: 10px;
  & > :not(:last-child) {
    margin-right: 5px;
  }
`;

const RibbonItem = ({
  ribbon = {
    title: "",
    url: "",
    accountId: "",
    color: "#000000",
    enabled: true,
    closable: true,
  },
  active = false,
  readOnly = false,
  onDelete,
  onSave,
  navigateToSegment,
}) => {
  const [title, setTitle] = useState(ribbon.title);
  const [url, setUrl] = useState(ribbon.url);
  const [accountId, setAccountId] = useState(ribbon.accountId);
  const [color, setColor] = useState(ribbon.color);
  const [enabled, setEnabled] = useState(ribbon.enabled);
  const [closable, setClosable] = useState(ribbon.closable);
  const unSaved =
    ribbon.type === "new" ||
    title !== ribbon.title ||
    url !== ribbon.url ||
    accountId !== ribbon.accountId ||
    color !== ribbon.color ||
    enabled !== ribbon.enabled ||
    closable !== ribbon.closable;
  return (
    <RibbonItemOuter>
      <ActiveRibbon>
        {active && (
          <>
            <p>User&apos;s current active Ribbon</p>
            <FaCheck />
          </>
        )}
      </ActiveRibbon>
      {readOnly && (
        <ReadOnly onClick={() => navigateToSegment(ribbon.segment)} />
      )}
      <FieldContainer>
        <Label>Ribbon Title</Label>
        <InputField
          invert
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </FieldContainer>
      <FieldContainer>
        <Label>Link</Label>
        <InputField
          invert
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </FieldContainer>
      <PreviewContainer>
        <PreviewTypography>Preview</PreviewTypography>
        <PreviewRibbon ribbon={{ ...ribbon, title, url, color, closable }} />
      </PreviewContainer>
      <FieldContainer row>
        <Label>Color</Label>
        <ColorPicker
          invert
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
      </FieldContainer>
      <FieldContainer row>
        <CusLabel htmlFor={`closeable-${ribbon._id}`}>Closable</CusLabel>
        <Checkbox
          invert
          id={`closeable-${ribbon._id}`}
          checked={closable}
          onChange={(e) => setClosable(e.target.checked)}
        />
      </FieldContainer>

      <FieldContainer row>
        <BetterSwitch
          label="Enabled"
          id={`enabled-${ribbon._id}`}
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
        />
      </FieldContainer>

      <PCR.updateRibbon>
        <ActionButtonsContainer>
          {!readOnly && unSaved && (
            <ActionButton
              className={unSaved ? "unsaved" : undefined}
              onClick={() =>
                onSave({
                  ...ribbon,
                  title,
                  url,
                  color,
                  enabled,
                  closable,
                  isExternal: false,
                })
              }
            >
              <p>Save</p>
              <FaSave size={20} />
            </ActionButton>
          )}

          {!readOnly && unSaved && (
            <ActionButton
              onClick={() => {
                if (ribbon.type === "new") onDelete();
                else {
                  setTitle(ribbon.title);
                  setUrl(ribbon.url);
                  setColor(ribbon.color);
                  setEnabled(ribbon.enabled);
                  setClosable(ribbon.closable);
                }
              }}
            >
              <p>Cancel</p>
              <FaTimes size={20} />
            </ActionButton>
          )}
        </ActionButtonsContainer>
      </PCR.updateRibbon>
    </RibbonItemOuter>
  );
};

export default RibbonItem;
