import React from "react";
import { useQuery } from "@tanstack/react-query";

import { Loader } from "./generic";
import agent from "../utils/agent";
import PDFViewer from "./PdfViewer";
import ErrorBoundary from "./ErrorBoundary";
import { useDocumentbyID } from "../utils/hooks/serverHooks";

export default function ViewDocument({ documentID, theme, modalData }) {
  const { data, isLoading, error } = useDocumentbyID(documentID || modalData);

  if (isLoading) return <Loader />;

  return (
    <ErrorBoundary
      hasError={error}
      theme={theme}
      errorMessage={"Something went wrong fetching user details"}
    >
      <PDFViewer
        url={data?.document?.presignedUrl}
        type={data?.document?.extension}
      />
    </ErrorBoundary>
  );
}
