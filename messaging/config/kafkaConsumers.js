const { producer, connectProducer } = require("../config/kafkaProducer");
const { Kafka } = require("kafkajs");
const db = require("../models");
const { Chatroom, Chat, User } = db;

const kafka = new Kafka({
  clientId: "messaging-service",
  brokers: ["localhost:9092"], // Update as needed
});
const consumer = kafka.consumer({ groupId: "chatroom-creators" });

const startConsumer = async () => {
  // Connect both producer and consumer
  await connectProducer();
  await consumer.connect();

  await consumer.subscribe({ topic: "chatroom-creation" });
  await consumer.subscribe({ topic: "member-left-project" });
  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      try {
        if (topic === "member-left-project") {
          const { projectId, userId } = JSON.parse(message.value.toString());
          const chatrooms = await Chatroom.findAll({
            where: { projectID: projectId },
          });
          for (const chatroom of chatrooms) {
            await Chat.destroy({
              where: { chatroomID: chatroom.id, userID: userId },
            });
          }
        }
        if (topic === "chatroom-creation") {
          const { ownerID, projectId, title } = JSON.parse(
            message.value.toString()
          );

          // First check if user exists locally
          let user = await User.findByPk(ownerID);

          if (!user) {
            // Request user data from user service
            await producer.send({
              topic: "user-data-request",
              messages: [
                {
                  value: JSON.stringify({ userId: ownerID }),
                },
              ],
            });
            console.log(`Requested user data for ${ownerID}`);

            // Wait a reasonable time for response (or implement retry logic)
            await new Promise((resolve) => setTimeout(resolve, 500));
            user = await User.findByPk(ownerID);

            if (!user) {
              throw new Error(`User ${ownerID} data not available`);
            }
          }

          // Create chatroom
          const chatroom = await Chatroom.create({
            projectID: projectId,
            title: `${title} Discussion`,
            ownerID: ownerID,
          });

          // Add owner as member
          await Chat.create({
            chatroomID: chatroom.id,
            userID: ownerID,
          });

          console.log(`Created chatroom for project ${projectId}`);
        }
      } catch (error) {
        console.error("Error processing chatroom creation:", error);
      }
    },
  });
};

module.exports = startConsumer;
