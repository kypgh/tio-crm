import React, { useState } from "react";
import styled from "styled-components";
import { BsSearchHeart } from "react-icons/bs";
import { Loader, Switch } from "../generic";
import { useMutation, useQuery } from "@tanstack/react-query";
import translationToolAgent from "../../utils/translationToolAgent";
import { Select } from "../formComponents/FormGeneric";

const Container = styled.div`
  width: 100%;
  height: 90vh;
  max-width: 1200px;
  background-color: ${({ theme }) => theme.primary};
  padding: 15px;
  border-radius: 7px;
`;

const Search = styled.input`
  padding: 5px;
  border-radius: 5px;
  border: 1px solid transparent;

  &:focus {
    outline: none;
    border: 1px solid ${({ theme }) => theme.brand};
  }
  width: 200px;
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  & svg {
    cursor: pointer;
    color: ${({ theme }) => theme.brand};
  }
`;

const TopBar = styled(Flex)`
  padding-bottom: 10px;
  border-bottom: 2px solid ${({ theme }) => theme.secondary};
  margin-right: -15px;
  margin-left: -15px;
  padding-right: 15px;
  padding-left: 15px;
`;

const ScrollContainer = styled.div`
  overflow: auto;
  padding-top: 10px;
  max-height: calc(90vh - 70px);
  height: 100%;
  padding-right: 5px;
  position: relative;
`;

const LanguageSelect = styled(Select)`
  background-color: ${({ theme }) => theme.secondary};
`;

const TranslationSearch = ({ app }) => {
  const [languageCode, setLanguageCode] = useState("en");
  const [searchQuery, setSearchQuery] = useState("");

  const { mutate, data, isLoading } = useMutation({
    mutationFn: () =>
      translationToolAgent().searchTranslations(searchQuery, languageCode),
  });

  const { data: langArr } = useQuery({
    queryKey: ["translationTool", "getAllLangs", app?._id],
    queryFn: () => translationToolAgent().getAllLanguages(),
  });

  return (
    <Container>
      <TopBar>
        <Flex>
          <Search
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                mutate();
              }
            }}
          />
          <BsSearchHeart
            onClick={() => {
              mutate();
            }}
          />
        </Flex>
        <Flex>
          <LanguageSelect
            onChange={(ev) => {
              setLanguageCode(ev.target.value);
            }}
          >
            {langArr?.languages &&
              langArr?.languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
          </LanguageSelect>
        </Flex>
      </TopBar>
      <ScrollContainer>
        {isLoading && <Loader />}
        {data &&
          (data?.result?.length > 0 ? (
            data?.result.map((item, idx) => (
              <Item key={idx} item={item}>
                {item.word}
              </Item>
            ))
          ) : (
            <p>No results found</p>
          ))}
      </ScrollContainer>
    </Container>
  );
};

export default TranslationSearch;

const ItemSC = styled.div`
  border: 1px solid ${({ theme }) => theme.secondary};
  padding: 5px 7px;
  background-color: ${({ theme, isOpen }) => isOpen && theme.secondary};
  &:hover {
    background-color: ${({ theme }) => theme.secondary};
  }

  &:not(:last-child) {
    border-bottom: none;
  }
`;

const SubItem = styled.div`
  margin-left: 25px;

  & span {
    text-transform: uppercase;
    width: 25px;
    border-right: 1px solid ${({ theme }) => theme.secondary};
    padding-right: 5px;
    display: inline-block;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 3px 0;

  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.secondary};
  }
`;

const Item = ({ item }) => {
  const [translations, setTranslations] = useState();
  return (
    <>
      <ItemSC
        onClick={() => {
          if (translations) {
            setTranslations(null);
            return;
          }
          setTranslations(item.translations);
        }}
        isOpen={!!translations}
      >
        <p>{`${item.word} - ${item.score?.toFixed(2)}`}</p>
      </ItemSC>
      {translations &&
        (translations.length > 0 ? (
          <SubItem>
            {translations.map((translation, idx) => (
              <Row key={idx}>
                <span>{translation.language}</span>
                <p>{translation.word}</p>
              </Row>
            ))}
          </SubItem>
        ) : (
          <SubItem>
            <p>No translations found</p>
          </SubItem>
        ))}
    </>
  );
};
