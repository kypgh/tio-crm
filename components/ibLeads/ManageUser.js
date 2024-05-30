import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaUpload } from "react-icons/fa";
import { motion } from "framer-motion";
import styled from "styled-components";
import ibUserAgent from "../../utils/ibLeadsAgent";
import ExcelJS from "exceljs";

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 4rem;
  padding: 32px;
`;

const Title = styled.h3`
  font-size: 20px;
  font-weight: 500;
  color: ${({ theme }) => theme.textPrimary};
`;

const Divider = styled.div`
  height: 2px;
  width: 100%;
  background-color: ${({ theme }) => theme.primary};
`;

const Progress = styled.div`
  position: relative;
  height: 12px;
  width: 560px;
  box-shadow: ${({ progress }) =>
    progress > 33 && progress < 66
      ? "inset 0px 0px 2px 1px #e5de00"
      : progress > 66
      ? "inset 0px 0px 2px 1px #1cf28c"
      : "inset 0px 0px 2px 1px #f9022b"};
  background-color: transparent;
  border: ${({ progress }) =>
    progress > 33 && progress < 66
      ? "1px solid #e5de00"
      : progress > 66
      ? "1px solid #1cf28c"
      : "1px solid #f9022b"};
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  overflow: hidden;
  padding: 3px;
`;

const Bar = styled.div`
  height: 100%;
  background-color: ${({ progress }) =>
    progress > 33 && progress < 66
      ? "#e5de00"
      : progress > 66
      ? "#1cf28c"
      : "#f9022b"};
`;

const EmailInput = styled.input`
  width: 400px;
  height: 50px;
  padding: 16px;
  border-radius: 5px;
  background-color: transparent;
  color: ${({ theme }) => theme.textPrimary};
  border: ${({ theme }) => `1px solid ${theme.textSecondary}`};
  font-size: 20px;
`;

const CheckContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  flex: 1;
  gap: 16px;
`;

const CheckWrapper = styled.div`
  display: flex;
  width: 100%;
`;

const InputLabel = styled.p`
  font-size: 20px;
  font-weight: 500;
  color: ${({ theme }) => theme.textPrimary};
`;

const ProgressContainer = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;

const ProgressNum = styled.div`
  position: absolute;
  left: 50%;
  font-size: 10px;
  z-index: 5;
`;

const CheckBtn = styled.button`
  width: 140px;
  height: 50px;
  border-radius: 5px;
  background-color: transparent;
  color: ${({ theme }) => theme.textPrimary};
  border: ${({ theme }) => `1px solid ${theme.brand}`};
  font-size: 16px;
  font-weight: 600;
  box-shadow: ${({ theme }) => `0px 0px 4px 1px ${theme.brand}`};
  outline: none;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.brand};
    color: ${({ theme }) => theme.black};
  }
`;

const UserDetails = styled.div`
  width: 500px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 16px;
  flex: 1;
  padding: 2rem;
  color: ${({ theme }) => theme.textPrimary};
`;

const UploadInput = styled.input`
  width: 400px;
  overflow: hidden;
  display: flex;
  padding: 10px;
  font-family: inherit;
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.textPrimary};
  background-color: transparent;
  border: ${({ theme }) => `1px solid ${theme.textSecondary}`};
  border-radius: 5px;

  &:hover {
    &::file-selector-button {
      background-color: ${({ theme }) => theme.brand};
      box-shadow: ${({ theme }) => `0px 0px 3px 1px ${theme.brand}`};
    }
  }

  &::file-selector-button {
    background-color: ${({ theme }) => theme.brand};
    color: ${({ theme }) => theme.textPrimary};
    padding: 5px;
    padding-inline: 10px;
    border: none;
    border-radius: 2px;
    cursor: pointer;
    transition: all 0.2s ease;
  }
`;

const UploadBtn = styled.button`
  width: 140px;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.textPrimary};
  background-color: transparent;
  overflow: hidden;
  outline: none;
  font-family: inherit;
  font-size: 16px;
  font-weight: 600;
  border: ${({ theme }) => `1px solid ${theme.brand}`};
  border-radius: 5px;
  box-shadow: ${({ theme }) => `0px 0px 4px 1px ${theme.brand}`};
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.brand};
    color: ${({ theme }) => theme.black};
  }
`;

