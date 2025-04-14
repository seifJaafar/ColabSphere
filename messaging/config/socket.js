const { io } = require("socket.io-client");
const Message = require("../nosqlModels/Message"); // Adjust the path as necessary
console.log(
  "attempting to connect to socket.io client..." + process.env.API_GATEWAY
);
// 2. Connect to the gateway
const socket = io(`${process.env.API_GATEWAY}`, {
  transports: ["websocket"],
  reconnection: true,
  auth: { token: process.env.API_TOKEN }, // ✅ Fix auth format
});

// 3. Handle connection and events
socket.on("connect", () => {
  console.log("✅ Connected to gateway as messaging service");
});

// Listen for messages from the gateway
socket.on("createMessage", async (data) => {
  console.log("📩 Received message request:", data);

  // Save to DB (example using Sequelize)
  try {
    const message = await Message.create({
      content: {
        type: "text",
        text: data.content,
      },
      sender_id: data.senderId,
      chatroom_id: data.chatroomId,
    });

    // Broadcast to all clients in the chatroo
  } catch (error) {
    console.error("Error saving message:", error);
  }
});
socket.on("connect_error", (err) => {
  console.error("❌ Connection error in User Service:", err.message);
});
// Handle disconnects
socket.on("disconnect", () => {
  console.log("❌ Disconnected from gateway");
});
