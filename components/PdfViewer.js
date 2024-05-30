import React, { useState, useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.js";
// import { useWindowSize } from "../util/fxpHooks";
import styled from "styled-components";
import Link from "next/link";
import {
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaFutbol,
} from "react-icons/fa";
import { ImageOuter, Loader } from "./generic";

const PageButtons = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: auto;
  position: relative;
  z-index: 99;
`;

const PageButtonsInner = styled.div`
  flex-wrap: wrap;
  background: #ffffff;
  max-width: 595px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 0px 2px 1px;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  padding: 5px 10px;
  font-size: 12px;
  font-weight: 700;
  justify-content: space-between;
`;

const BtnPreviousPage = styled.div`
  display: flex;
  flex-direction: column;
  cursor: pointer;
`;
const PageCount = styled.div`
  display: flex;
  flex-direction: column;
`;
const BtnNextPage = styled.div`
  display: flex;
  flex-direction: column;
  cursor: pointer;
`;

const DownloadButton = styled.div`
  width: 100%;
  display: flex;
  background-color: #111;
  max-width: 300px;
  margin: auto;
  margin-top: 10px;
  margin-bottom: 10px;
  text-align: center;
  justify-content: center;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  transition: all 0.15s linear;
  border: 2px solid transparent;
  & a {
    color: #fff;
    width: 100%;
  }
  &:hover {
    & a {
      color: #111;
    }
    border: 2px solid #111;
    background-color: transparent;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

const Container = styled.div`
  position: relative;
  border-radius: 5px;
  overflow: hidden;
  background: white;
  zoom: 0.85;
  min-height: 500px;
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const CloseButton = styled.div`
  cursor: pointer;
  z-index: 999;
`;
const PageButtonContainerAlternative = styled.div`
  position: fixed;
  z-index: 99;
  width: 100%;
  display: flex;
  height: 100px;
  justify-content: space-between;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  max-width: 1000px;
  align-items: center;
  height: 100%;
`;

const ButtonBack = styled.button`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  width: 70px;
  background-color: transparent;
  border: none;
  color: #fff;
  height: 100%;
`;
const ButtonNext = styled.button`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  width: 70px;
  background-color: transparent;
  border: none;
  color: #fff;
  height: 100%;
`;

const PDFViewer = ({ url, type }) => {
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [documentKey, setDocumentKey] = useState(Date.now());
  const [isLoading, setIsLoading] = useState(true);

  // const { width, height } = useWindowSize();

  const onDocumentLoadSuccess = ({ numPages }) => {
    setIsLoading(false);
    setNumPages(numPages);
  };

  const nextPage = () => {
    if (pageNumber <= numPages - 1) {
      setPageNumber(pageNumber + 1);
    }
  };

  const previousPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  if (type !== "pdf") {
    return (
      <Container>
        {isLoading && <Loader style={{ height: 700 }} />}
        <ImageOuter
          src={url}
          width={700}
          height={700}
          onLoad={() => setIsLoading(false)}
        />
        <DownloadButton>
          <a href={url} target="_blank" rel="noreferrer">
            Download document
          </a>
        </DownloadButton>
      </Container>
    );
  } else {
    return (
      <Container>
        {isLoading && <Loader />}
        <Document
          key={documentKey}
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={(err) => {
            setIsLoading(false);
            console.error(err);
          }}
        >
          <Page key={documentKey} pageNumber={pageNumber} />
        </Document>
        <PageButtonContainerAlternative>
          <ButtonBack onClick={previousPage}>
            <FaChevronLeft size={60} />
          </ButtonBack>
          <ButtonNext onClick={nextPage}>
            <FaChevronRight size={60} />
          </ButtonNext>
        </PageButtonContainerAlternative>
        <PageButtons>
          <PageButtonsInner>
            <ButtonRow>
              <BtnPreviousPage onClick={previousPage}>Back</BtnPreviousPage>
              <PageCount>
                {`${String(pageNumber).padStart(2, "0")} / ${String(
                  numPages
                ).padStart(2, "0")}`}
              </PageCount>

              <BtnNextPage onClick={nextPage}>Next</BtnNextPage>
            </ButtonRow>
            <DownloadButton>
              <a href={url} target="_blank" rel="noreferrer">
                Download document
              </a>
            </DownloadButton>
          </PageButtonsInner>
        </PageButtons>
      </Container>
    );
  }
};

export default PDFViewer;
