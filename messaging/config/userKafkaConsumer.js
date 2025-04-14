const { Kafka } = require("kafkajs");
const db = require("../models");
const { User, Chatroom, Chat } = db;

const kafka = new Kafka({
  clientId: "messaging-service",
  brokers: ["localhost:9092"], // Update as needed
});
const consumer = kafka.consumer({ groupId: "user-data-consumers" });

const startUserConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "user-data-response" });
  await consumer.subscribe({
    topic: "user-joined-project",
    fromBeginning: false,
  });
  await consumer.subscribe({
    topic: "user-invited-to-project",
    fromBeginning: false,
  });
  await consumer.subscribe({
    topic: "user-service-avatar-updated",
    fromBeginning: false,
  });
  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      if (topic === "user-service-avatar-updated") {
        const { userId, avatarUrl } = JSON.parse(message.value.toString());
        const user = await User.findByPk(userId);
        if (!user) {
          console.error(`❌ User ${userId} not found`);
          return;
        }
        user.avatar = avatarUrl;
        await user.save();
        console.log(`Updated avatar for user ${userId}`);
      }
      if (topic === "user-joined-project") {
        try {
          console.log(`Received user joined data `);
          const { userID, username, avatar, projectID } = JSON.parse(
            message.value.toString()
          );

          console.log(
            `Received user data for ${username} (${userID}) from user service`
          );

          const chatroom = await Chatroom.findOne({
            where: { projectID },
          });
          if (!chatroom) {
            console.error(`Chatroom not found for projectID ${projectID}`);
            return;
          }
          await User.upsert({
            userID,
            username,
            avatar,
          });
          await Chat.create({
            chatroomID: chatroom.id,
            userID,
          });

          console.log(
            `User ${username} (${userID}) added to chatroom ${chatroom.id}`
          );
        } catch (error) {
          console.error("Error processing user data:", error);
        }
      }
      if (topic === "user-invited-to-project") {
        try {
          const { validUsers, projectId } = JSON.parse(
            message.value.toString()
          );
          const chatroom = await Chatroom.findOne({
            where: { projectID: projectId },
          });
          if (!chatroom) {
            console.error(`Chatroom not found for projectID ${projectId}`);
            return;
          }
          for (let validUser of validUsers) {
            const { id, username, avatar } = validUser;

            await User.upsert({
              userID: id,
              username,
              avatar,
            });
            await Chat.create({
              chatroomID: chatroom.id,
              userID: id,
            });
          }
        } catch (error) {
          console.error("Error processing user data:", error);
        }
      } else {
        try {
          const { userID, username, avatar } = JSON.parse(
            message.value.toString()
          );
          console.log(
            `Received user data for ${username} (${userID}) from user service`
          );
          await User.upsert({
            userID,
            username,
            avatar,
          });

          console.log(
            `Updated user ${username} (${userID}) in messaging service`
          );
        } catch (error) {
          console.error("Error processing user data:", error);
        }
      }
    },
  });
};

module.exports = startUserConsumer;
