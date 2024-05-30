import { useRouter } from "next/router";
import React, { useEffect, useRef } from "react";
import { Reorder, motion } from "framer-motion";
import Link from "next/link";
import styled, { useTheme } from "styled-components";
import { RiCloseFill } from "react-icons/ri";
import { MdOutlineDragHandle } from "react-icons/md";
import { HiUserGroup } from "react-icons/hi";
import { useQueryClient } from "@tanstack/react-query";
import { useSessionStorage } from "usehooks-ts";
import { useClientDetailsByID } from "../../utils/hooks/serverHooks";
import useSelectedBrand from "../../utils/hooks/useSelectedBrand";

const VisitedClientsContainer = styled.div`
  display: flex;
  width: 100%;
  height: 35px;
  padding-bottom: 5px;
  z-index: 10;
  background-color: ${({ theme }) => theme.secondary};
  position: sticky;
  top: 0;
  align-items: flex-start;
  /* max-width: calc(100vw - 280px); */
  margin-left: 15px;
  & ul {
    max-width: calc(100vw - 290px);
    overflow-x: auto;
    overflow-y: hidden;
    width: 100%;

    display: flex;
    list-style: none;
    &::-webkit-scrollbar {
      width: 2px;
      height: 4px;
    }
    &::-webkit-scrollbar-track {
      background: ${({ theme }) => theme.primary};
      border-radius: 50px;
      border-radius: 50px;
    }
    &::-webkit-scrollbar-thumb {
      background: ${({ theme }) => theme.blue};
      border-radius: 50px;
    }
  }
`;
const ClientItem = styled.div`
  display: flex;
  margin-right: 5px;
  padding: 0px 5px;
  min-width: 100px;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.primary};
  opacity: 0.5;

  &.isClients {
    opacity: 1;
  }
  &.isClients a {
    font-weight: 700;
    font-size: 12px;
    padding: 1.5px 0px;
    color: ${({ theme }) => theme.textSecondary};
  }
  &.isClients svg {
    margin-right: 5px;
  }

  & a {
    padding-left: 5px;
    padding-bottom: 5px;
    font-size: 14px;
    text-decoration: none;
    color: ${({ theme }) => theme.textSecondary};
    &.active {
      color: ${({ theme }) => theme.brand};
    }
    margin-right: 5px;
    & small {
      font-weight: 700;
      font-size: xx-small;
    }
  }
  &.active {
    opacity: 1;
  }
`;

const Name = styled.div`
  color: ${({ theme }) => theme.textSecondary};
  font-size: x-small;
  max-width: 60px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const RemoveClientItemButton = styled.div`
  justify-content: center;
  align-items: center;
  display: flex;
  /* margin-left: auto; */
  cursor: pointer;
`;

const VisitedClientsBar = () => {
  const theme = useTheme();
  const reOrderGroupRef = useRef(null);
  const queryClient = useQueryClient();
  const router = useRouter();
  const [selectedBrand] = useSelectedBrand();
  const [visitedClients, setVisitedClients] = useSessionStorage(
    `${selectedBrand}-visitedClients`,
    []
  );

  useEffect(() => {
    try {
      let visitedClients = JSON.parse(
        window.sessionStorage.getItem(`${selectedBrand}-visitedClients`) || []
      );
      setVisitedClients(visitedClients);
    } catch (err) {
      setVisitedClients([]);
      console.error("failed to load visited clients");
    }
  }, [selectedBrand]);

  useClientDetailsByID(router.query.clientId, {
    onSuccess: ({ user }) => {
      if (
        visitedClients.findIndex((c) => c._id === router.query.clientId) === -1
      ) {
        const newClients = [
          ...visitedClients,
          {
            _id: user._id,
            readableId: user?.readableId,
            order: visitedClients.length,
            name: user?.first_name + " " + user?.last_name,
          },
        ];
        setVisitedClients(newClients);
      }
    },
    enabled: !!router.query.clientId,
  });
  function addVisitedClient(id) {
    if (visitedClients.findIndex((c) => c._id === id) === -1) {
      let data = queryClient.getQueryData(["user", id]);
      if (!data) return;
      const newClients = [
        ...visitedClients,
        {
          _id: id,
          readableId: data?.readableId,
          order: visitedClients.length,
          name: data?.first_name + " " + data?.last_name,
        },
      ];
      setVisitedClients(newClients);
    }
  }

  function removeVisitedClient(id) {
    const newClients = visitedClients.filter((item) => item._id !== id);
    setVisitedClients(newClients);
  }

  function reorderVisitedClients(newOrder) {
    setVisitedClients((prev) =>
      prev.map((item, i) => ({
        ...item,
        order: newOrder.indexOf(item._id),
      }))
    );
  }

  useEffect(() => {
    if (router.query.hasOwnProperty("clientId")) {
      addVisitedClient(router.query.clientId);
    }
  }, [router.route]);
  const orderedClients = visitedClients.sort((a, b) => a.order - b.order);
  if (visitedClients.length === 0) return null;
  return (
    <VisitedClientsContainer as={motion.div}>
      <ClientItem className="isClients">
        <HiUserGroup size={14} color={theme.textSecondary} />
        <Link
          href={{
            pathname: "/clients/",
          }}
        >
          CLIENTS
        </Link>
      </ClientItem>
      <Reorder.Group
        ref={reOrderGroupRef}
        onWheel={(e) => {
          reOrderGroupRef.current.scrollLeft += e.deltaY;
        }}
        axis="x"
        values={orderedClients.map((item) => item._id)}
        onReorder={reorderVisitedClients}
      >
        {orderedClients.map((x) => {
          return (
            <Reorder.Item key={x._id} value={x._id}>
              <ClientItem
                className={
                  router.query?.clientId === x._id ? "active" : undefined
                }
              >
                <Link href={`/clients/${x._id}`} passHref>
                  <a
                    className={
                      router.query?.clientId === x._id ? "active" : undefined
                    }
                  >
                    <small>ID:</small> {x.readableId} <Name>{x.name}</Name>
                  </a>
                </Link>
                <MdOutlineDragHandle
                  size={16}
                  color={theme.white}
                  style={{
                    opacity: "0.2",
                    cursor: "grabbing",
                  }}
                />
                <RemoveClientItemButton
                  onClick={() => {
                    removeVisitedClient(x._id);
                  }}
                >
                  <RiCloseFill size={18} color={theme.white} />
                </RemoveClientItemButton>
              </ClientItem>
            </Reorder.Item>
          );
        })}
      </Reorder.Group>
    </VisitedClientsContainer>
  );
};

export default VisitedClientsBar;
