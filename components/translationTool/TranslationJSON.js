import { useEffect, useMemo, useState } from "react";
import styled, { keyframes } from "styled-components";
import { useNotification } from "../actionNotification/NotificationProvider";
import TooltipWrapper from "../TooltipWrapper";
import { VscCollapseAll, VscExpandAll } from "react-icons/vsc";
import { FaCopy, FaDownload, FaSave, FaTrash, FaUpload } from "react-icons/fa";
import ModalHook from "../ModalHook";
import JSONViewer from "../common/JSONViewer";
import UploadJSONModal from "./UploadJSONModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import translationToolAgent from "../../utils/translationToolAgent";
import UploadExcelModal from "./UploadExcelModal";
import { Select } from "../formComponents/FormGeneric";
import { useRouter } from "next/router";
import { MdLanguage } from "react-icons/md";
import ManageLang from "./ManageLang";
import { ActionButton, Loader } from "../generic";
import TranslationSearch from "./TranslationSearch";
import { BsSearchHeart } from "react-icons/bs";
import { filterObject, flattenObject } from "../../utils/functions";
import { TbCodePlus } from "react-icons/tb";

import _ from "lodash";
import useTheme from "../../utils/hooks/useTheme";
import TranslateExcelModal from "./TranslateExcelModal";

const Container = styled.div`
  background-color: ${({ theme }) => theme.primary};
  border-radius: 5px;
  color: ${({ theme }) => theme.textPrimary};
  padding: 10px;
  overflow: hidden;
  height: 100%;

  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr;
  gap: 5px;
  position: relative;
`;

const Inner = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: 1fr;
  height: 100%;
  overflow: hidden;
`;
const InnerLeft = styled.div`
  overflow: auto;
  height: 100%;
`;
const InnerRight = styled.div`
  border-left: 1px solid ${({ theme }) => theme.secondary};
  overflow-x: hidden;
  overflow-y: auto;
  width: 0px;
  transform: translateX(500px);
  transition: width 0.5s ease-in-out;
  &.isOpen {
    width: 500px;
    transform: translateX(0px);
  }
`;

const ToolBar = styled.div`
  display: grid;
  grid-template-columns: auto auto auto auto 1fr auto auto auto auto auto auto auto;
  gap: 10px;
  border-bottom: 1px solid ${({ theme }) => theme.secondary};
  padding-bottom: 5px;
`;

const loadingKeyframes = keyframes`
  0% {
    background-position: 0px;
  }
  100% {
    background-position: 100em;
  }
`;

const ToolBarBtn = styled.button`
  position: relative;
  cursor: pointer;
  padding: 2px 5px;
  border: none;
  outline: none;
  background-color: ${({ theme }) => theme.secondary};
  color: ${({ theme }) => theme.brand};
  border-radius: 5px;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  & > span {
    color: ${({ theme }) => theme.textPrimary};
  }
  &.loading::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: rgb(26, 255, 0);
    background: linear-gradient(
      90deg,
      rgba(0, 0, 0, 0.3) 0%,
      rgba(0, 0, 0, 0.3) 5%,
      ${({ theme }) => theme.brand} 15%,
      rgba(0, 0, 0, 0.3) 25%,
      rgba(0, 0, 0, 0.3) 100%
    );
    border-radius: 5px;
    animation: ${loadingKeyframes} 15s linear infinite forwards;
  }
`;

const ToolBarSelect = styled(Select)`
  background-color: ${({ theme }) => theme.secondary};
`;

const BtnContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const Outer = styled.div`
  background-color: ${({ theme }) => theme.secondary};
  padding: 15px;
  border-radius: 7px;
  position: relative;
`;

const EditToolbar = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  padding: 5px;
  padding-top: 0px;
  border-bottom: 1px solid ${({ theme }) => theme.secondary};
`;

const ManageLangWrapper = ({ app, closeModal }) => {
  const [selectedLangs, setSelectedLangs] = useState();
  const actionNotification = useNotification();
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation({
    mutationFn: () =>
      translationToolAgent().updateWebapp(app._id, app.name, selectedLangs),
    onSuccess: () => {
      actionNotification.SUCCESS("Updated languages for webapp");
      queryClient.invalidateQueries(["translationApps"]);
      closeModal();
    },
  });
  return (
    <Outer>
      {isLoading && <Loader />}
      <ManageLang
        app={app}
        onChange={(langs) => {
          setSelectedLangs(langs.map((lang) => lang.code));
        }}
      />
      <BtnContainer>
        <ActionButton
          invert
          onClick={() => {
            mutate();
          }}
        >
          Submit
        </ActionButton>
      </BtnContainer>
    </Outer>
  );
};

