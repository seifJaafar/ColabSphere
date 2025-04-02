"use client";

import { useEffect, useState } from "react";
import { getSocket } from "../config/socket";
import { getAuthToken } from "../config/auth";
import { useUserStore } from "../config/UserStore";

export const SocketProvider = () => {
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    const connectSocket = async () => {
      const token = await getAuthToken();
      if (!token) return;

      const socket = getSocket(token);
      socket.connect();
      setSocketConnected(true);

      socket.on("avatarUpdated", ({ avatarUrl }) => {
        useUserStore.getState().updateAvatar(avatarUrl);
      });

      socket.on("newMessage", (message) => {
        console.log("📩 New message received:", message);
      });

      socket.on("notification", (notification) => {
        console.log("🔔 New notification:", notification);
      });

      socket.on("disconnect", () => {
        setSocketConnected(false);
      });

      return () => {
        socket.disconnect();
      };
    };

    connectSocket();
  }, []);

  return null;
};
