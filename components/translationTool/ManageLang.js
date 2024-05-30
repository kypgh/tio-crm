import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import translationToolAgent from "../../utils/translationToolAgent";
import styled from "styled-components";
import { Switch } from "../generic";
import { ActionButton } from "../generic";

const Outest = styled.div`
  max-width: 500px;
  margin: auto;
  background-color: ${({ theme }) => theme.secondary};
  padding: 10px;
  border-radius: 7px;
`;

const Outer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  max-width: 500px;
`;

const Lang = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  flex: 1 1 100px;
`;

const BtnsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  gap: 15px;
  flex: 1;
  margin: 5px 0;
`;

const ManageLang = ({ app, onChange = () => {}, ...rest }) => {
  const { data } = useQuery({
    queryKey: ["translationTool", "getAllLangs", app?._id],
    queryFn: () => translationToolAgent().getAllLanguages(),
  });

  const [selectedLangs, setSelectedLangs] = useState(app?.languages ?? []);

  useEffect(() => {
    onChange(selectedLangs);
  }, [selectedLangs]);

  useEffect(() => {
    setSelectedLangs(app?.languages ?? []);
  }, [app]);

  return (
    <Outest {...rest}>
      <BtnsContainer>
        <ActionButton
          invert={true}
          onClick={() => {
            setSelectedLangs(
              data?.languages?.map((lang) => ({
                code: lang.code,
                name: lang.name,
              }))
            );
          }}
        >
          Select all
        </ActionButton>
        <ActionButton
          invert={true}
          onClick={() => {
            setSelectedLangs([]);
          }}
        >
          Unselect all
        </ActionButton>
      </BtnsContainer>
      <Outer>
        {data?.languages?.map((lang) => (
          <Lang key={lang.code}>
            <Switch
              checked={selectedLangs.map((el) => el.code).includes(lang.code)}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedLangs((prev) => [
                    ...prev,
                    { code: lang.code, name: lang.name },
                  ]);
                } else {
                  setSelectedLangs((prev) =>
                    prev.filter(({ code }) => code !== lang.code)
                  );
                }
              }}
              id={lang.code}
            />
            <label htmlFor={lang.code}>{lang.name}</label>
          </Lang>
        ))}
      </Outer>
    </Outest>
  );
};

export default ManageLang;
