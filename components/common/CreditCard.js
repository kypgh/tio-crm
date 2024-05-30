import React from "react";
import styled from "styled-components";
import { colors } from "../../config/colors";

const DepositsDetailsCard = styled.div`
  background-color: ${({ theme }) => theme.primary};
  border-radius: 5px;
  padding: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

function CreditCard({
  type = "",
  number = "",
  expiry = "",
  extra = "",
  issuer = "",
}) {
  return (
    <DepositsDetailsCard>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "10px",
        }}
      >
        <strong>{type}</strong>
        <div style={{ textAlign: "right" }}>{expiry}</div>
      </div>
      <div style={{ gridColumn: "span 2" }}>{number}</div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "10px",
        }}
      >
        <div>{extra}</div>
        <small
          style={{
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            overflow: "hidden",
          }}
        >
          {issuer}
        </small>
      </div>
    </DepositsDetailsCard>
  );
}

export default CreditCard;
