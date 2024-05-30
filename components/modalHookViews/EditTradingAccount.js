import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { LEVERAGES } from "../../config/enums";
import agent from "../../utils/agent";
import {
  useGetClientAccountDetails,
  useGetUserAccountTypes,
} from "../../utils/hooks/serverHooks";
import { Select } from "../formComponents/FormGeneric";
import { ActionButton, ButtonBlue, Loader, Switch } from "../generic";
import { useNotification } from "../actionNotification/NotificationProvider";

const Outer = styled.div`
  display: flex;
  /* flex-direction: column; */
  width: 100%;
  flex-wrap: wrap;
  min-height: 150px;
  background-color: ${({ theme }) => theme.secondary};
  border-radius: 3px;
  padding: 0 20px;
  position: relative;
  max-width: 1200px;
  position: relative;
`;

const Half = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  gap: 5px;
  padding: 5px;
`;

const TopRow = styled.div`
  border-bottom: 2px solid ${({ theme }) => theme.primary};
  width: calc(100% + 40px);
  margin-left: -20px;
  margin-right: -20px;
  padding: 15px;
  & h2 {
    font-size: 14px;
    opacity: 0.78;
  }
`;

const BottomRow = styled.div`
  border-top: 2px solid ${({ theme }) => theme.primary};
  width: calc(100% + 40px);
  margin-left: -20px;
  margin-right: -20px;
  margin-top: 20px;
  padding: 15px;
