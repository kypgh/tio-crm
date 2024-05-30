import { useState, useEffect, useMemo, useRef } from "react";

import styled from "styled-components";
import { useRouter } from "next/router";

import { IoMdClose } from "react-icons/io";
import { HiMenu } from "react-icons/hi";
import { FaPowerOff } from "react-icons/fa";
import { FaPaintBrush } from "react-icons/fa";

import { colors } from "../../config/colors";
import { Loader } from "../generic";
import agent from "../../utils/agent";
import Notifications from "../navigationbar/Notifications";
import { useMutation } from "@tanstack/react-query";
import SearchUserInputAutocomplete from "../smartComponents/SearchUserInputAutocomplete";
import useUser from "../../utils/hooks/useUser";
import useNavData from "../../utils/hooks/useNavData";
import NavigationLinks from "../navigationbar/NavigationLinks";
import useTheme from "../../utils/hooks/useTheme";
import AnimateHeight from "react-animate-height";
import Settings from "../navigationbar/Settings";
import NotificationBtn from "../buttons/NotificationBtn";
import SettingsBtn from "../buttons/SettingsBtn";
import TooltipWrapper from "../TooltipWrapper";
import { useDebounce } from "usehooks-ts";
import _ from "lodash";
import SelectTheme from "../navigationbar/SelectTheme";
import Logo from "../Logo";
import LogoSmall from "../LogoSmall";
import useOnClickAway from "../../utils/hooks/useOnClickAway";
import useSelectedBrand from "../../utils/hooks/useSelectedBrand";
import { BRANDS_MAP } from "../../config/enums";
import Image from "next/image";

const NavBar = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr auto;

  position: sticky;
  top: 0;
  left: 0;
  height: 100vh;
  max-width: 260px;
  width: 100%;
  background-color: ${({ theme }) =>
    theme.name == "light" ? "transparent" : theme.primary};
  animation: slide-in 0.3s ease both;
  /* box-shadow: ${({ theme }) => theme.navBarShadow}; */
  overflow: hidden;
  transition: all 0.15s linear;
  &.closeAnimation {
    animation: slide-out 0.3s ease both;
  }

  @media (max-width: 768px) {
    position: fixed;
    z-index: 5;
  }

  @keyframes slide-in {
    0% {
      max-width: 33px;
      opacity: 0;
    }
    100% {
      max-width: 260px;
      opacity: 1;
    }
  }

  @keyframes slide-out {
    0% {
      max-width: 260px;
      opacity: 1;
    }
    100% {
      max-width: 33px;
      opacity: 0;
    }
  }
`;

const NavBarClosed = styled.div`
  position: sticky;
  top: 0;
  left: 0;
  height: 100vh;
  animation: slide-in 0.3s ease both;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  flex-direction: column;
  width: 40px;
  margin-right: -14.7px;
  background-color: ${({ theme }) =>
    theme.name == "light" ? "transparent" : theme.primary};

  &.closeAnimation {
    animation: slide-out 0.3s ease both;
  }

  @media (max-width: 768px) {
    position: fixed;
    z-index: 5;
  }
`;

const NavBarInner = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #3a3f48;
  padding: 5px 15px;
  position: relative;
  & span {
    font-size: 16px;
    color: ${({ theme }) => theme.textSecondary};
    font-weight: 100;
    position: absolute;
    right: 80px;
    top: 15px;
  }
`;

const SmallLogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin: 18px 0px 15px 0px;
`;
const CloseButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &.isClosed {
    background-color: ${({ theme }) => theme.primary};
    border-radius: 5px;
    position: relative;
    padding: 3px;
  }
`;

const ProfileContainer = styled.div`
  border-bottom: 1px solid #3a3f48;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 15px;
  padding: 15px;
`;

const Profile = styled.div`
  color: ${({ theme }) => theme.textPrimary};
  min-width: 50%;
  & p {
    color: ${({ theme }) => theme.textSecondary};
  }
  & p.username {
    font-size: 14px;
  }
  & p.department {
    font-size: 12px;
  }
`;

const SearchContainer = styled.div`
  border-bottom: 1px solid #3a3f48;
  padding: 11px 15px;
`;

const BottomTabsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  gap: 15px;
  padding: 15px 5px 10px 5px;
  box-shadow: ${({ theme, isTabOpen }) => !isTabOpen && theme.bottomTabShadow};
  background-color: ${({ theme }) =>
    theme.name == "light" ? "transparent" : theme.primary};
