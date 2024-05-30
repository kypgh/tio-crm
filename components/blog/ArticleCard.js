import React from "react";
import styled from "styled-components";
import Link from "next/link";

import { DateTime } from "luxon";
const Outer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  border: 1px solid black;
  border-radius: 10px;
  background-color: #f5f5f5;
  overflow: hidden;
  cursor: ${({ $viewOnly }) => ($viewOnly ? "default" : "pointer")};
  background-color: ${({ $hasSelected, $selected }) =>
    $hasSelected ? ($selected ? "#90ff90" : "#565656") : "f5f5f5"};
  position: ${({ $selected }) => $selected && "sticky"};
  top: 0;
  bottom: 0;
  z-index: ${({ $selected }) => $selected && 2};
`;
const Inner = styled.div`
  display: flex;
  position: relative;
`;
const Left = styled.div`
  flex: 1;
  padding: 10px;
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: bold;
`;

const Desc = styled.p`
  font-size: 1rem;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
`;

const Date = styled.div`
  font-size: 0.75rem;
`;

const From = styled.div`
  font-weight: bold;
  color: ${({ theme }) => theme.brand};
`;

const Delete = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 30px;
  height: 30px;
  background-color: red;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  border-bottom-left-radius: 7px;
`;

const CusA = styled.a`
  text-decoration: none;
  color: ${({ theme }) => theme.blue};
  font-size: 16px;
  font-weight: bold;
  width: fit-content;
`;

const ArticleCard = ({
  title = "",
  description = "",
  link = "",
  createdAt = "",
  selected = false,
  onClick = () => {},
  viewOnly = false,
  from = "",
  onDelete = () => {},
  hasSelected = false,
  isEmpty = false,
}) => {
  return (
    <Outer
      $selected={selected}
      $hasSelected={hasSelected}
      onClick={onClick}
      $viewOnly={viewOnly}
    >
      <Inner>
        <Left>
          {isEmpty ? (
            <>
              {viewOnly && <From>~ {from}</From>}
              {viewOnly && <Title style={{ color: "red" }}>Not Selected</Title>}
            </>
          ) : (
            <>
              {viewOnly && <From>~ {from}</From>}
              <Title>{title}</Title>
              {viewOnly && <Desc>{description}</Desc>}
              <Link href={link} passHref>
                <CusA target="_blank">Read More</CusA>
              </Link>
              <Date>
                {DateTime.fromISO(createdAt).toFormat("dd/MM/yyyy - HH:mm")}
              </Date>
            </>
          )}
        </Left>
        {viewOnly && <Delete onClick={onDelete}>x</Delete>}
      </Inner>
    </Outer>
  );
};

export default ArticleCard;
