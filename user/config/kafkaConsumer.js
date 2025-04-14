const { Kafka } = require("kafkajs");
const db = require("../models/index");
const { User } = db;
const { io } = require("socket.io-client");
const dotenv = require("dotenv");
dotenv.config();

const kafka = new Kafka({
  clientId: "user-service",
  brokers: ["localhost:9092"], // Update as needed
});

const consumer = kafka.consumer({ groupId: "user-service-group" });

// ✅ Move socket initialization **outside** of Kafka consumer
const socket = io(`${process.env.API_GATEWAY}`, {
  transports: ["websocket"],
  reconnection: true,
  auth: { token: process.env.API_TOKEN }, // ✅ Fix auth format
});

// ✅ Log socket connection errors
socket.on("connect", () => {
  console.log("✅ User Service connected to API Gateway websocket:", socket.id);
});

socket.on("connect_error", (err) => {
  console.error("❌ Connection error in User Service:", err.message);
});

// ✅ Kafka Consumer Logic
const consumeAvatarEvents = async () => {
  await consumer.connect();
  await consumer.subscribe({
    topic: "user-avatar-updated", // Existing topic for avatar updates
    fromBeginning: false,
  });

  await consumer.subscribe({
    topic: "user-service-project-created", // New topic to handle project creation
    fromBeginning: false,
  });
  await consumer.subscribe({
    topic: "user-service-invite-members", // New topic to handle invite members
    fromBeginning: false,
  });
  await consumer.subscribe({
    topic: "user-data-request", // New topic to handle user data request
    fromBeginning: false,
  });
  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      try {
        // Handling avatar update events
        if (topic === "user-avatar-updated") {
          const { userId, avatarUrl } = JSON.parse(message.value.toString());
          const user = await User.findByPk(userId);
          if (!user) {
            console.error(`❌ User ${userId} not found`);
            return;
          }

          user.avatar = avatarUrl;
          await user.save();

          // Emit event only if socket is connected
          if (socket.connected) {
            socket.emit("avatarUpdated", { userId, avatarUrl }, (ack) => {
              console.log(
                `✅ Successfully emitted avatarUpdated for user ${userId}`
              );
              console.log("🔄 Acknowledgment received from API Gateway:", ack);
            });
          } else {
            console.error("❌ Socket.IO is not connected. Cannot emit event.");
          }
          const producer = kafka.producer();
          await producer.connect();
          await producer.send({
            topic: "user-service-avatar-updated", // Topic to notify the Team Service
            messages: [
              {
                value: JSON.stringify({ userId, avatarUrl }),
              },
            ],
          });
        }

        // Handling new project creation and fetching public user data
        if (topic === "user-service-project-created") {
          const { userId, projectId, roles } = JSON.parse(
            message.value.toString()
          );

          // Fetch the public user data (you can extend this if needed)
          const user = await User.findByPk(userId, {
            attributes: [
              "email",
              "username",
              "avatar",
              "googleAccessToken",
              "githubAccessToken",
            ], // Get only public data
          });

          if (!user) {
            console.error(`❌ User ${userId} not found`);
            return;
          }

          // Prepare the data to be sent to the Team Service
          const userPublicData = {
            userId,
            projectId,
            email: user.email,
            username: user.username,
            avatar: user.avatar,
            roles: roles,
            googleAccessToken: user.googleAccessToken,
            githubAccessToken: user.githubAccessToken,
          };

          // Send the public user data to the Team Service
          const producer = kafka.producer();
          await producer.connect();
          await producer.send({
            topic: "team-service-topic", // Topic to notify the Team Service
            messages: [
              {
                value: JSON.stringify(userPublicData),
              },
            ],
          });

          console.log(
            `✅ Sent user public data to Team Service for project ${projectId}`
          );
          await producer.disconnect();
        }
        if (topic === "user-data-request") {
          const { userId } = JSON.parse(message.value.toString());
          const user = await User.findByPk(userId, {
            attributes: ["username", "avatar"],
          });
          console.log("user data for messaging", user);
          if (!user) {
            console.error(`❌ User ${userId} not found`);
            return;
          }
          const producer = kafka.producer();
          await producer.connect();
          await producer.send({
            topic: "user-data-response",
            messages: [
              {
                value: JSON.stringify({
                  userID: userId,
                  username: user.username,
                  avatar: user.avatar,
                }),
              },
            ],
          });
          console.log(`✅ Sent user public data to messaging service`);
          await producer.disconnect();
        }
        if (topic === "user-service-invite-members") {
          let valid = [];
          let invalid = [];
          const messageValue = JSON.parse(message.value.toString());
          const { emails, projectId } = messageValue;
          for (let email of emails) {
            const user = await User.findOne({
              where: { email },
              attributes: ["email", "username", "avatar", "id"],
            });

            if (user) {
              valid.push(user); // Push valid user to the valid array
            } else {
              invalid.push(email); // Push invalid email to the invalid array
            }
          }

          const producer = kafka.producer();
          await producer.connect();
          await producer.send({
            topic: "team-service-invite-members", // Topic to notify the Team Service
            messages: [
              {
                value: JSON.stringify({ valid, invalid, projectId }), // Both arrays in one message
              },
            ],
          });
          await producer.disconnect();
        }
      } catch (error) {
        console.error("Error processing Kafka message:", error);
      }
    },
  });
};

// Graceful shutdown
const shutdownGracefully = async () => {
  console.log("❌ Shutting down gracefully...");

  try {
    // Disconnect from Kafka consumer
    await consumer.disconnect();
    console.log("✅ Kafka consumer disconnected.");

    // Disconnect the Socket.IO client
    socket.disconnect();
    console.log("✅ Socket.IO client disconnected.");

    // Optionally, you can also exit the process if you want
    process.exit(0);
  } catch (error) {
    console.error("Error during shutdown:", error);
    process.exit(1); // Exit with error if something goes wrong
  }
};

// Handle termination signals for graceful shutdown
process.on("SIGINT", shutdownGracefully); // Ctrl+C
process.on("SIGTERM", shutdownGracefully); // Termination signal (e.g., from Docker or cloud environments)

// Export consumeAvatarEvents to be used elsewhere
module.exports = { consumeAvatarEvents };
