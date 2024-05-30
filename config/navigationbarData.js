import { AiFillDashboard } from "react-icons/ai";
import { IoMdFolder, IoIosDocument } from "react-icons/io";
import { HiUserGroup } from "react-icons/hi";
import { FaMailBulk, FaPiggyBank, FaTools, FaWrench } from "react-icons/fa";
import { VscRequestChanges } from "react-icons/vsc";
import { MdAdminPanelSettings, MdHealthAndSafety } from "react-icons/md";
import { AiTwotoneNotification } from "react-icons/ai";
import { BsTools } from "react-icons/bs";

import useUser from "../utils/hooks/useUser";
import agent from "../utils/agent";
import { QueryClient } from "@tanstack/react-query";
import { GetServerSidePropsContext } from "next";
import { PERMISSIONS } from "./permissions";
import { USER_REQUEST_TYPES } from "./enums";

export const navIcons = {
  dashboard: <AiFillDashboard size={16} />,
  clients: <HiUserGroup size={16} />,
  documents: <IoMdFolder size={16} />,
  clientRequests: <VscRequestChanges size={16} />,
  reports: <IoIosDocument size={16} />,
  finances: <FaPiggyBank size={16} />,
  clientCommunications: <AiTwotoneNotification size={16} />,
  tools: <BsTools size={16} />,
  administration: <MdAdminPanelSettings size={16} />,
  internals: <FaWrench size={16} />,
};

