import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { v4 as uuid } from "uuid";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { colors } from "../../config/colors";
import { FormTitle } from "../formComponents/FormGeneric";
import { AddBtn, Loader } from "../generic";
import agent from "../../utils/agent";
import { useNotification } from "../actionNotification/NotificationProvider";
import RibbonItem from "./RibbonItem";
import PCR, { usePermissions } from "../PCR";
import { PERMISSIONS } from "../../config/permissions";
import { useRibbons } from "../../utils/hooks/serverHooks";
import useSelectedBrand from "../../utils/hooks/useSelectedBrand";

const Outer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  background-color: ${({ theme }) => theme.primary};
  border-radius: 5px;
  padding: 20px;
  position: relative;
`;

const LoaderContainer = styled.div`
  /* position: relative; */
`;

const RibbonsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
`;

const CreateRibbon = ({ type, id, navigateToSegment, activeRibbon }) => {
  const [userRibbons, setUserRibbons] = useState([]);
  const [segmentRibbons, setSegmentRibbons] = useState([]);
  const queryClient = useQueryClient();

  const actionNotification = useNotification();
  const [selectedBrand] = useSelectedBrand();

  const { data, isLoading, isFetching } = useRibbons(type, id, {
    onSuccess: (res) => {
      setSegmentRibbons(res?.segmentRibbons || []);
      setUserRibbons(res?.userRibbons || []);
    },
    refetchOnMount: true,
  });

  const createRibbonMutation = useMutation(
    (ribbon) => {
      return agent().createRibbon(ribbon);
    },
    {
      mutationKey: ["sendRibbonToSegments", type, id],
      onSuccess: () => {
        actionNotification.SUCCESS("Ribbon created successfully");
        queryClient.invalidateQueries([selectedBrand, "ribbons"]);
      },
    }
  );
  const editExistingRibbon = useMutation(
    (ribbon) => {
      const ribbonId = ribbon._id;
      delete ribbon._id;
      return agent().editRibbon(ribbonId, ribbon);
    },
    {
      onSuccess: () => {
        actionNotification.SUCCESS("Ribbon saved successfully");
        queryClient.invalidateQueries([selectedBrand, "ribbons"]);
      },
      onError: () => {
        actionNotification.ERROR("Error saving ribbon");
      },
    }
  );

  return (
    <Outer>
      {type === "client" && (
        <>
          <FormTitle style={{ width: "100%" }}>User Ribbons</FormTitle>
          {isFetching && <Loader />}
          <RibbonsContainer>
            {userRibbons.map((r) => (
              <RibbonItem
                ribbon={r}
                key={r._id}
                active={activeRibbon === String(r._id)}
                onSave={(ribbon) => {
                  if (ribbon.type === "new") {
                    createRibbonMutation.mutate({
                      user_id: id,
                      color: ribbon.color,
                      title: ribbon.title,
                      url: ribbon.url,
                      isExternal: ribbon.isExternal,
                      enabled: ribbon.enabled,
                      closable: ribbon.closable,
                    });
                  } else {
                    editExistingRibbon.mutate({
                      _id: ribbon._id,
                      color: ribbon.color,
                      title: ribbon.title,
                      url: ribbon.url,
                      isExternal: ribbon.isExternal,
                      enabled: ribbon.enabled,
                      closable: ribbon.closable,
                      type: "user",
                    });
                  }
                }}
                onDelete={() => {
                  if (r.type === "new") {
                    setUserRibbons((prev) =>
                      prev.filter((rb) => rb._id !== r._id)
                    );
                  }
                }}
              />
            ))}
          </RibbonsContainer>
          {userRibbons.length === 0 && (
            <AddBtn
              disabled={userRibbons.length > 0}
              invert
              onClick={() => {
                setUserRibbons((v) => [
                  ...v,
                  {
                    _id: uuid(),
                    type: "new",
                    title: "",
                    url: "",
                    accountId: "",
                    color: "#000000",
                    enabled: true,
                    closable: true,
                  },
                ]);
              }}
            >
              Add Ribbon
            </AddBtn>
          )}
        </>
      )}
      <FormTitle style={{ width: "100%" }}>Segment Ribbons</FormTitle>
      <LoaderContainer>
        {isFetching && <Loader />}
        <RibbonsContainer>
          {segmentRibbons.map((r) => (
            <RibbonItem
              readOnly={type === "client"}
              ribbon={r}
              active={activeRibbon === String(r._id)}
              key={r._id}
              navigateToSegment={navigateToSegment}
              onSave={(ribbon) => {
                if (ribbon.type === "new") {
                  createRibbonMutation.mutate({
                    segment_id: id,
                    color: ribbon.color,
                    title: ribbon.title,
                    url: ribbon.url,
                    isExternal: ribbon.isExternal,
                    enabled: ribbon.enabled,
                    closable: ribbon.closable,
                  });
                } else {
                  editExistingRibbon.mutate({
                    _id: ribbon._id,
                    color: ribbon.color,
                    title: ribbon.title,
                    url: ribbon.url,
                    isExternal: ribbon.isExternal,
                    enabled: ribbon.enabled,
                    closable: ribbon.closable,
                    type: "segment",
                  });
                }
              }}
              onDelete={() => {
                if (r.type === "new") {
                  setSegmentRibbons((prev) =>
                    prev.filter((rb) => rb._id !== r._id)
                  );
                }
              }}
            />
          ))}
        </RibbonsContainer>
      </LoaderContainer>
      <PCR.createRibbon>
        {segmentRibbons.length === 0 && type !== "client" && (
          <AddBtn
            disabled={userRibbons.length > 0}
            invert
            onClick={() => {
              setSegmentRibbons((v) => [
                ...v,
                {
                  _id: uuid(),
                  type: "new",
                  title: "",
                  url: "",
                  accountId: "",
                  color: "#000000",
                  enabled: true,
                  closable: true,
                },
              ]);
            }}
          >
            Add Ribbon
          </AddBtn>
        )}
      </PCR.createRibbon>
    </Outer>
  );
};

export default CreateRibbon;