`;

const BottomItem = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;

  svg {
    color: ${({ theme }) => theme.textSecondary};
    transition: 0.3s all ease;
  }
  &:hover svg {
    color: ${({ theme }) => theme.brand};
  }

  &.notification:before {
    content: ${({ count }) => (count > 0 ? `"${count}"` : "")};
    background-color: ${({ theme }) => theme.blue};
    color: ${({ theme }) => theme.textPrimary};
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 15px;
    height: 15px;
    font-size: 10px;
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(100%, -60%);
  }

  &.settings:before {
    content: "";
    background-color: red;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 7px;
    height: 7px;
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(80%, -60%);
  }
`;

const ProfileImage = styled.div`
  height: 50px;
  width: 50px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  & svg {
    & path {
      stroke: ${({ theme }) => theme.brand};
    }
  }
`;

const NavlinksContainer = styled.div`
  overflow-y: auto;
  flex-grow: 1;
  flex-shrink: 1;
  position: relative;
`;

const StatusContainer = styled.div`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 12px;
  display: flex;
  align-items: center;
`;

const StatusDot = styled.div`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: #5fa926;
  box-shadow: 0px 0px 8px 1px rgba(62, 245, 94, 0.6);
  margin-right: 5px;
`;

const TabDisplay = styled.div`
  padding-top: 10px;
  & > div > div {
    height: 100%;
    overflow: hidden;
  }
`;

