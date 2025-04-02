import { Server } from "socket.io";
import { authenticateSocket } from "../middlewares/authenticateSocket.js"; // Ensure .js extension for ESM

let io;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL, // Allow only frontend
      methods: ["GET", "POST"],
    },
  });

  io.use(authenticateSocket);

  io.on("connection", (socket) => {
    console.log(`✅ User connected: ${socket.user.id}`);
    socket.join(socket.user.id);
    socket.on("avatarUpdated", ({ userId, avatarUrl }) => {
      io.to(userId).emit("avatarUpdated", { avatarUrl });
      console.log(`📢 Sent avatar update to user ${userId}`);
    });
    socket.on("disconnect", () => {
      console.log(`❌ User disconnected: ${socket.user.id}`);
    });
  });

  return io;
};

export const getSocketInstance = () => {
  if (!io) throw new Error("Socket.IO has not been initialized!");
  return io;
};
