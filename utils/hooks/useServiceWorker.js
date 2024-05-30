import { useEffect } from "react";

export default function useServiceWorker() {
  const serviceWorkerAvailable = () => {
    return "serviceWorker" in navigator && "PushManager" in window;
  };
  const registerServiceWorker = async () => {
    const swRegistration = await navigator.serviceWorker.register(
      "/sw.worker.js",
      {
        scope: "/",
      }
    );
    return swRegistration;
  };
  const requestNotificationPermission = async () => {
    const permission = await window.Notification.requestPermission();
    // value of permission can be 'granted', 'default', 'denied'
    // granted: user has accepted the request
    // default: user has dismissed the notification permission popup by clicking on x
    // denied: user has denied the request.
    if (permission !== "granted") {
      console.error("Permission not granted for Notification");
      //throw new Error("Permission not granted for Notification");
    }
  };
  const main = async () => {
    try {
      if (serviceWorkerAvailable()) {
        const swRegistration = await registerServiceWorker();
        const permission = await requestNotificationPermission();
      }
    } catch (error) {
      console.error("Push notification error.");
    }
  };

  useEffect(() => {
    //check if browser is safari
    const isSafari =
      /constructor/i.test(window.HTMLElement) ||
      (function (p) {
        return p.toString() === "[object SafariRemoteNotification]";
      })(
        !window["safari"] ||
          (typeof safari !== "undefined" && safari.pushNotification)
      );

    if (!isSafari) {
      main();
    }
  }, []);
}
