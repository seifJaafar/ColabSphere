import { Server } from "socket.io";
import { authenticateSocket } from "../middlewares/authenticateSocket.js";

let io;
const services = new Map();
const userChatrooms = new Map(); // Tracks which users are in which chatrooms

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ["GET", "POST"],
      credentials: true,
    },
    connectionStateRecovery: {
      maxDisconnectionDuration: 2 * 60 * 1000, // 2 minutes recovery window
      skipMiddlewares: true,
    },
  });

  io.use(authenticateSocket);

  io.on("connection", (socket) => {
    if (socket.role === "service") {
      console.log(`🛠️ Service connected: ${socket.user.id}`);
      services.set(socket.user.id, socket);
      socket.on("avatarUpdated", (data) => {
        const { userId, avatarUrl } = data;
        socket.to(`user_${userId}`).emit("avatarUpdated", { avatarUrl });
      });
      socket.on("disconnect", () => {
        services.delete(socket.user.id);
      });
    } else if (socket.role === "user") {
      console.log(`✅ User connected: ${socket.user.id}`);

      // Join user's personal room
      socket.join(`user_${socket.user.id}`);

      // Handle chatroom joining with acknowledgement
      socket.on("joinChatroom", async (chatroomId, callback) => {
        try {
          // Verify user has access to this chatroom

          socket.join(`chatroom_${chatroomId}`);
          trackUserChatroom(socket.user.id, chatroomId);
          console.log(
            `🚪 User ${socket.user.id} joined chatroom ${chatroomId}`
          );
        } catch (error) {
          console.error("Chatroom join error:", error);
        }
      });

      // Handle chatroom leaving
      socket.on("leaveChatroom", (chatroomId) => {
        socket.leave(`chatroom_${chatroomId}`);
        untrackUserChatroom(socket.user.id, chatroomId);
        console.log(`🚪 User ${socket.user.id} left chatroom ${chatroomId}`);
      });

      // Handle message sending with verification
      socket.on("sendMessage", async (data, callback) => {
        try {
          // Verify user is in the chatroom they're messaging
          if (!isUserInChatroom(socket.user.id, data.chatroomId)) {
            throw new Error("Not in chatroom");
          }

          const messageService = services.get("messaging_service");
          if (!messageService) {
            throw new Error("Message service unavailable");
          }

          const messagePayload = {
            ...data,
            senderId: socket.user.id,
            timestamp: new Date(),
          };
          console.log(data);
          // Forward to message service for persistence
          messageService.emit("createMessage", messagePayload);

          // Broadcast to all in chatroom (including sender)
          io.to(`chatroom_${data.chatroomId}`).emit(
            "newMessage",
            messagePayload
          );
        } catch (error) {
          console.error("Message send error:", error);
        }
      });

      // Handle initial bulk joining of chatrooms
      // In your API gateway socket config
      socket.on("joinChatrooms", (chatroomIds) => {
        chatroomIds.forEach((roomId) => {
          socket.join(`chatroom_${roomId}`);
          trackUserChatroom(socket.user.id, roomId);
          console.log(`User joined chatroom ${roomId}`);
        });
      });
    }

    socket.on("disconnect", () => {
      console.log(
        `💀 ${socket.role} disconnected: ${
          socket.user?.id || socket.service?.name
        }`
      );
      if (socket.role === "user") {
        cleanupUserChatrooms(socket.user.id);
      }
    });
  });

  // Helper functions
  function trackUserChatroom(userId, chatroomId) {
    if (!userChatrooms.has(userId)) {
      userChatrooms.set(userId, new Set());
    }
    userChatrooms.get(userId).add(chatroomId);
  }

  function untrackUserChatroom(userId, chatroomId) {
    if (userChatrooms.has(userId)) {
      userChatrooms.get(userId).delete(chatroomId);
    }
  }

  function isUserInChatroom(userId, chatroomId) {
    return (
      userChatrooms.has(userId) && userChatrooms.get(userId).has(chatroomId)
    );
  }

  function cleanupUserChatrooms(userId) {
    userChatrooms.delete(userId);
  }

  // Replace with your actual database verification
  async function verifyChatroomAccess(userId, chatroomId) {
    // In production: Query your database to verify access
    return true; // Simplified for example
  }

  return io;
};
