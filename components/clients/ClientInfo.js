import React from "react";
import styled from "styled-components";

import { DateTime } from "luxon";
import {
  formatCurrency,
  getCountryObject,
  getDeviceIcon,
} from "../../utils/helpers";
import PCR from "../PCR";
import { Loader } from "../generic";
import { useClientExtraDetails } from "../../utils/hooks/serverHooks";
import { AiFillCheckCircle, AiFillWarning } from "react-icons/ai";
import useTheme from "../../utils/hooks/useTheme";

const BoxOuter = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.primary};
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.brand};
    border-radius: 50px;
  }
`;

const RowInfo = styled.div`
  display: flex;
  /* align-items: stretch; */
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 100%;
  padding: 10px;
  border-bottom: 1px solid ${({ theme }) => theme.secondary};

  &:last-child {
    border-bottom: none;
  }
`;

const RowInfoHeader = styled.div`
  display: flex;
  /* align-items: stretch; */
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 100%;
  padding: 10px 8px;
  border-bottom: 1px solid ${({ theme }) => theme.secondary};
  color: ${({ theme }) => theme.blue};
  font-weight: 900;
  opacity: 0.6;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05rem;
  background-color: ${({ theme }) => theme.secondary};
`;

const Label = styled.div`
  color: ${({ theme }) => theme.white};
  font-size: 12px;
  font-weight: 700;
  opacity: 0.6;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  & svg {
    display: flex;
  }
`;

const UserInfo = styled.div`
  color: ${({ theme }) => theme.white};
  font-size: 12px;
  text-align: right;
  display: flex;
  justify-content: center;
  align-items: center;
  line-break: anywhere;
  overflow-wrap: anywhere;

  & a {
    color: ${({ theme }) => theme.blue};
    font-weight: 700;
  }
`;

const Section = styled.div`
  position: relative;
  display: flex;
  flex-wrap: wrap;
