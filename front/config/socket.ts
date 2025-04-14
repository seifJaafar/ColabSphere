import { io, Socket } from "socket.io-client";
import { useUserStore } from "./UserStore";
import { user } from "@heroui/theme";
let socket: Socket | null = null;
const API_BASE_URL = process.env.NEXT_PUBLIC_API;

export const getSocket = (token: string): Socket => {
  if (!socket) {
    socket = io(`${API_BASE_URL}`, {
      transports: ["websocket"],
      auth: { token },
      reconnection: true,
    });

    socket.on("connect", () => {
      console.log("✅ Connected to WebSocket");
    });

    socket.on("avatarUpdated", (data: { avatarUrl: string }) => {
      console.log("Avatar updated event received:", data);
      const currentUser = useUserStore.getState().user;
      // Join the room with the user's ID
      console.log(data);
      // Check if the update is for the current user

      useUserStore.getState().updateAvatar(data.avatarUrl);
      console.log("Avatar updated successfully");
    });
    socket.on("disconnect", (reason) => {
      console.warn("❌ Disconnected from WebSocket:", reason);
    });

    socket.on("connect_error", (error) => {
      console.error("⚠️ Connection error:", error.message);
    });
  }

  return socket;
};
