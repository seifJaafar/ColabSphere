const { Kafka } = require("kafkajs");
const dotenv = require("dotenv");
dotenv.config();

const kafka = new Kafka({
  clientId: "user-service",
  brokers: [process.env.KAFKA_BROKER || "localhost:9092"], // Update with your broker address
});

const producer = kafka.producer();

// Function to connect the producer
const connectProducer = async () => {
  await producer.connect();
  console.log("✅ Kafka producer connected.");
};

// Graceful shutdown function
const shutdownGracefully = async () => {
  console.log("❌ Shutting down gracefully...");

  try {
    // Disconnect the Kafka producer
    await producer.disconnect();
    console.log("✅ Kafka producer disconnected.");

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

module.exports = { producer, connectProducer };