export const navData = [
  {
    name: "Dashboard",
    icon: "dashboard",
    display: true,
    url: "/",
    permissions: [],
  },
  {
    name: "Clients",
    url: "/clients",
    display: true,
    permissions: [PERMISSIONS.USERS.get_users.value],
    icon: "clients",
    children: [
      {
        name: "All Clients",
        url: "",
        permissions: [],
        display: true,
      },
      {
        name: "Pending Clients",
        url: "/pending",
        permissions: [],
        display: true,
      },
      {
        name: "Verified Clients",
        url: "/verified",
        permissions: [],
        display: true,
      },
      {
        name: "KYC Clients",
        url: "/kyc",
        permissions: [],
        display: true,
      },
    ],
  },
  {
    name: "Documents",
    url: "/documents",
    display: true,
    permissions: [PERMISSIONS.DOCUMENTS.view_documents.value],
    icon: "documents",
    children: [
      {
        name: "Pending Review",
        url: "/pending-review",
        permissions: [],
        display: true,
      },
      {
        name: "Pending Confirmation",
        url: "/pending-confirmation",
        permissions: [],
        display: true,
      },
    ],
  },
  {
    name: "Client Requests",
    url: "/requests",
    display: true,
    permissions: [PERMISSIONS.REQUESTS.view_requests.value],
    icon: "clientRequests",
    children: [
      {
        name: "All Requests",
        url: "",
        permissions: [],
        display: true,
      },
      {
        name: "Change Leverage",
        url: "/change-leverage",
        permissions: [],
        display: true,
      },
      {
        name: "Delete Account",
        url: "/delete-account",
        permissions: [],
        display: true,
      },
    ],
  },
  {
    name: "Reports",
    icon: "reports",
    display: true,
    url: "/reports",
    children: [
      {
        name: "Finances",
        url: "/finances",
        permissions: [PERMISSIONS.REPORTS.finances.value],
        display: true,
      },
      {
        name: "First Time Deposits",
        url: "/firstTimeDeposits",
        permissions: [PERMISSIONS.REPORTS.first_time_deposits.value],
        display: true,
      },
      {
        name: "UTM Report",
        url: "/utms",
        permissions: [PERMISSIONS.REPORTS.utm_reports.value],
        display: true,
      },
      {
        name: "Active Traders",
        url: "/activeTraders",
        permissions: [PERMISSIONS.REPORTS.active_traders.value],
        display: true,
      },
      {
        name: "Balance/Equity Report",
        url: "/balanceEquity",
        permissions: [PERMISSIONS.REPORTS.balance_report],
        display: true,
      },
      {
        name: "Campaigns",
        url: "/campaigns",
        permissions: [],
        display: false,
      },
    ],
  },
  {
    name: "Finances",
    icon: "finances",
    display: true,
    url: "/finances",
    children: [
      {
        name: "Deposits",
        url: "/deposits",
        permissions: [PERMISSIONS.TRANSACTIONS.view_transactions.value],
        display: true,
      },
      {
        name: "Pending Deposits",
        url: "/pending-deposits",
        permissions: [PERMISSIONS.REQUESTS.view_pending_deposits.value],
        display: true,
      },
      {
        name: "Withdrawals",
        url: "/withdrawals",
        permissions: [PERMISSIONS.TRANSACTIONS.view_transactions.value],
        display: true,
      },
      {
        name: "Pending Withdrawals",
        url: "/pending-withdrawals",
        permissions: [PERMISSIONS.REQUESTS.view_pending_withdrawals.value],
        display: true,
      },
    ],
  },
  {
    name: "Communication",
    icon: "clientCommunications",
    display: true,
    url: "/client-communication",
    children: [
      {
        name: "App Ribbon",
        url: "/app-ribbon",
        permissions: [PERMISSIONS.RIBBONS.view_ribbons.value],
        display: true,
      },
      {
        name: "Push Notifications",
        url: "/",
        permissions: [],
        display: false,
      },
      {
        name: "SMS",
        url: "/",
        permissions: [],
        display: false,
      },
      {
        name: "Email",
        url: "/",
        permissions: [],
        display: false,
      },
      {
        name: "Client Segments",
        url: "/client-segments",
        permissions: [PERMISSIONS.USER_SEGMENTS.view_user_segments.value],
        display: true,
      },
    ],
  },
  {
    name: "Tools",
    icon: "tools",
    display: false,
    url: "/tools",
    children: [
      {
        name: "UTM Builder",
        url: "/utm-builder",
        permissions: [],
        display: false,
      },
      {
        name: "Analytics",
        url: "/analytics",
        permissions: [],
        display: false,
      },
      {
        name: "Sales Leaderboard",
        url: "/sales-leaderboard",
        permissions: [],
        display: false,
      },
    ],
  },
  {
    name: "Administration",
    icon: "administration",
    display: true,
    url: "/administration",
    children: [
      {
        name: "User Management",
        url: "/users",
        permissions: [PERMISSIONS.CRM_USERS.get_crm_users.value],
        display: true,
      },
      {
        name: "Roles & Permissions",
        url: "/permissions",
        permissions: [
          PERMISSIONS.ROLES.view_roles.value,
          PERMISSIONS.CRM_USERS.get_crm_users.value,
        ],
        display: true,
      },
      {
        name: "Sales Assignment",
        url: "/sales-assignment",
        permissions: [PERMISSIONS.CRM_USERS.get_crm_users.value],
        display: true,
      },
      {
        name: "Logs",
        url: "/logs",
        display: true,
        permissions: [PERMISSIONS.ADMINISTRATION.user_logs.value],
      },
    ],
  },
  {
    name: "Internals",
    icon: "internals",
    display: true,
    url: "/internals",
    bypassAdmin: true,
    children: [
      {
        name: "Scheduled Functions",
        url: "/scheduled-functions",
        display: true,
        permissions: [PERMISSIONS.SCHEDULED_FUNCTIONS.view_functions.value],
      },
      {
        name: "Server Status",
        url: "/server-status",
        display: true,
        permissions: [PERMISSIONS.INTERNAL.server_status.value],
        bypassAdmin: true,
      },

      {
        name: "Daily Analysis",
        url: "/daily-analysis",
        display: true,
        permissions: [PERMISSIONS.INTERNAL.daily_analysis_email.value],
        bypassAdmin: true,
      },
      {
        name: "Openpayd Update",
        url: "/open-payd-form",
        display: true,
        permissions: [PERMISSIONS.INTERNAL.openpayd_update_details.value],
        bypassAdmin: true,
      },
      // {
      //   name: "Openpayd Sweep",
      //   url: "/open-payd-sweep",
      //   display: true,
      //   permissions: [],
      //   // permissions: [PERMISSIONS.INTERNAL.openpayd_sweep.value],
      //   bypassAdmin: true,
      // },
      {
        name: "Translation Tool",
        url: "/translation-tool",
        display: true,
        permissions: [PERMISSIONS.INTERNAL.translation_tool.value],
        bypassAdmin: true,
      },
      {
        name: "IB Leads Management",
        url: "/ib-leads",
        display: true,
        permissions: [PERMISSIONS.INTERNAL.ib_leads_upload.value],
        bypassAdmin: true,
      },
      {
        name: "Blog",
        url: "/blog",
        display: true,
        permissions: [PERMISSIONS.INTERNAL.ai_blogpost_generator.value],
        bypassAdmin: true,
      },
    ],
  },

  //dynamic nav items
  {
    name: "Client by ID",
    url: (params) => `/clients/${params.clientId}`,
    display: false,
    permissions: [PERMISSIONS.USERS.get_user.value],
    icon: "clients",
  },
];

