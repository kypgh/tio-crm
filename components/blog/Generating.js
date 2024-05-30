import React, { useEffect, useState } from "react";
import { RiAiGenerate } from "react-icons/ri";
import styled, { keyframes } from "styled-components";
import { Loader } from "../generic";
import Output from "./Output";

const OpenAnimation = keyframes`
    from {
        transform: translateX(100%);
    }
    to {
        transform: translateX(0);
    }
`;

const Outer = styled.div`
  padding: 5px;
  border: 1px solid ${({ theme }) => theme.brand};
  background-color: ${({ theme }) => theme.primary};
  border-radius: 5px;
  color: ${({ theme }) => theme.textPrimary};
  cursor: pointer;
  z-index: 9;
  max-width: 170px;
  width: 100%;
  transition: all 0.3s ease-in-out;

  &:hover {
    background-color: ${({ theme }) => theme.secondary};
  }
`;

const Inner = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const IconWrapper = styled.div`
  position: relative;
  min-width: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Text = styled.div`
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
  width: 20vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
`;

const Right = styled.div`
  width: 80vw;
  height: 100vh;
  background-color: ${({ theme }) => theme.primary};
  padding: 15px;
  border-left: 1px solid ${({ theme }) => theme.brand};
  display: flex;
  flex-direction: column;
`;

const ProgressContainer = styled.div`
  position: relative;
  width: 100%;
  background-color: ${({ theme }) => theme.secondary};
  border-radius: 5px;
  height: 5px;
  margin-bottom: 10px;
`;

const ProgressBar = styled.div`
  max-width: ${({ $width }) => $width}%;
  width: 100%;
  height: 5px;
  background-color: ${({ theme }) => theme.brand};
  border-radius: 5px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
`;

const Generating = ({ socket, items = {}, onDeleteItem }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [output, setOutput] = useState("");
  const [articlesScrape, setArticlesScrape] = useState([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function onProgress(data) {
      setProgress(data?.progress || 0);
      switch (data?.status) {
        case "scraping":
          setOutput("");
          setArticlesScrape(...articlesScrape, data?.data);
          break;
        case "generating":
          setOutput((prev) => prev + data?.data);
          break;
        case "success":
          setOutput((prev) => prev + data?.data?.output);
          break;
        default:
          break;
      }
    }

    socket.emit("blogs", null, (data) => {
      setOutput(data?.data?.output);
    });
    socket.on("blogs:progress", onProgress);

    return () => {
      socket.off("blogs:progress", onProgress);
    };
  }, []);

  return (
    <>
      <Outer>
        <Inner
          onClick={() => {
            setIsOpen((prev) => !prev);
          }}
        >
          <IconWrapper>
            {socket.isGenerating ? <Loader /> : <RiAiGenerate />}
          </IconWrapper>
          <Text>
            {socket.isGenerating ? "Generating..." : "Generated Article"}
          </Text>
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
            {socket.isGenerating && (
              <ProgressContainer>
                <ProgressBar $width={progress} />
              </ProgressContainer>
            )}
            <Output
              value={output}
              setOutput={setOutput}
              items={items}
              socket={socket}
              onDeleteItem={onDeleteItem}
            />
          </Right>
        </SideOuter>
      )}
    </>
  );
};

export default Generating;
