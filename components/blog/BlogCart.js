import React, { useState } from "react";
import { AiOutlineShoppingCart } from "react-icons/ai";
import styled, { keyframes } from "styled-components";
import ArticleCard from "./ArticleCard";
import _ from "lodash";
import { ButtonBlue } from "../generic";

const OpenAnimation = keyframes`
    from {
        transform: translateX(100%);
    }
    to {
        transform: translateX(0);
    }
`;

const Outer = styled.div`
  position: fixed;
  right: 0;
  top: 100px;
  padding: 5px;
  font-size: 20px;
  border: 2px solid ${({ theme }) => theme.brand};
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  border-right: 0;
  background-color: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.textPrimary};
  transform: translateX(123px);
  transition: all 0.3s ease-in-out;
  cursor: pointer;
  z-index: 9;

  &:hover {
    transform: translateX(0);
  }
`;

const Inner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
`;

const Text = styled.div`
  border-left: 2px solid ${({ theme }) => theme.brand};
  padding-left: 5px;
  user-select: none;
`;

const SideOuter = styled.div`
  position: fixed;
  right: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  z-index: 10;
  display: flex;
  transition: all 0.3s ease-in-out;
  animation: ${OpenAnimation} 0.15s ease-in-out;
`;

const Left = styled.div`
  width: 30vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
`;

const Right = styled.div`
  width: 70vw;
  height: 100vh;
  background-color: ${({ theme }) => theme.primary};
  padding: 15px;
  border-left: 1px solid ${({ theme }) => theme.brand};
  display: flex;
  flex-direction: column;
`;

const Rinner = styled.div`
  overflow-y: auto;
  margin-bottom: 5px;
  height: 100%;
`;

const Rbottom = styled.div`
  min-height: 70px;
  border: 1px solid ${({ theme }) => theme.brand};
  border-radius: 5px;
  padding: 5px;
`;

const BlogCart = ({
  items = {},
  onDelete = () => {},
  onGenerate = () => {},
  socket = {},
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Outer>
        <Inner
          onClick={() => {
            setIsOpen((prev) => !prev);
          }}
        >
          <AiOutlineShoppingCart />
          <Text>Blog Articles</Text>
        </Inner>
      </Outer>
      {isOpen && (
        <SideOuter $isOpen={isOpen}>
          <Left
            onClick={() => {
              setIsOpen(false);
            }}
          />
          <Right>
            <Rinner>
              {Object.keys(items).map((item, idx) => (
                <ArticleCard
                  key={idx}
                  {...items[item]}
                  from={item}
                  viewOnly
                  onDelete={() => {
                    onDelete(item);
                  }}
                  isEmpty={_.isEmpty(items[item])}
                />
              ))}
            </Rinner>
            <Rbottom>
              <ButtonBlue
                disabled={
                  socket.isGenerating ||
                  Object.values(items).every((item) => _.isEmpty(item))
                }
                style={{
                  maxWidth: "120px",
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  fontSize: "18px",
                  fontWeight: "700",
                }}
                onClick={onGenerate}
              >
                Generate
              </ButtonBlue>
            </Rbottom>
          </Right>
        </SideOuter>
      )}
    </>
  );
};

export default BlogCart;
