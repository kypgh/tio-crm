import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useTranslationApps } from "../../utils/hooks/translationHooks";
import { Loader } from "../generic";
import { useRouter } from "next/router";
import ModalHook from "../ModalHook";
import { FaPlus } from "react-icons/fa";
import CreateTranslationAppModal from "./CreateTranslationAppModal";
import _ from "lodash";

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 2px;
  border-radius: 5px;
`;

const ScrollContainer = styled.div`
  padding: 5px;
  border: 2px solid ${({ theme }) => theme.primary};
  background-color: ${({ theme }) => theme.primary};
  display: flex;
  overflow-x: auto;
  gap: 20px;
  border-radius: 5px;
  & > * {
    width: 200px;
    flex-shrink: 0;
  }
  &::-webkit-scrollbar {
    height: 2px;
  }
`;

const AppBtn = styled.button`
  padding: 20px;
  background-color: ${({ theme, selected }) =>
    selected ? theme.brand : theme.secondary};
  border: 1px solid ${({ theme }) => theme.secondary};
  border-radius: 5px;
  outline: none;
  color: ${({ theme }) => theme.textPrimary};
  cursor: pointer;
  & h4 {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }
  & p {
    color: ${({ theme }) => theme.textSecondary};
  }
  &:hover {
    border: 1px solid ${({ theme }) => theme.brand};
  }
`;

const ExtraContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  border-radius: 5px;
  padding: 5px;
  border: 2px solid ${({ theme }) => theme.primary};
  background-color: ${({ theme }) => theme.primary};
`;

const TranslationApps = () => {
  const { data, isLoading } = useTranslationApps({
    initialData: { webapps: [] },
  });
  const router = useRouter();
  const parentRef = useRef(null);

  const scrollIntoView = () => {
    const parentRect = parentRef.current.getBoundingClientRect();
    const childRef = Array.from(parentRef.current.children).find(
      (child) => child.id === router.query.app
    );
    const childRect = childRef?.getBoundingClientRect();

    if (!childRect) return;

    // Check if the child element is fully within the parent container
    const isInView =
      childRect.top >= parentRect.top &&
      childRect.right <= parentRect.right &&
      childRect.bottom <= parentRect.bottom &&
      childRect.left >= parentRect.left;

    if (!isInView) {
      childRef.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "center",
      });
    }
  };

  useEffect(() => {
    if (parentRef.current) {
      scrollIntoView();
    }
  }, [router.query.app, parentRef, scrollIntoView]);

  return (
    <Container>
      {isLoading && <Loader />}
      {/* <ExtraContainer>
        <AppBtn>
          <h4>Lang</h4>
        </AppBtn>
      </ExtraContainer> */}
      <ScrollContainer
        ref={parentRef}
        onWheel={(e) => {
          e.currentTarget.scrollLeft += e.deltaY;
        }}
      >
        {data.webapps.map((app, idx) => (
          <AppBtn
            id={app._id}
            selected={router.query.app === app._id}
            key={app._id}
            onClick={() =>
              router.push({
                pathname: router.pathname,
                query: { app: app._id },
              })
            }
          >
            <h4>{_.startCase(app.name)}</h4>
            <p>{app.name}</p>
          </AppBtn>
        ))}
      </ScrollContainer>
      <ModalHook componentToShow={<CreateTranslationAppModal />}>
        {({ openModal }) => (
          <ExtraContainer>
            <AppBtn onClick={() => openModal()}>
              <h4>
                <FaPlus /> Create New
              </h4>
            </AppBtn>
          </ExtraContainer>
        )}
      </ModalHook>
    </Container>
  );
};

export default TranslationApps;
