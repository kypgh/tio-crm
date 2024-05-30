import { useState } from "react";
import styled, { useTheme } from "styled-components";
import { getAccountIdString } from "../../utils/helpers";
import { useSearchClientByField } from "../../utils/hooks/serverHooks";
import useDebounce from "../../utils/hooks/useDebounce";
import { Select } from "../formComponents/FormGeneric";
import InputTextWithSuggestions from "../formComponents/InputTextWithSuggestions";

const SuggestionDetailsMini = styled.div`
  width: 100%;
  overflow: hidden;
  font-size: 0.8rem;
  & p {
    color: ${({ theme }) => theme.textSecondary};
    overflow: hidden;
    text-overflow: ellipsis;
    &.id-tag {
      color: ${({ theme }) => theme.textPrimary};
      font-weight: 500;
    }
  }

  & > div {
    display: grid;
    grid-template-columns: 1fr auto auto;
    gap: 5px;
    & p:first-child {
      color: ${({ theme }) => theme.textPrimary};
      font-size: 1rem;
    }
  }

  & .searchField {
    color: ${({ theme }) => theme.brand};
  }
  & .label {
    color: ${({ theme }) => theme.textSecondary};
    margin-right: 5px;
    font-size: xx-small;
  }
`;

const Border = styled.div`
  background-color: ${({ theme }) => theme.secondary};
  border-radius: 5px;
`;

const SuggestionCard = ({ client, searchKey }) => {
  return (
    <SuggestionDetailsMini>
      <p
        className={
          (searchKey === "readableId" ? "searchField" : "") + " id-tag"
        }
      >
        <small className="label">ID:</small>
        {client.readableId}
      </p>
      <p className={searchKey === "name" ? "searchField" : ""}>
        {client.first_name} {client.last_name}
      </p>
      <p className={searchKey === "email" ? "searchField" : ""}>
        {client.email}
      </p>
      {searchKey === "ctrader_id" && (
        <small className="searchField">cTrader ID: {client.ctrader_id}</small>
      )}
      {searchKey === "mt5_id" && (
        <small className="searchField">MT5 ID: {client.mt5_id}</small>
      )}
      {searchKey === "phone" && (
        <small className="searchField">{client.phone}</small>
      )}
      {searchKey === "id" && (
        <small className="searchField">{client._id}</small>
      )}
      {searchKey === "account" && (
        <small className="searchField">
          {getAccountIdString(client.account)}
        </small>
      )}
    </SuggestionDetailsMini>
  );
};

const SearchUserInputAutocomplete = ({
  value,
  setValue,
  style,
  suggestionsStyle,
  placeholder = "Search for a user by ID, name, or email",
  onSelectSuggestion,
  onKeyDown,
  ...props
}) => {
  const theme = useTheme();
  const [field, setField] = useState("readableId");

  const { debouncedValue } = useDebounce(value, 500);

  const { data, isFetching } = useSearchClientByField(field, debouncedValue, {
    enabled: debouncedValue.length > 0,
  });
  return (
    <Border>
      <Select
        style={{
          width: "100%",
          backgroundColor:
            theme.name == "light" ? theme.primary : theme.secondary,
          borderBottom: `1px solid ${theme.primary}`,
          borderRadius: "5px 5px 0px 0px",
        }}
        value={field}
        onChange={(e) => setField(e.target.value)}
      >
        <option value="readableId">Client ID</option>
        {/* <option value="ctrader_id">cTrader ID</option>
        <option value="mt5_id">MT5 ID</option> */}
        <option value="account">Account ID</option>
        <option value="name">Name</option>
        <option value="email">Email</option>
        <option value="phone">Phone</option>
        <option value="id">Internal ID</option>
      </Select>
      <InputTextWithSuggestions
        value={value}
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
        isLoading={isFetching}
        style={style}
        suggestionsStyle={suggestionsStyle}
        onSelectSuggestion={onSelectSuggestion}
        suggestions={
          !!data
            ? data?.map((client) => ({
                value: client._id,
                label: <SuggestionCard client={client} searchKey={field} />,
              }))
            : []
        }
        {...props}
      />
    </Border>
  );
};

export default SearchUserInputAutocomplete;
