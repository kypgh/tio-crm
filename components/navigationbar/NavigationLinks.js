import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useMemo } from "react";
import AnimateHeight from "react-animate-height";
import { FaAngleLeft, FaCircle, FaRegCircle } from "react-icons/fa";
import styled from "styled-components";
import { navIcons } from "../../config/navigationbarData";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 15px 0;
  height: 100%;
  overflow-y: auto;
  color: ${({ theme }) => theme.textSecondary};
`;

const NavItemLinkTag = styled.a`
  all: unset;
`;
const NavItemLink = styled.div`
  display: flex;
  align-items: center;
  padding: 0 15px;
  gap: 10px;
  cursor: pointer;
  color: ${({ theme, isOpen }) => (isOpen ? theme.brand : theme.textSecondary)};
  font-weight: 700;
  &:hover {
    background: linear-gradient(${({ theme }) => theme.navItemShadow});
  }
`;
const NavItemIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.secondary};
  padding: 6px;
  border-radius: 5px;
  transition: 0.3s all ease;

  svg {
    transition: 0.3s all ease;
  }
`;

const NavItemChildrenContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: ${({ theme }) => theme.dropDownColor};
  margin-top: 15px;
  padding: 15px 33px;
  transition: 0.3s all ease;
  height: auto;
`;

const NavItemRight = styled.div`
  margin-left: auto;
`;

const NavItemArrow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  transition: 0.3s all ease;
  transform: rotateZ(${({ isOpen }) => (isOpen ? "-90deg" : "0deg")});
  font-size: 20px;

  ${NavItemRight} + & {
    margin-left: unset;
  }
`;

const NavChildRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: ${({ theme, isSelected }) => (isSelected ? theme.brand : "")};
  cursor: pointer;
`;

const Badge = styled.div`
  font-size: 12px;
  padding: 2px 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.brand};
  color: ${({ theme }) => theme.badgeTextColor};
  border-radius: 3px;
  mix-blend-mode: difference;
`;

const NavItemChild = ({ navItem, navChild, isSelected, badgeTotal }) => {
  return (
    <Link href={navItem.url + navChild.url} passHref>
      <NavItemLinkTag>
        <NavChildRow isSelected={isSelected}>
          {isSelected ? <FaCircle size={10} /> : <FaRegCircle size={10} />}
          <p>{navChild.name}</p>
          {!!badgeTotal && (
            <NavItemRight>
              <Badge>{badgeTotal}</Badge>
            </NavItemRight>
          )}
        </NavChildRow>
      </NavItemLinkTag>
    </Link>
  );
};

const NavItemChildren = ({
  navItem,
  isRoute,
  isOpenTab,
  openTab,
  badgeTotal,
}) => {
  const router = useRouter();
  const enabledChidlren = useMemo(
    () => navItem.children.filter((d) => !d.disabled && d.display),
    [navItem.children]
  );

  return (
    <div>
      <NavItemLink isOpen={isRoute} onClick={() => openTab()}>
        <NavItemIcon>{navIcons[navItem.icon]}</NavItemIcon>
        <p>{navItem.name}</p>
        {!!badgeTotal?.value && (
          <NavItemRight>
            <Badge>{badgeTotal?.value}</Badge>
          </NavItemRight>
        )}
        <NavItemArrow isOpen={isOpenTab}>
          <FaAngleLeft />
        </NavItemArrow>
      </NavItemLink>
      <AnimateHeight duration={500} height={isOpenTab ? "auto" : 0}>
        <NavItemChildrenContainer>
          {enabledChidlren.map((navChild) => (
            <NavItemChild
              key={navChild.name}
              navItem={navItem}
              navChild={navChild}
              isSelected={navItem.url + navChild.url === router.pathname}
              badgeTotal={badgeTotal ? badgeTotal[navChild.name] : null}
            />
          ))}
        </NavItemChildrenContainer>
      </AnimateHeight>
    </div>
  );
};

const NavItemSingle = ({ theme, navItem, isRoute, badgeTotal }) => {
  return (
    <Link href={navItem.url} passhref>
      <NavItemLinkTag>
        <NavItemLink isOpen={isRoute}>
          <NavItemIcon>{navIcons[navItem.icon]}</NavItemIcon>
          <p>{navItem.name}</p>
          {!!badgeTotal && (
            <NavItemRight>
              <Badge>{badgeTotal}</Badge>
            </NavItemRight>
          )}
        </NavItemLink>
      </NavItemLinkTag>
    </Link>
  );
};

const NavItem = (props) => {
  return props.navItem.children?.length > 0 ? (
    <NavItemChildren {...props} />
  ) : (
    <NavItemSingle {...props} />
  );
};

const NavigationLinks = ({ theme, navData, badgeTotals = {} }) => {
  const router = useRouter();
  const enabledNavData = useMemo(
    () => navData.filter(({ disabled, display }) => !disabled && display),
    [navData]
  );
  const [openTab, setOpenTab] = useState(
    enabledNavData.find(
      (navItem) =>
        navItem.url === router.pathname ||
        navItem.children?.some(
          (child) => navItem.url + child.url === router.pathname
        )
    )
  );
  useEffect(() => {
    setOpenTab(
      enabledNavData.find(
        (navItem) =>
          navItem.url === router.pathname ||
          navItem.children?.some(
            (child) => navItem.url + child.url === router.pathname
          )
      )?.name
    );
  }, [router.pathname]);
  return (
    <Container>
      {enabledNavData.map((navItem) => (
        <NavItem
          key={navItem.name}
          navItem={navItem}
          isRoute={
            navItem.url === router.pathname ||
            navItem.children?.some(
              (child) => navItem.url + child.url === router.pathname
            )
          }
          badgeTotal={badgeTotals[navItem.name]}
          isOpenTab={openTab === navItem.name}
          openTab={() =>
            setOpenTab(openTab === navItem.name ? null : navItem.name)
          }
        />
      ))}
    </Container>
  );
};

export default NavigationLinks;