function parseNavData(nd, params = {}) {
  return nd.map((n) => ({
    ...n,
    url: typeof n.url === "function" ? n.url(params) : n.url || "",
    ...(n.children ? { children: parseNavData(n.children, params) } : {}),
  }));
}

function filterNavData(user, context) {
  let allowed = false;
  const userPerms = [
    ...new Set([
      ...(user?.permissions || []),
      ...(user?.role?.permissions || []),
    ]),
  ];
  let url = context.resolvedUrl.split("?")[0];
  const filteredNavData = navData.map((nav) => {
    const navItem = { ...nav };
    navItem.url =
      typeof navItem.url === "function"
        ? navItem.url(context.query)
        : navItem.url || "";
    if (navItem.children) {
      navItem.disabled = true;
      navItem.children = navItem.children.map((c) => {
        const child = { ...c };
        child.url =
          typeof child.url === "function"
            ? child.url(context.query)
            : child.url || "";
        if (user?.role?.name !== "admin" || child.bypassAdmin) {
          child.disabled =
            !!child.permissions.length &&
            !child.permissions.some((perm) => userPerms.includes(perm));
        } else {
          child.disabled = false;
        }
        if (navItem.url + child.url === url) allowed = !child.disabled;
        if (!child.disabled) navItem.disabled = false;
        return child;
      });
    } else {
      if (user?.role?.name !== "admin" || navItem.bypassAdmin) {
        navItem.disabled =
          !!navItem.permissions.length &&
          !navItem.permissions.some((perm) => userPerms.includes(perm));
      } else {
        navItem.disabled = false;
      }
    }
    if (navItem.url === url) allowed = !navItem.disabled;
    return navItem;
  });
  return { filteredNavData, allowed };
}

/**
 *
 * @param {QueryClient} queryClient
 * @param {GetServerSidePropsContext} context
 * @returns
 */
export const userNavData = async (queryClient, context) => {
  try {
    const { user } = await queryClient.fetchQuery(["currentUser"], () =>
      agent(context)
        .getCurrentCrmUser()
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          return {};
        })
    );
    if (!user) {
      context.res.setHeader("Set-Cookie", [
        `token=; sameSite=lax; path=/;`,
        `refresh_token=; sameSite=lax; path=/;`,
      ]);
      let redirect = {
        destination: `/login?redirect=${context.resolvedUrl}`,
        permanent: false,
      };

      return { navData, allowed: false, redirect };
    }
    const { allowed, filteredNavData } = filterNavData(user, context);
    return {
      navData: filteredNavData,
      allowed,
      redirect: !allowed
        ? {
            destination: context.resolvedUrl === "/" ? "/login" : "/?error=401",
            permanent: false,
          }
        : { destination: "/?error=500", permanent: false }, // <-- Should never happen
    };
  } catch (err) {
    console.error(err);
    return {
      navData: parseNavData(navData, context.params),
      allowed: false,
      redirect: {
        destination: `/?error=500`,
        permanent: false,
      },
    };
  }
};
