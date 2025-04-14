const { Kafka } = require("kafkajs");
const dotenv = require("dotenv");
dotenv.config();

const kafka = new Kafka({
  clientId: "projects-service",
  brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
});

// Single producer instance for the entire application
const producer = kafka.producer();

// Connect producer when the service starts
const connectProducer = async () => {
  try {
    await producer.connect();
    console.log("✅ Kafka producer connected.");
  } catch (err) {
    console.error("❌ Failed to connect Kafka producer:", err);
    throw err; // Re-throw to handle in the calling code
  }
};

// Reusable message sending function
const sendKafkaMessage = async (topic, message) => {
  try {
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
    console.log(`✅ Successfully sent message to ${topic}`);
  } catch (err) {
    console.error(`❌ Error sending message to ${topic}:`, err);
    throw err;
  }
};

const createChatroom = async (projectId, title, ownerID) => {
  await sendKafkaMessage("chatroom-creation", { title, projectId, ownerID });
};

const InviteMembers = async (emails, projectId) => {
  await sendKafkaMessage("user-service-invite-members", { emails, projectId });
};
const MemberLeftProject = async (projectId, userId) => {
  await sendKafkaMessage("member-left-project", { projectId, userId });
};
const sendProjectCreatedMessage = async (userId, projectId, roles) => {
  await sendKafkaMessage("user-service-project-created", {
    userId,
    projectId,
    roles,
  });
};

const shutdownGracefully = async () => {
  console.log("❌ Shutting down gracefully...");
  try {
    await producer.disconnect();
    console.log("✅ Kafka producer disconnected.");
    process.exit(0);
  } catch (error) {
    console.error("Error during shutdown:", error);
    process.exit(1);
  }
};

// Handle termination signals
process.on("SIGINT", shutdownGracefully);
process.on("SIGTERM", shutdownGracefully);

module.exports = {
  producer,
  connectProducer,
  sendProjectCreatedMessage,
  InviteMembers,
  createChatroom,
  MemberLeftProject,
};