`;

export default function ClientInfo({ user }) {
  const { data: extraInfo, isLoading } = useClientExtraDetails(user._id, {
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    initialData: {},
  });

  const { theme } = useTheme();
  return (
    <BoxOuter>
      <RowInfoHeader>Client Info</RowInfoHeader>
      <RowInfo>
        <Label>Client ID</Label>
        <UserInfo>{user?.readableId}</UserInfo>
      </RowInfo>
      <RowInfo>
        <Label>
          Email
          {user.flags?.emailVerified ? (
            <AiFillCheckCircle color={theme.success} />
          ) : (
            <AiFillWarning color={theme.pendingColor} />
          )}
        </Label>
        <UserInfo>{user?.email}</UserInfo>
      </RowInfo>

      <RowInfo>
        <Label>Secondary Email</Label>
        <UserInfo>{user?.secondaryEmail}</UserInfo>
      </RowInfo>

      <RowInfo>
        <Label>First Name</Label>
        <UserInfo style={{ textTransform: "capitalize" }}>
          {user?.first_name}
        </UserInfo>
      </RowInfo>
      <RowInfo>
        <Label>Last Name</Label>
        <UserInfo style={{ textTransform: "capitalize" }}>
          {user?.last_name}
        </UserInfo>
      </RowInfo>
      <RowInfo>
        <Label>Title</Label>
        <UserInfo>{user?.title}</UserInfo>
      </RowInfo>
      <RowInfo>
        <Label>Gender</Label>
        <UserInfo style={{ textTransform: "capitalize" }}>
          {user?.gender}
        </UserInfo>
      </RowInfo>
      <RowInfo>
        <Label>Date of birth</Label>
        <UserInfo>
          {user.hasOwnProperty("dob")
            ? DateTime.fromISO(user?.dob).toFormat("dd/MM/yyyy ")
            : "N/A"}
        </UserInfo>
      </RowInfo>

      <RowInfo>
        <Label>Phone</Label>
        <UserInfo>
          <a href={`tel:${user?.phone}`}>{user?.phone}</a>
        </UserInfo>
      </RowInfo>
      <RowInfo>
        <Label>ID number</Label>
        <UserInfo>{user?.identificationNumber}</UserInfo>
      </RowInfo>
      <RowInfo>
        <Label>Nationality</Label>
        <UserInfo>{user?.nationality}</UserInfo>
      </RowInfo>
      <RowInfo>
        <Label>Country</Label>
        <UserInfo>{getCountryObject(user?.country).name}</UserInfo>
      </RowInfo>
      <RowInfo>
        <Label>City</Label>
        <UserInfo style={{ textTransform: "capitalize" }}>
          {user?.city ?? user?.metadata?.city}
        </UserInfo>
      </RowInfo>
      <RowInfo>
        <Label>Address</Label>
        <UserInfo>{user?.address}</UserInfo>
      </RowInfo>
      <RowInfo>
        <Label>House number</Label>
        <UserInfo>{user?.houseNumber}</UserInfo>
      </RowInfo>
      <RowInfo>
        <Label>Unit number</Label>
        <UserInfo>{user?.unitNumber}</UserInfo>
      </RowInfo>
      <RowInfo>
        <Label>Postal code</Label>
        <UserInfo>{user?.postcode}</UserInfo>
      </RowInfo>
      <RowInfo>
        <Label>Language</Label>
        <UserInfo>{user?.language || user?.metadata?.language}</UserInfo>
      </RowInfo>
      <RowInfo>
        <Label>Created At</Label>
        <UserInfo>
          {DateTime.fromISO(user?.createdAt).toFormat("dd/MM/yyyy | HH:mm:ss")}
        </UserInfo>
      </RowInfo>
      <RowInfo>
        <Label>Last Login</Label>
        <UserInfo>
          {DateTime.fromISO(user?.last_login).toFormat("dd/MM/yyyy | HH:mm:ss")}
        </UserInfo>
      </RowInfo>
      <RowInfo>
        <Label>Last update</Label>
        <UserInfo>
          {DateTime.fromISO(user?.updatedAt).toFormat("dd/MM/yyyy | HH:mm:ss")}
        </UserInfo>
      </RowInfo>
      <RowInfo>
        <Label>Regulation</Label>
        <UserInfo>{user?.entity}</UserInfo>
      </RowInfo>
      <RowInfo>
        <Label>Device</Label>
        <UserInfo>{getDeviceIcon(user?.metadata?.deviceType)}</UserInfo>
      </RowInfo>
      <RowInfo>
        <Label>IP</Label>
        <UserInfo>{user?.metadata?.ip}</UserInfo>
      </RowInfo>
      <RowInfo>
        <Label>IP Country</Label>
        <UserInfo>
          {getCountryObject(user?.metadata?.ip_country)?.name}
        </UserInfo>
      </RowInfo>
      <RowInfo>
        <Label>IP City</Label>
        <UserInfo>{user?.metadata?.ip_city}</UserInfo>
      </RowInfo>
      {user?.ctrader_id && (
        <RowInfo>
          <Label>cTrader ID</Label>
          <UserInfo>{user?.ctrader_id}</UserInfo>
        </RowInfo>
      )}
      {user?.mt5_id && (
        <RowInfo>
          <Label>MT5 ID</Label>
          <UserInfo>{user?.mt5_id}</UserInfo>
        </RowInfo>
      )}
      <PCR.viewUserExtraDetails>
        <RowInfoHeader>Accounts Info</RowInfoHeader>
        <Section>
          {isLoading && <Loader />}
          <RowInfo>
            <Label>Status (KYC)</Label>
            <UserInfo>{user?.flags?.kycStatus?.toUpperCase()}</UserInfo>
          </RowInfo>
          <RowInfo>
            <Label>Live (#)</Label>
            <UserInfo>{extraInfo?.liveAccounts}</UserInfo>
          </RowInfo>
          <RowInfo>
            <Label>Demo (#)</Label>
            <UserInfo>{extraInfo?.demoAccounts}</UserInfo>
          </RowInfo>
          <RowInfo>
            <Label>Balance</Label>
            <UserInfo>{formatCurrency(extraInfo?.balance, "USD")}</UserInfo>
          </RowInfo>
          <RowInfo>
            <Label>FTD Date</Label>
            <UserInfo>
              {extraInfo?.ftdDate !== "N/A"
                ? DateTime.fromISO(extraInfo?.ftdDate).toFormat(
                    "dd/MM/yyyy | HH:mm:ss"
                  )
                : "N/A"}
            </UserInfo>
          </RowInfo>
          <RowInfo>
            <Label>FTD Amount</Label>
            <UserInfo>
              {extraInfo?.ftdAmount === "N/A"
                ? extraInfo?.ftdAmount
                : formatCurrency(extraInfo?.ftdAmount, "USD")}
            </UserInfo>
          </RowInfo>

          <RowInfo>
            <Label>Volume</Label>
            <UserInfo>{extraInfo?.totalVolume ?? "N/A"} lots</UserInfo>
          </RowInfo>
          <RowInfo>
            <Label>Total Deposits</Label>
            <UserInfo>
              {formatCurrency(extraInfo?.totalDeposits, "USD")}
            </UserInfo>
          </RowInfo>
          <RowInfo>
            <Label>Total Withdrawals</Label>
            <UserInfo>
              {formatCurrency(extraInfo?.totalWithdrawals, "USD")}
            </UserInfo>
          </RowInfo>
          <RowInfo>
            <Label>Credit Deposits</Label>
            <UserInfo>
              {formatCurrency(extraInfo?.totalCreditDeposits, "USD")}
            </UserInfo>
          </RowInfo>
          <RowInfo>
            <Label>Credit Withdrawals</Label>
            <UserInfo>
              {formatCurrency(extraInfo?.totalCreditWithdrawals, "USD")}
            </UserInfo>
          </RowInfo>
        </Section>
      </PCR.viewUserExtraDetails>
      <RowInfoHeader>Marketing</RowInfoHeader>
      <RowInfo>
        <Label>Campaign</Label>
        <UserInfo>{user?.metadata?.utm_campaign ?? "N/A"}</UserInfo>
      </RowInfo>
      <RowInfo>
        <Label>Source</Label>
        <UserInfo>{user?.metadata?.utm_source ?? "N/A"}</UserInfo>
      </RowInfo>
      <RowInfo>
        <Label>Medium</Label>
        <UserInfo>{user?.metadata?.utm_medium ?? "N/A"}</UserInfo>
      </RowInfo>
      <RowInfo>
        <Label>Content</Label>
        <UserInfo>{user?.metadata?.utm_content ?? "N/A"}</UserInfo>
      </RowInfo>
      <RowInfo>
        <Label>Term</Label>
        <UserInfo>{user?.metadata?.utm_term ?? "N/A"}</UserInfo>
      </RowInfo>
    </BoxOuter>
  );
}
