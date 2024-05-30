import React from "react";
import styled from "styled-components";
import { ButtonBlue } from "../generic";
import { FiExternalLink } from "react-icons/fi";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import blogGeneratorService from "../../backend/blog-generator/blogGenerator.service";
import { AiOutlineCloseCircle } from "react-icons/ai";

const Outer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  overflow: auto;
  position: relative;
`;

const GPTText = styled.div`
  & * {
    margin: revert;
    padding: revert;
  }
  font-size: 18px;
  /* white-space: pre-wrap; */
  color: ${({ theme }) => theme.textPrimary};
  padding-right: 5px;
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${({ theme }) => theme.brand};
  border-radius: 3px;
  padding-bottom: 5px;
  padding-right: 5px;
  position: sticky;
  top: 0;
  background-color: ${({ theme }) => theme.primary};
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;

  & > i {
    color: ${({ theme }) => theme.brand};
  }

  & > p {
    font-weight: 500;
    color: ${({ theme }) => theme.textPrimary};
  }

  & svg {
    color: ${({ theme }) => theme.blue};
    cursor: pointer;
  }
`;

const LabelOuter = styled.div`
  border: 1px solid ${({ theme }) => theme.brand};
  padding: 3px 5px;
  border-radius: 5px;
`;

const Output = ({
  value,
  items,
  socket,
  onDeleteItem = () => {},
  setOutput,
}) => {
  const publish = useMutation(blogGeneratorService.publishBlog, {
    onSuccess: () => {
      const a = document.createElement("a");
      a.href =
        "https://tiomarkets-blog-sanity.vercel.app/studio/staging/desk/post";
      a.target = "_blank";
      a.click();
    },
  });

  const generateArticle = useMutation(
    async (arr) => {
      return blogGeneratorService.scrapePages(arr);
    },
    {
      mutationKey: "generateArticle",
      onSuccess: (data) => {},
    }
  );

  return (
    <Outer>
      <TopRow>
        <Flex>
          <i>Selected Articles: </i>
          {items &&
            Object.keys(items)
              .filter((el) => items[el].link || items[el].url)
              .map((el, idx) => (
                <LabelOuter key={idx}>
                  <Flex>
                    <p>{el}</p>
                    <Link href={items[el].link || items[el].url} passHref>
                      <a target="_blank">
                        <FiExternalLink />
                      </a>
                    </Link>
                    <AiOutlineCloseCircle
                      color="red"
                      size={18}
                      onClick={() => {
                        onDeleteItem(el);
                      }}
                      style={{
                        opacity: socket.isGenerating ? 0.5 : 1,
                        cursor: socket.isGenerating ? "not-allowed" : "pointer",
                      }}
                    />
                  </Flex>
                </LabelOuter>
              ))}
        </Flex>
        <Flex>
          <ButtonBlue
            onClick={() => {
              navigator.clipboard.writeText(value);
            }}
            disabled={!value}
          >
            Copy
          </ButtonBlue>
          <ButtonBlue
            onClick={() => {
              setOutput("");
              const arr = Object.keys(items).reduce((acc, curr) => {
                if (items[curr].title) {
                  acc.push(items[curr].link);
                }
                return acc;
              }, []);
              generateArticle.mutate(arr);
            }}
            disabled={
              socket.isGenerating ||
              generateArticle.isLoading ||
              Object.keys(items).length === 0
            }
          >
            Generate
          </ButtonBlue>
          <ButtonBlue
            onClick={() => {
              publish.mutate();
            }}
            disabled={!value || socket.isGenerating || publish.isLoading}
          >
            Publish
          </ButtonBlue>
          <ButtonBlue
            onClick={() => {
              socket.emit("blogs:stop", null, (data) => {});
            }}
            disabled={!value}
          >
            Force Stop
          </ButtonBlue>
        </Flex>
      </TopRow>
      <GPTText>
        {!!value ? (
          <div dangerouslySetInnerHTML={{ __html: value }} />
        ) : (
          socket.isGenerating && "Generating..."
        )}
      </GPTText>
    </Outer>
  );
};

export default Output;
