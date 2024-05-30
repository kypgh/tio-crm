import React from "react";
import styled from "styled-components";

import {
  TableData,
  TableOuter,
  Row,
  Cell,
} from "../tableComponents/TableGeneric";

const Outer = styled.div`
  max-width: 1140px;
  width: 100%;
`;

const SegmentedClientsPreview = ({ data }) => {
  return (
    <Outer>
      <TableOuter>
        <TableData>
          <Row header>
            <Cell>Client ID</Cell>
            <Cell>First Name</Cell>
            <Cell>Last Name</Cell>
            <Cell>Email</Cell>
            <Cell>Phone</Cell>
          </Row>
        </TableData>
      </TableOuter>
    </Outer>
  );
};

export default SegmentedClientsPreview;