/**
 * @param {{
 *  data: Object,
 * }} param0
 * @returns
 */
const TranslationJSON = ({ data, app }) => {
  const router = useRouter();
  const sendNotif = useNotification();
  const [editableKeys, setEditableKeys] = useState({});
  const [state, setState] = useState(data);

  useEffect(() => {
    setState(data);
  }, [data]);
  const queryClient = useQueryClient();
  const [expandAll, setExpandedAll] = useState(true);
  const downloadExcel = useMutation({
    mutationFn: (jsonPath) =>
      translationToolAgent().downloadUntranslatedExcel(
        app?._id,
        app.name,
        jsonPath
      ),
    onSuccess: (data) => {
      sendNotif.SUCCESS("Downloaded untranslated excel");
    },
    onError: (err) => {
      sendNotif.ERROR("Something went wrong downloading excel");
    },
  });
  const downloadJSON = useMutation({
    mutationFn: () =>
      translationToolAgent().downloadJSON(app?._id, router.query.lang ?? "en"),
    onSuccess: (data) => {
      sendNotif.SUCCESS("Downloaded JSON file");
    },
    onError: (err) => {
      sendNotif.ERROR("Something went wrong downloading JSON file");
    },
  });
  const downloadZip = useMutation({
    mutationFn: () => translationToolAgent().downloadZip(app?._id),
    onSuccess: (data) => {
      sendNotif.SUCCESS("Downloaded ZIP file");
    },
    onError: (err) => {
      sendNotif.ERROR("Something went wrong downloading ZIP file");
    },
  });

  const saveTranslations = useMutation({
    mutationFn: (translations) =>
      translationToolAgent().updateWordsForApp(
        app?._id,
        translations,
        router.query.lang ?? "en"
      ),
    onSuccess: (data) => {
      sendNotif.SUCCESS("Saved translations");
      queryClient.invalidateQueries(["translationKeys", app?._id]);
      setEditableKeys({});
    },
    onError: (err) => {
      sendNotif.ERROR("Something went wrong saving translations");
    },
  });

  const editableKeysArray = useMemo(
    () => Object.keys(flattenObject(editableKeys ?? {})),
    [editableKeys]
  );

  const { theme } = useTheme();

  return (
    <Container>
      {saveTranslations.isLoading && <Loader />}
      <ToolBar>
        <ToolBarSelect
          value={router.query.lang ?? "en"}
          onChange={(ev) => {
            router.push({
              pathname: router.pathname,
              query: {
                ...router.query,
                lang: ev.target.value,
              },
            });
          }}
        >
          {app &&
            app.languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
        </ToolBarSelect>
        <TooltipWrapper tooltip={expandAll ? "Collapse All" : "Expand All"}>
          <ToolBarBtn
            onClick={() => {
              setExpandedAll(!expandAll);
            }}
            type="button"
          >
            {expandAll ? <VscExpandAll /> : <VscCollapseAll />}
          </ToolBarBtn>
        </TooltipWrapper>
        <TooltipWrapper tooltip="Copy">
          <ToolBarBtn
            onClick={() => {
              navigator.clipboard.writeText(JSON.stringify(state, null, 4));
              sendNotif.SUCCESS("Copied to clipboard");
            }}
            type="button"
          >
            <FaCopy />
          </ToolBarBtn>
        </TooltipWrapper>

        <ModalHook componentToShow={<TranslationSearch app={app} />}>
          {({ openModal }) => (
            <TooltipWrapper tooltip="Search for a string">
              <ToolBarBtn onClick={() => openModal()}>
                <span>Search</span>
                <BsSearchHeart />
              </ToolBarBtn>
            </TooltipWrapper>
          )}
        </ModalHook>
        <div />

        <ModalHook componentToShow={<ManageLangWrapper app={app} />}>
          {({ openModal }) => (
            <TooltipWrapper tooltip="Manage languages for Webapp">
              <ToolBarBtn onClick={() => openModal()}>
                <span>Languages</span>
                <MdLanguage size={16} />
              </ToolBarBtn>
            </TooltipWrapper>
          )}
        </ModalHook>

        <TooltipWrapper tooltip="Download excel for untranslated">
          <ToolBarBtn
            className={downloadExcel.isLoading ? "loading" : ""}
            onClick={() => downloadExcel.mutate()}
          >
            <span>Download EXCEL</span>
            <FaDownload />
          </ToolBarBtn>
        </TooltipWrapper>
        <ModalHook componentToShow={<UploadExcelModal app={app} />}>
          {({ openModal }) => (
            <TooltipWrapper tooltip="Upload Excel file for translations">
              <ToolBarBtn onClick={() => openModal()}>
                <span>Upload EXCEL</span>
                <FaUpload />
              </ToolBarBtn>
            </TooltipWrapper>
          )}
        </ModalHook>
        <ModalHook componentToShow={<TranslateExcelModal app={app} />}>
          {({ openModal }) => (
            <TooltipWrapper tooltip="Upload Excel file to produce non-duplicate translations">
              <ToolBarBtn onClick={() => openModal()}>
                <span>Translate EXCEL</span>
                <FaUpload />
              </ToolBarBtn>
            </TooltipWrapper>
          )}
        </ModalHook>
        <TooltipWrapper tooltip="Download JSON file">
          <ToolBarBtn
            className={downloadJSON.isLoading ? "loading" : ""}
            onClick={() => downloadJSON.mutate()}
          >
            <span>Download JSON</span>
            <FaDownload />
          </ToolBarBtn>
        </TooltipWrapper>
        <ModalHook componentToShow={<UploadJSONModal app={app} />}>
          {({ openModal }) => (
            <TooltipWrapper tooltip="Upload JSON file">
              <ToolBarBtn onClick={() => openModal()}>
                <span>Upload JSON</span>
                <FaUpload />
              </ToolBarBtn>
            </TooltipWrapper>
          )}
        </ModalHook>
        <TooltipWrapper tooltip="Download Zip file">
          <ToolBarBtn
            className={downloadZip.isLoading ? "loading" : ""}
            onClick={() => downloadZip.mutate()}
          >
            <span>Download ZIP</span>
            <FaDownload />
          </ToolBarBtn>
        </TooltipWrapper>
      </ToolBar>
      <Inner editing={!_.isEmpty(editableKeys)}>
        <InnerLeft>
          <JSONViewer
            data={state}
            expandAll={expandAll}
            markedKeys={editableKeysArray}
            onKeyValueClick={({ key, value, line }) => {
              if (editableKeysArray.includes(key)) {
                setEditableKeys((prev) => {
                  return filterObject(
                    _.omit(prev, key),
                    (k, v) => !_.isEmpty(v)
                  );
                });
              } else {
                setEditableKeys((prev) => {
                  _.set(prev, key, value);
                  return _.cloneDeep(prev);
                });
              }
            }}
            extraLineAdditions={({ keyValue }) => (
              <>
                <TooltipWrapper tooltip="Add new key">
                  <TbCodePlus
                    size={20}
                    color={theme.blue}
                    onClick={() => {
                      setEditableKeys((prev) => {
                        _.set(prev, `${keyValue}._newKey_`, "");
                        return _.cloneDeep(prev);
                      });
                    }}
                  />
                </TooltipWrapper>
                <TooltipWrapper tooltip="Download current block">
                  <FaDownload
                    size={16}
                    color={theme.blue}
                    onClick={() => {
                      downloadExcel.mutate(keyValue);
                    }}
                  />
                </TooltipWrapper>
              </>
            )}
          />
        </InnerLeft>
        <InnerRight className={!_.isEmpty(editableKeys) ? "isOpen" : ""}>
          <EditToolbar>
            <TooltipWrapper tooltip="Clear changes">
              <ToolBarBtn
                onClick={() => {
                  setEditableKeys({});
                }}
              >
                <span>Cancel</span>
                <FaTrash />
              </ToolBarBtn>
            </TooltipWrapper>
            <div />
            <TooltipWrapper tooltip="Save changes below">
              <ToolBarBtn
                onClick={() => {
                  saveTranslations.mutate(editableKeys);
                }}
              >
                <span>Save</span>
                <FaSave />
              </ToolBarBtn>
            </TooltipWrapper>
          </EditToolbar>
          {editableKeys && (
            <JSONViewer
              data={editableKeys}
              editable
              onEdit={({ key, value }) => {
                setEditableKeys((prev) => {
                  _.set(prev, key, value);
                  return _.cloneDeep(prev);
                });
              }}
              onDelete={({ key, value, line }) => {
                setEditableKeys((prev) => {
                  return filterObject(
                    _.omit(prev, key),
                    (k, v) => !_.isEmpty(v)
                  );
                });
              }}
              onKeyEdit={({ oldKey, newKey }) => {
                setEditableKeys((prev) => {
                  const newEditableKeys = _.cloneDeep(prev);
                  const value = _.get(newEditableKeys, oldKey);
                  _.unset(newEditableKeys, oldKey);
                  _.set(newEditableKeys, newKey, value);
                  return newEditableKeys;
                });
              }}
            />
          )}
        </InnerRight>
      </Inner>
    </Container>
  );
};

export default TranslationJSON;
