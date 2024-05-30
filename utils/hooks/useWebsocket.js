import { setRequestMeta } from "next/dist/server/request-meta";
import { useCallback, useEffect, useState } from "react";

/**
 *
 * @param {string} socketUrl
 * @param {{
 *  onOpen: (ws: WebSocket, ev: Event) => void;
 *  onClose: (ws: WebSocket, ev: CloseEvent) => void;
 *  onMessage: (ws: WebSocket, ev: MessageEvent) => void;
 * }} param1
 */
export default function useWebsocket(
  socketUrl,
  { onOpen, onClose, onMessage }
) {
  const [ws, setWebsocket] = useState(null);
  const [sendRequests, setSendRequests] = useState([]);
  const sendData = useCallback(
    (data) => {
      if (ws?.readyState === WebSocket.OPEN) {
        ws.send(data);
      } else {
        setSendRequests((prev) => [...prev, data]);
      }
    },
    [ws]
  );
  useEffect(() => {
    if (!socketUrl) {
      return;
    }
    const ws = new WebSocket(socketUrl);
    setWebsocket(ws);
    ws.onopen = (ev) => {
      for (const req of sendRequests) {
        ws.send(req);
      }
      setSendRequests([]);
      if (onOpen) onOpen(ws, ev);
    };
    ws.onclose = (ev) => {
      if (onClose) onClose(ws, ev);
    };
    ws.onmessage = (ev) => {
      if (onMessage) onMessage(ws, ev);
    };

    return () => {
      ws.close();
    };
  }, [socketUrl]);
  return { sendData };
}
