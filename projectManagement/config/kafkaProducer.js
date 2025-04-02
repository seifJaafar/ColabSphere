const { Kafka } = require("kafkajs");
const dotenv = require("dotenv");
dotenv.config();

const kafka = new Kafka({
  clientId: "projects-service",
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
const InviteMembers = async (emails, projectId) => {
  try {
    // Connect to the Kafka broker
    await producer.connect();

    // Send the message to Kafka
    await producer.send({
      topic: "user-service-invite-members", // Topic for user service to consume
      messages: [
        {
          value: JSON.stringify({ emails, projectId }), // Message containing emails
        },
      ],
    });

    console.log(
      `✅ Successfully sent invite details to Kafka for ${emails.length} members`
    );
  } catch (err) {
    console.error("❌ Error inviting members using Kafka:", err);
  } finally {
    await producer.disconnect();
  }
};
const sendProjectCreatedMessage = async (userId, projectId, roles) => {
  try {
    // Connect to the Kafka broker
    await producer.connect();

    // Send the message to Kafka
    await producer.send({
      topic: "user-service-project-created", // Topic for user service to consume
      messages: [
        {
          value: JSON.stringify({ userId, projectId, roles }), // Message containing userId and projectId
        },
      ],
    });

    console.log(
      `✅ Successfully sent project creation details for user ${userId} to Kafka`
    );
  } catch (error) {
    console.error("❌ Error sending project creation message to Kafka:", error);
  } finally {
    // Disconnect the producer after sending the message
    await producer.disconnect();
  }
};

// Handle termination signals for graceful shutdown
process.on("SIGINT", shutdownGracefully); // Ctrl+C
process.on("SIGTERM", shutdownGracefully); // Termination signal (e.g., from Docker or cloud environments)

module.exports = {
  producer,
  connectProducer,
  sendProjectCreatedMessage,
  InviteMembers,
};
