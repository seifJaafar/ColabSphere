const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "avatar-service",
  brokers: ["localhost:9092"], // Change this based on your setup
});

const producer = kafka.producer();

const publishAvatarEvent = async (userId, avatarUrl) => {
  await producer.connect();
  await producer.send({
    topic: "user-avatar-updated",
    messages: [{ value: JSON.stringify({ userId, avatarUrl }) }],
  });
  await producer.disconnect();
};

module.exports = { publishAvatarEvent };
