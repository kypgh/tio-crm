import React, { createContext, useContext, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import styled, { keyframes } from "styled-components";
import genUid from "light-uid";
import { colors } from "../../config/colors";
import {
  FaTimes,
  FaCheck,
  FaExclamationTriangle,
  FaExclamation,
  FaInfo,
} from "react-icons/fa";

const NotificationContext = createContext();
const LIFETIME = 4000;

const NotificationsContainer = styled.div`
  position: fixed;
  right: 0px;
  top: 10px;
  z-index: 9999999;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
  /* border: 1px solid red; */
`;

const NotificationInstance = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  background-color: ${({ theme }) => theme.secondary};
  padding: 7px;
  border-radius: 7px 0px 0px 7px;
  color: ${({ theme }) => theme.white};
  box-shadow: 3px 3px 10px #0f1216, -3px -3px 10px #0f1418;
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-right: 0px;
  margin-bottom: 10px;
  z-index: 9999999;
`;

const IconDiv = styled.div`
  margin-right: 5px;
  color: ${({ type }) => NOTIFICATION_COLORS[type]};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Text = styled.p``;

const NOTIFICATION_TYPE = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
};
const NOTIFICATION_ICON = {
  success: <FaCheck />,
  error: <FaTimes />,
  warning: <FaExclamationTriangle />,
  info: <FaInfo />,
};
const NOTIFICATION_COLORS = {
  success: "green",
  error: "red",
  warning: "yellow",
  info: "white",
};

const Notification = ({ children, clearSelf, type, key }) => {
  let [timoutSet, setTimeoutSet] = useState(false);
  useEffect(() => {
    if (!timoutSet) {
      setTimeout(() => {
        clearSelf();
      }, LIFETIME);
      setTimeoutSet(true);
    }
  }, []);
  return (
    <NotificationInstance>
      <IconDiv type={type}>{NOTIFICATION_ICON[type]}</IconDiv>
      <Text>{children}</Text>
    </NotificationInstance>
  );
};

export default function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState({});
  return (
    <NotificationContext.Provider value={[notifications, setNotifications]}>
      {children}
      <NotificationsContainer>
        <AnimatePresence mode="popLayout">
          {Object.entries(notifications).map(([_id, { text, type }], i) => (
            <motion.div
              layout
              initial={{ translateX: "450px", opacity: 0 }}
              animate={{ translateX: "20px", opacity: 1 }}
              exit={{ translateX: "450px", opacity: 0 }}
              transition={{ type: "spring", stiffness: 1000, damping: 37.5 }}
              key={_id}
            >
              <Notification
                type={type}
                clearSelf={() =>
                  setNotifications((v) => {
                    delete v[_id];
                    return { ...v };
                  })
                }
              >
                {text}
              </Notification>
            </motion.div>
          ))}
        </AnimatePresence>
      </NotificationsContainer>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const [notifications, setNotifications] = useContext(NotificationContext);
  return {
    SUCCESS: (notification) => {
      const _id = genUid();
      setNotifications((v) => ({
        ...v,
        [_id]: { text: notification, type: NOTIFICATION_TYPE.SUCCESS },
      }));
    },
    ERROR: (notification) => {
      const _id = genUid();
      setNotifications((v) => ({
        ...v,
        [_id]: { text: notification, type: NOTIFICATION_TYPE.ERROR },
      }));
    },
    WARNING: (notification) => {
      const _id = genUid();
      setNotifications((v) => ({
        ...v,
        [_id]: { text: notification, type: NOTIFICATION_TYPE.WARNING },
      }));
    },
    INFO: (notification) => {
      const _id = genUid();
      setNotifications((v) => ({
        ...v,
        [_id]: { text: notification, type: NOTIFICATION_TYPE.INFO },
      }));
    },
  };
}
