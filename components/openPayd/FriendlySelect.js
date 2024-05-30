import { useEffect, useState } from "react";
import styled from "styled-components";
import { InputField } from "../formComponents/FormGeneric";
import useDebounce from "../../utils/hooks/useDebounce";
import axios from "axios";
import agent, { getJWTToken } from "../../utils/agent";
import { AiFillCaretDown } from "react-icons/ai";
import { RxReset } from "react-icons/rx";

const Relative = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 5px;

  & > label {
    color: ${({ theme }) => theme.textPrimary};
    font-weight: 700;
    display: flex;
    align-items: center;
  }
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  background-color: ${({ theme }) => theme.primary};
  border-radius: 5px;
  cursor: pointer;
  padding: 2px;

  & > svg {
    width: 100%;
    height: 100%;
    color: ${({ theme }) => theme.textPrimary};
  }
`;

const Absolute = styled.div`
  position: absolute;
  top: calc(100% + 3px);
  left: 0;
  width: 100%;
  background-color: ${({ theme }) => theme.primary};
  border-radius: 5px;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.2);
  z-index: 10000;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  max-height: 200px;
  overflow-y: auto;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  color: ${({ theme }) => theme.textPrimary};
  font-weight: 600;
  font-size: 14px;
  padding: 1px 3px;

  &:hover {
    background-color: ${({ theme }) => theme.secondary};
  }
`;

const FriendlySelect = ({ onChange }) => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  useDebounce(search, 500, async (value) => {
    let params;
    if (value) {
      params = {
        friendlyName: value,
      };
    }
    await axios({
      method: "get",
      url: "/api/openPayd/getListLinkedClient",
      headers: {
        authorization: `Bearer ${getJWTToken()}`,
      },
      params,
    })
      .then((res) => {
        setData(res.data.content);
        setIsOpen(true);
      })
      .catch(async (err) => {
        if (err?.response?.status === 401) {
          await agent().refreshAccessToken();
        }
      });
  });

  useEffect(() => {
    onChange(selected || {});
  }, [selected]);

  return (
    <Relative>
      <label htmlFor="friendlyName">Friendly Name</label>
      <InputContainer>
        {selected ? (
          <>
            <InputField
              id={"friendlyNameReadonly"}
              readonly
              value={selected.friendlyName}
            />
            <IconContainer
              onClick={() => {
                setSelected(null);
                setIsOpen(false);
                setSearch("");
              }}
            >
              <RxReset />
            </IconContainer>
          </>
        ) : (
          <>
            <InputField
              id={"friendlyName"}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <IconContainer
              onClick={() => {
                setIsOpen(!isOpen);
              }}
            >
              <AiFillCaretDown />
            </IconContainer>
          </>
        )}
      </InputContainer>
      {isOpen && (
        <Absolute>
          {data.length > 0 ? (
            data.map((item) => (
              <Item
                key={item.id}
                onClick={() => {
                  setSelected(item);
                  setIsOpen(false);
                }}
              >
                {item.friendlyName}
              </Item>
            ))
          ) : (
            <Item>No results</Item>
          )}
        </Absolute>
      )}
    </Relative>
  );
};

export default FriendlySelect;
