const { Kafka } = require("kafkajs");
const dotenv = require("dotenv");
dotenv.config();

const kafka = new Kafka({
  clientId: "file-storage-service",
  brokers: [process.env.KAFKA_BROKER || "localhost:9092"], // Replace with your broker address
});

const consumer = kafka.consumer({ groupId: "file-storage-group" });

const connectConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "file-upload", fromBeginning: false });
};

module.exports = { consumer, connectConsumer };