const BrandTxt = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme.brand};
`;

const selectedTabHeights = {
  notifications: 300,
  settings: 200,
  theme: 200,
};

const BrandLogo = {
  TIO: "/assets/images/logo_tio.svg",
  PIX: "/assets/images/logo_pix.png",
};

const NavigationBar = ({
  isSidebarOpen,
  setIsSidebarOpen,
  pendingChangesDocs,
  pendingDocsData,
  requestsData,
  pendingWithdrawals,
  pendingDeposits,
  changeLeverage,
  deleteAccount,
}) => {
  const { theme, toggleTheme } = useTheme();
  const [selectedTab, setSelectedTab] = useState();
  const [selectedBrand] = useSelectedBrand();
  const debouncedTab = useDebounce(selectedTab, 500);
  const badgeTotals = useMemo(
    () => ({
      Documents: {
        "Pending Confirmation": pendingChangesDocs?.totalDocs,
        "Pending Review": pendingDocsData?.totalDocs,
      },
      "Client Requests": {
        value: requestsData?.totalDocs,
        "All Requests": requestsData?.totalDocs,
        "Change Leverage": changeLeverage?.totalDocs,
        "Delete Account": deleteAccount?.totalDocs,
      },
      Finances: {
        value: pendingWithdrawals?.totalDocs + pendingDeposits?.totalDocs,
        "Pending Withdrawals": pendingWithdrawals?.totalDocs,
        "Pending Deposits": pendingDeposits?.totalDocs,
      },
    }),
    [
      pendingWithdrawals,
      pendingDocsData,
      requestsData,
      pendingDeposits,
      pendingChangesDocs,
      changeLeverage,
      deleteAccount,
    ]
  );
  const { navData, isLoading } = useNavData();

  const [isMounted, setIsMounted] = useState(true);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const notificationsArray = useMemo(() => {
    return []
      .concat(
        pendingDocsData?.docs.map((x) => {
          return { ...x, notificationType: "documents" };
        }),
        requestsData?.docs.map((x) => {
          return { ...x, notificationType: "requests" };
        }),
        pendingWithdrawals?.docs.map((x) => {
          return { ...x, notificationType: "withdrawals" };
        })
      )
      .sort((a, b) => {
        return a.createdAt > b.createdAt ? -1 : 1;
      });
  }, [pendingDocsData, requestsData, pendingWithdrawals]);

  const goToClient = (clientId) => {
    setSearch("");
    return router.push(`/clients/${clientId}`);
  };

  useEffect(() => {
    if (isSidebarOpen) {
      setIsMounted(true);
    }
  }, [isSidebarOpen]);
  const { data } = useUser();

  const logOutCrmUser = useMutation(
    () =>
      agent()
        .logOutCrmUser()
        .then(() => router.push("/login")),
    {
      mutationKey: "logOutCrmUser",
    }
  );

  const displayedTab = useMemo(() => {
    if (selectedTab !== null) {
      return selectedTab;
    } else {
      return debouncedTab;
    }
  }, [selectedTab, debouncedTab]);

  const ref = useRef(null);
  const extraRef = useRef(null);

  useOnClickAway(ref, () => setSelectedTab(null), [extraRef]);

  if (isLoading || logOutCrmUser.isLoading)
    return <Loader bgOpacity={1} style={{ zIndex: 10000 }} />;

  if (!isMounted)
    return (
      <NavBarClosed
        className={`${isSidebarOpen ? "closeAnimation" : undefined}`}
      >
        <SmallLogoContainer>
          <LogoSmall primaryColor={theme.brand} width={30} height={30} />
        </SmallLogoContainer>
        <CloseButton
          className="isClosed"
          onClick={() => {
            setIsSidebarOpen(!isSidebarOpen);
          }}
        >
          <HiMenu color={colors.dark.textSecondary} size={25} />
        </CloseButton>
      </NavBarClosed>
    );
  return (
    <NavBar
      onAnimationEnd={(e) => {
        if (e.animationName === "slide-out") {
          setIsMounted(false);
        }
      }}
      className={`${!isSidebarOpen ? "closeAnimation" : undefined}`}
    >
      <NavBarInner>
        <LogoContainer>
          <Logo
            width={120}
            height={30}
            primaryColor={theme.brand}
            secondaryColor={theme.logoSecondary}
          />
          <CloseButton
            onClick={() => {
              setIsSidebarOpen(!isSidebarOpen);
            }}
          >
            <IoMdClose color={colors.dark.textSecondary} size={25} />
          </CloseButton>
        </LogoContainer>
        <ProfileContainer>
          <ProfileImage>
            <Image
              src={BrandLogo[selectedBrand]}
              width={35}
              height={30}
            ></Image>
          </ProfileImage>
          <Profile>
            <BrandTxt>{BRANDS_MAP[selectedBrand]}</BrandTxt>
            <p className="username">{`${data?.user?.first_name} ${data?.user?.last_name}`}</p>
            <p className="department">{data?.user?.email}</p>
            <StatusContainer>
              <StatusDot />
              <p>{data?.user?.department}</p>
            </StatusContainer>
          </Profile>
        </ProfileContainer>
        <SearchContainer>
          <SearchUserInputAutocomplete
            placeholder="Search"
            style={{
              backgroundColor:
                theme.name == "light" ? theme.primary : theme.secondary,
            }}
            suggestionsStyle={{
              backgroundColor: theme.secondary,
            }}
            value={search}
            setValue={setSearch}
            onSelectSuggestion={(clientId) => {
              setSearch(clientId);
              goToClient(clientId);
            }}
          />
        </SearchContainer>
        <NavlinksContainer>
          {isLoading && <Loader />}
          <NavigationLinks navData={navData} badgeTotals={badgeTotals} />
        </NavlinksContainer>
        <TabDisplay ref={ref}>
          <AnimateHeight
            duration={140}
            height={selectedTabHeights[selectedTab] ?? 0}
          >
            {displayedTab === "notifications" ? (
              <Notifications notificationsArray={notificationsArray} />
            ) : displayedTab === "settings" ? (
              <Settings />
            ) : displayedTab === "theme" ? (
              <SelectTheme />
            ) : null}
          </AnimateHeight>
        </TabDisplay>
      </NavBarInner>
      <BottomTabsContainer isTabOpen={!!selectedTab} ref={extraRef}>
        <NotificationBtn
          isActive={selectedTab === "notifications"}
          count={notificationsArray.length}
          onClick={() => {
            if (selectedTab === "notifications") {
              setSelectedTab(null);
            } else {
              setSelectedTab("notifications");
            }
          }}
        />
        <SettingsBtn
          isActive={selectedTab === "settings"}
          onClick={() => {
            if (selectedTab === "settings") {
              setSelectedTab(null);
            } else {
              setSelectedTab("settings");
            }
          }}
        />
        <TooltipWrapper tooltip={"Select Theme"} position="top-right">
          <BottomItem
            onClick={() => {
              // toggleTheme();
              if (selectedTab === "theme") {
                setSelectedTab(null);
              } else {
                setSelectedTab("theme");
              }
            }}
          >
            <FaPaintBrush />
          </BottomItem>
        </TooltipWrapper>
        <TooltipWrapper tooltip="Logout" position="top-left">
          <BottomItem
            onClick={() => {
              logOutCrmUser.mutate();
            }}
          >
            <FaPowerOff size={18} />
          </BottomItem>
        </TooltipWrapper>
      </BottomTabsContainer>
    </NavBar>
  );
};

export default NavigationBar;