const ManageUser = () => {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [user, setUser] = useState("");

  const handleUpload = async (event) => {
    setFile(event.target.files[0]);
  };

  const handleProcess = async () => {
    setUploadProgress(0.01);
    //chunk that equals to 1mb size
    const rowsPerChunk = 10000;
    let numOfChunks;

    let reader = new FileReader();
    reader.onload = async (e) => {
      let buffer = new Uint8Array(reader.result);

      //original excel file that is uploaded in the interface
      let workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(buffer);
      // Now you can work with your Excel file.
      let worksheet = workbook.worksheets[0];

      //rows that contain values
      let rowsCount = worksheet.actualRowCount;
      numOfChunks = Math.ceil(rowsCount / rowsPerChunk);
      //skip the first row with the keys
      let startingRow = 2;

      //get the column titles from the first row of the excel file
      let columnKeys = worksheet.getRow(1).values;

      //loop through the chunks we create and produce a different excel file for each chunk
      for (let i = 1; i <= numOfChunks; i++) {
        let helperWorkbook = new ExcelJS.Workbook();
        let chunkOfRows = worksheet.getRows(startingRow, rowsPerChunk);

        //get only the cell values
        let arrayOfValues = chunkOfRows.map((row, idx) => row.values);

        let usableArray = arrayOfValues.map((valuesArray, idx) =>
          valuesArray.map((value, index) => value)
        );

        let helperSheet = helperWorkbook.addWorksheet();

        //add the rows in the new worksheet
        helperSheet.addRows([columnKeys, ...usableArray]);

        startingRow = rowsPerChunk * i + 1;

        const workbookBuffer = await helperWorkbook.xlsx.writeBuffer();
        await ibUserAgent.uploadIbLeadsExcel(
          new Blob([workbookBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          })
        );

        setUploadProgress(Math.floor((i / numOfChunks) * 100));
      }
      //remove the progress bar after 2.5s
      setTimeout(() => {
        setUploadProgress(0);
      }, 2500);
    };

    reader.readAsArrayBuffer(file);
  };

  //call endpoint for selected ib user
  const getIbUser = () => {
    let ib = ibUserAgent.getUserByEmail(user).then((data) => data);
    return ib;
  };

  const {
    isError: isErrorIbUser,
    isLoading: isLoadingIbUser,
    data: dataIbUser,
    refetch: refetchIbUser,
  } = useQuery({
    queryKey: ["ibUsers"],
    queryFn: getIbUser,
  });

  return (
    <Container>
      <Title>Upload IB Leads file</Title>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ display: "flex", gap: "16px" }}>
          <UploadInput
            type="file"
            accept=".xlsx, .xls"
            onChange={handleUpload}
          />
          <UploadBtn onClick={handleProcess}>
            Upload
            <FaUpload />
          </UploadBtn>
        </div>

        {uploadProgress > 0 ? (
          <Progress progress={uploadProgress}>
            <Bar
              as={motion.div}
              animate={{ width: `${uploadProgress}%` }}
              progress={uploadProgress}
              transition={{
                ease: "linear",
                duration: 0.3,
              }}
            />
            <ProgressNum>{uploadProgress}%</ProgressNum>
          </Progress>
        ) : null}
      </div>

      <Divider />
      <CheckWrapper>
        <CheckContainer>
          <InputLabel>Check if user is registered</InputLabel>
          <ProgressContainer>
            <EmailInput
              placeholder="Enter email"
              type="text"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              onClick={(e) => setUser("")}
            />
            <CheckBtn onClick={refetchIbUser}>Submit</CheckBtn>
          </ProgressContainer>
        </CheckContainer>
        {dataIbUser?.lead ? (
          <UserDetails>
            <span
              style={{
                fontWeight: 600,
                fontSize: "20px",
                marginBottom: "32px",
              }}
            >
              User found!
            </span>
            <span>
              <span style={{ fontWeight: 600, textDecoration: "underline" }}>
                ID:
              </span>{" "}
              {dataIbUser?.lead?.id}
            </span>
            <Divider />
            <span>
              <span style={{ fontWeight: 600, textDecoration: "underline" }}>
                Full Name:
              </span>{" "}
              {dataIbUser?.lead?.full_name}
            </span>
            <Divider />
            <span>
              <span style={{ fontWeight: 600, textDecoration: "underline" }}>
                Email:
              </span>{" "}
              {dataIbUser?.lead?.email}
            </span>
            <Divider />
            <span>
              <span style={{ fontWeight: 600, textDecoration: "underline" }}>
                Phone:
              </span>{" "}
              {dataIbUser?.lead?.phone}
            </span>
            <Divider />
          </UserDetails>
        ) : user !== "" ? (
          <UserDetails>
            <span style={{ fontSize: "20px" }}>User not registered</span>
          </UserDetails>
        ) : null}
      </CheckWrapper>
    </Container>
  );
};

export default ManageUser;
