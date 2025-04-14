const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID || "messaging-service",
  brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
});

// Create reusable producer instance
const producer = kafka.producer();

const connectProducer = async () => {
  await producer.connect();
  console.log("✅ Kafka producer connected");
  return producer;
};

module.exports = {
  kafka,
  producer,
  connectProducer,
};
