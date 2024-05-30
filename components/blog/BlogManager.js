import React, { useState } from "react";
import { useBlogArticles } from "../../utils/hooks/serverHooks";
import ArticleCard from "./ArticleCard";
import { ButtonBlue, Loader } from "../generic";
import styled from "styled-components";
import BlogCart from "./BlogCart";
import { useMutation } from "@tanstack/react-query";
import blogGeneratorService from "../../backend/blog-generator/blogGenerator.service";
import Generating from "./Generating";
import socketIO from "../../utils/socketIOmanager";
import { useNotification } from "../actionNotification/NotificationProvider";

const Outer = styled.div``;

const Title = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${({ theme }) => theme.textPrimary};
  position: sticky;
  top: -5px;
  background-color: ${({ theme }) => theme.secondary};
  user-select: none;
  z-index: 5;
`;

const Flex = styled.div`
  display: flex;
`;

const Col = styled.div`
  flex: 1;
`;

const ColInner = styled.div`
  overflow-y: auto;
  max-height: calc(100vh - 135px);
`;

const SearchOuter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 5px;
`;

const Search = styled.input`
  border: 1px solid ${({ theme }) => theme.brand};
  background-color: ${({ theme }) => theme.primary};
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  max-width: 420px;
  width: 100%;
  font-size: 1rem;
  padding: 5px;
  color: ${({ theme }) => theme.textPrimary};
  background-color: ${({ theme }) => theme.primary};

  &:focus {
    outline: none;
  }
`;

const BlogManager = () => {
  const [items, setItems] = useState(null);
  const [filteredData, setFilteredData] = useState({});

  const actionNotification = useNotification();

  const socket = socketIO({
    onConnect: (data) => {
      if (data?.data?.input) {
        setItems(
          data?.data?.input.reduce((acc, curr) => {
            const id = curr.link.split(".")[1];
            return { ...acc, [id]: curr };
          }, {})
        );
      }
    },
  });

  const { data, isFetching } = useBlogArticles({
    initialData: {},
    onSuccess: (data) => {
      setFilteredData(data);
      if (items == null) {
        setItems(
          Object.keys(data).reduce((acc, curr) => ({ ...acc, [curr]: {} }), {})
        );
      }
    },
  });

  const filterData = (value) => {
    const filtered = Object.keys(data).reduce((acc, curr) => {
      const filtered = data[curr].filter((article) => {
        return article.title.toLowerCase().includes(value.toLowerCase());
      });
      return { ...acc, [curr]: filtered };
    }, {});
    setFilteredData(filtered);
  };

  if (isFetching) {
    return <Loader />;
  }

  return (
    <Outer>
      <SearchOuter>
        <Search
          placeholder="Search..."
          onChange={(e) => {
            const val = e.target.value;
            filterData(val);
          }}
        />
        <Generating
          socket={socket}
          items={items}
          onDeleteItem={(el) => {
            if (socket.isGenerating) return;
            setItems((prev) => ({ ...prev, [el]: {} }));
          }}
        />
      </SearchOuter>
      <Flex>
        {Object.keys(filteredData).map(
          (key, i) =>
            i !== 0 && (
              <Col key={key}>
                <Title>{key}</Title>
                <ColInner>
                  {filteredData[key].map((article) => (
                    <ArticleCard
                      key={`${i} - ${article.link}`}
                      {...article}
                      onClick={() => {
                        if (socket.isGenerating) {
                          actionNotification.WARNING("Generating in progress");
                          return;
                        }
                        const aldreadySelected =
                          items[key]?.link === article.link;
                        if (aldreadySelected) {
                          setItems((prev) => ({ ...prev, [key]: {} }));
                          return;
                        }
                        setItems((prev) => ({
                          ...prev,
                          [key]: article,
                        }));
                      }}
                      selected={items[key]?.link === article.link}
                      hasSelected={!!items[key]?.link}
                    />
                  ))}
                </ColInner>
              </Col>
            )
        )}
      </Flex>
    </Outer>
  );
};

export default BlogManager;