`;

const RowSc = styled.div`
  padding: 5px;
  background-color: ${({ theme }) => theme.primary};
  border-radius: 7px;
  display: flex;
  align-items: center;
  min-height: 50px;
  position: relative;

  & > strong {
    min-width: 50%;
  }
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  justify-content: flex-end;
`;

const EditTradingAccount = ({ account, closeModal }) => {
  const { data, isLoading } = useGetClientAccountDetails(account._id, {
    onSuccess: (data) => {
      setPermissions(data?.permissions);
    },
  });
  const { data: accountTypes, isLoading: accountTypesIsLoading } =
    useGetUserAccountTypes({
      user_id: account?.user?._id,
    });

  const [onSaveActions, setOnSaveActions] = useState({});
  const [typeAndLeverage, setTypeAndLeverage] = useState({
    accType: account?.account_type,
    leverage: account?.leverage,
  });
  const [permissions, setPermissions] = useState(data?.permissions);
  const notify = useNotification();
  const editAccTypeAndLeverage = useMutation(
    ({ leverage, accType }) =>
      agent().updateClientAccount(account._id, leverage, accType),
    {
      mutationKey: ["updateAccTypeAndLeverage"],
      onSuccess: () => {
        notify.SUCCESS("Account Type and Leverage updated successfully");
      },
      onError: (err) => {
        notify.ERROR("Error updating account type and leverage");
      },
    }
  );

  const editAccountPermissions = useMutation(
    (val) => agent().updateAccountPermissions(account._id, val),
    {
      mutationKey: ["updateAccountPermissions"],
      onSuccess: () => {
        notify.SUCCESS("Account permissions updated successfully");
      },
      onError: (err) => {
        notify.ERROR("Error updating account permissions");
      },
    }
  );

  useEffect(() => {
    setOnSaveActions((prev) => ({
      ...prev,
      account_type_leverage: {
        fn: (value) =>
          new Promise((res, rej) =>
            editAccTypeAndLeverage.mutate(value, {
              onSuccess: (val) => {
                res(val);
              },
              onError: (err) => {
                rej(err);
              },
            })
          ),
        val: typeAndLeverage,
      },
    }));
  }, [typeAndLeverage]);

  useEffect(() => {
    setOnSaveActions((prev) => ({
      ...prev,
      permissions: {
        fn: (value) =>
          new Promise((res, rej) =>
            editAccountPermissions.mutate(value, {
              onSuccess: (val) => {
                res(val);
              },
              onError: (err) => {
                rej(err);
              },
            })
          ),
        val: permissions,
      },
    }));
  }, [permissions]);

  if (isLoading || accountTypesIsLoading)
    return (
      <Outer>
        <Loader />
      </Outer>
    );

  return (
    <Outer>
      <TopRow>
        <h2>
          Settings for account {account?.login_id} ({account?.account_type})
        </h2>
      </TopRow>
      <Half>
        <Row label={"First Name:"}>
          <span>{account?.user?.first_name}</span>
        </Row>
        <Row label={"Last Name:"}>
          <span>{account?.user?.last_name}</span>
        </Row>
        <Row label={"Email:"}>
          <span>{account?.user?.email}</span>
        </Row>
        <Row label={"Balance:"}>
          <span>{account?.balance}</span>
        </Row>
        <Row label={"Equity:"}>
          <span>{account?.equity}</span>
        </Row>
        <Row label={"Margin:"}>
          <span>{account?.used_margin}</span>
        </Row>
        <Row label={"Free Margin:"}>
          <span>{account?.free_margin}</span>
        </Row>
        {/* <Row label={"Group:"}>
          <span>{account?.group}</span>
        </Row>
        <Row label={"Platform:"}>
          <span>{account?.platform}</span>
        </Row> */}
        <Row label={"Currency:"}>
          <span>{account?.currency}</span>
        </Row>
      </Half>
      <Half>
        <Row label={"Account Type:"}>
          <Select
            invert
            value={typeAndLeverage.accType}
            style={{
              width: "100%",
            }}
            onChange={(e) => {
              setTypeAndLeverage((prev) => ({
                accType: e.target.value,
                leverage: "",
              }));
            }}
          >
            {accountTypes[account.platform].map(({ name, value }, idx) => (
              <option value={value} key={idx}>
                {name}
              </option>
            ))}
          </Select>
        </Row>
        <Row label={"Leverage:"}>
          <Select
            invert
            value={typeAndLeverage.leverage}
            style={{
              width: "100%",
            }}
            onChange={(e) => {
              setTypeAndLeverage((prev) => ({
                ...prev,
                leverage: e.target.value,
              }));
            }}
          >
            <option value={""} disabled>
              Select Leverage
            </option>
            {accountTypes[account.platform]
              .find((el) => el.value === typeAndLeverage.accType)
              ?.leverages.map((item, idx) => (
                <option value={item} key={idx}>
                  {item}
                </option>
              ))}
          </Select>
        </Row>
        <Row label={"Enable:"}>
          <Switch
            invert
            defaultChecked={data?.permissions?.enabled}
            onChange={(e) => {
              setPermissions((prev) => ({
                ...prev,
                enabled: e.target.checked,
              }));
            }}
          />
        </Row>
        <Row label={"Enable Change Password:"}>
          <Switch
            invert
            disabled={account?.platform === "ctrader"}
            {...(account?.platform === "ctrader"
              ? {
                  checked: true,
                }
              : { defaultChecked: data?.permissions?.enable_change_password })}
            onChange={(e) => {
              setPermissions((prev) => ({
                ...prev,
                enable_change_password: e.target.checked,
              }));
            }}
          />
        </Row>
        <Row label={"Read Only:"}>
          <Switch
            invert
            defaultChecked={data?.permissions?.read_only}
            onChange={(e) => {
              setPermissions((prev) => ({
                ...prev,
                read_only: e.target.checked,
              }));
            }}
          />
        </Row>
        <Row label={"Send Reports:"}>
          <Switch
            invert
            defaultChecked={data?.permissions?.enable_send_reports}
            onChange={(e) => {
              setPermissions((prev) => ({
                ...prev,
                enable_send_reports: e.target.checked,
              }));
            }}
          />
        </Row>
        <Row label={"Group:"}>
          <span>{account?.group}</span>
        </Row>
        <Row label={"Platform:"}>
          <span>{account?.platform}</span>
        </Row>
      </Half>
      <BottomRow
        style={{
          alignItems: "flex-end",
        }}
      >
        <Flex>
          <ButtonBlue
            disabled={
              editAccTypeAndLeverage.isLoading ||
              editAccountPermissions.isLoading
            }
            style={{
              minWidth: "100px",
              textAlign: "center",
              justifyContent: "center",
            }}
            onClick={async () => {
              try {
                for (const action of Object.values(onSaveActions)) {
                  await action.fn(action.val);
                }
                closeModal();
              } catch (error) {
                console.error("Error executing mutations:", error);
              }
            }}
          >
            Save
          </ButtonBlue>
          <ActionButton
            style={{
              minWidth: "100px",
              textAlign: "center",
              justifyContent: "center",
            }}
            invert
            onClick={() => {
              closeModal();
            }}
          >
            Cancel
          </ActionButton>
        </Flex>
      </BottomRow>
    </Outer>
  );
};

export default EditTradingAccount;

const Row = ({ label, children }) => {
  return (
    <RowSc>
      <strong>{label}</strong>
      {children}
    </RowSc>
  );
};
