import Image from "next/image";
import React, { useState } from "react";
import { BsFiletypePdf } from "react-icons/bs";
import styled from "styled-components";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { LuFileJson2 } from "react-icons/lu";

import { BtnGeneric } from "../generic";
import useTheme from "../../utils/hooks/useTheme";
import { FaFileExcel } from "react-icons/fa";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 20px;
  align-items: center;
`;

const ImgContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  border: 1px dotted ${({ theme }) => theme.textSecondary};
  position: relative;
  min-height: 120px;
  width: 100%;
  border-radius: 5px;
  padding-right: 50px;
  padding-left: 5px;
  overflow-x: auto;
`;

const TextAbsolute = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: ${({ theme }) => theme.textSecondary};
  font-size: 12px;
  text-align: center;
  text-transform: uppercase;
  font-weight: 800;
`;

const FileInput = styled.input`
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
`;

const FileOuter = styled.div`
  background-color: ${({ theme }) => theme.white};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  z-index: 5;
  border-radius: 5px;
  position: relative;
`;

const CloseBtn = styled(AiOutlineCloseCircle)`
  position: absolute;
  bottom: 0;
  right: 0;
  transform: translate(35%, 35%);
  cursor: pointer;
  z-index: 10;
  color: ${({ theme }) => theme.secondary};
  background-color: ${({ theme }) => theme.white};
  border-radius: 50%;
  box-shadow: 0px 0px 5px 0px #ffffff;
`;

const ErrorMsg = styled.div`
  color: ${({ theme }) => theme.errorMsg};
  font-size: 14px;
  font-weight: 500;
`;

const SuccessMsg = styled.div`
  color: ${({ theme }) => theme.success};
  font-size: 14px;
  font-weight: 500;
`;

const FileUpload = ({
  onUpload = async () => {},
  isLoading = false,
  children,
  validFileTypes = ["image/jpg", "image/jpeg", "image/png", "application/pdf"],
  single = false,
}) => {
  const [files, setFiles] = useState([]);
  const [showTypeError, setShowTypeError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const { theme } = useTheme();

  const handleChange = (e) => {
    setShowTypeError(false);
    setErrorMsg(null);
    const fileList = e.target.files;
    const filteredArr = Object.values(fileList).filter((file) =>
      validFileTypes.includes(file.type)
    );
    if (single && filteredArr.length > 0) {
      setFiles(filteredArr.slice(0, 1));
      e.target.value = null;
      e.target.files = null;
      return;
    }
    const removedSomething = filteredArr.length !== fileList.length;
    if (removedSomething) {
      setShowTypeError(true);
    }

    setFiles([...files, ...filteredArr]);
    e.target.value = null;
    e.target.files = null;
  };

  return (
    <Container>
      <ImgContainer>
        {!files.length && (
          <TextAbsolute>
            Drag and drop {single ? "file" : "files"} here
          </TextAbsolute>
        )}
        <FileInput type="file" multiple={!single} onChange={handleChange} />
        {files.map((file, idx) => {
          const isImage = file.type.includes("image");
          const isPdf = file.type.includes("pdf");
          const isJSON = file.type.includes("json");
          const isExcel =
            file.type ===
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
          return (
            <FileOuter key={`${file.name}-${idx}`}>
              <CloseBtn
                size={22}
                onClick={() =>
                  setFiles(files.filter((f) => f.name !== file.name))
                }
              />
              {isImage && (
                <Image
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  width={80}
                  height={80}
                  style={{ cursor: "default", zIndex: 5 }}
                />
              )}
              {isPdf && <BsFiletypePdf size={80} color={"#F40F02"} />}
              {isJSON && <LuFileJson2 size={80} color={theme.brand} />}
              {isExcel && <FaFileExcel size={80} color={"#339966"} />}
            </FileOuter>
          );
        })}
      </ImgContainer>
      {showTypeError && (
        <ErrorMsg>Allowed file types are {validFileTypes.join(", ")}</ErrorMsg>
      )}

      <BtnGeneric
        disabled={!files.length || isLoading}
        onClick={async () => {
          try {
            setErrorMsg(null);
            await onUpload(files);
            setShowSuccess(true);
            setFiles([]);
          } catch (error) {
            setErrorMsg(error);
          }
        }}
      >
        Upload
      </BtnGeneric>
      {errorMsg && <ErrorMsg>{errorMsg}</ErrorMsg>}
      {children}
      {showSuccess && <SuccessMsg>File uploaded successfully</SuccessMsg>}
    </Container>
  );
};

export default FileUpload;
