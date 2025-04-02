import { io, Socket } from "socket.io-client";

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

    socket.on("disconnect", (reason) => {
      console.warn("❌ Disconnected from WebSocket:", reason);
    });

    socket.on("connect_error", (error) => {
      console.error("⚠️ Connection error:", error.message);
    });
  }

  return socket;
};
