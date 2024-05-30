import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_AI_BLOGPOSTS_API_URL);
const socketIO = ({ onConnect }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    function onProgress(data) {
      setIsGenerating(
        !(data?.status === "pending" || data?.status === "success")
      );
    }

    socket.on("blogs:progress", onProgress);

    function onConn() {
      socket.emit("blogs", null, (data) => {
        setIsGenerating(
          !(data?.status === "pending" || data?.status === "success")
        );
        onConnect(data);
      });
    }

    function onDisconnect() {
      console.error("disconnected");
    }

    socket.on("connect", onConn);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConn);
      socket.off("disconnect", onDisconnect);
      socket.off("blogs:progress", onProgress);
    };
  }, []);

  socket.isGenerating = isGenerating;

  return socket;
};

export default socketIO;
