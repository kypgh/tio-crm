import React, { useState } from "react";
import styled from "styled-components";
import Link from "next/link";

import { IoIosArrowDown } from "react-icons/io";

import FinancesInfo from "./FinancesInfo";
import useAnimation from "../../utils/hooks/useAnimation";
import AnimateHeight from "react-animate-height";

const Outer = styled.div`
  height: auto;
  display: flex;
  flex-direction: column;
`;

const Date = styled.div`
  color: ${({ theme }) => theme.textPrimary};
  padding: 10px;
  border-radius: 5px;
  background-color: ${({ theme }) => theme.secondary};
  font-weight: bold;
  display: flex;
  gap: 10px;
  align-items: center;
  cursor: pointer;

  & svg {
    display: flex;
    align-items: center;
    justify-content: center;
    transform: rotateZ(${({ isMounted }) => (isMounted ? "0deg" : "-90deg")});
    transition: 0.5s all ease;
  }
`;

const DateTransactions = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  gap: 5px;
  overflow: hidden;
`;

function DatesTransactions({ data, date }) {
  const [isMounted, setIsMounted] = useState(false);
  const isOpen = useAnimation(isMounted, 200);

  return (
    <Outer>
      <Date onClick={() => setIsMounted(!isMounted)} isMounted={isMounted}>
        <span>
          <IoIosArrowDown />
        </span>
        <p>{date}</p>
      </Date>
      <AnimateHeight duration={500} height={isOpen ? "auto" : 0}>
        <DateTransactions>
          {data.newDocs[date].map((el, idx) => (
            <div key={idx}>
              {el.transaction_type === "deposit" && (
                <Link
                  href={{
                    pathname: "https://atlas.praxispay.com/transaction/view",
                    query: { trace_id: el.tid },
                  }}
                  passHref
                >
                  <a target="_blank" style={{ textDecoration: "none" }}>
                    <FinancesInfo transaction={el} />
                  </a>
                </Link>
              )}
              {el.transaction_type !== "deposit" && (
                <FinancesInfo transaction={el} />
              )}
            </div>
          ))}
        </DateTransactions>
      </AnimateHeight>
    </Outer>
  );
}

export default DatesTransactions;
