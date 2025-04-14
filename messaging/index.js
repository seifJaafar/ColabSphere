const dotenv = require("dotenv");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const sequelize = require("./config/sqlDatabase.js");
require("./config/socket.js");
const connectMongoDB = require("./config/MongoDB.js");
const startConsumer = require("./config/kafkaConsumers.js");
const startUserConsumer = require("./config/userKafkaConsumer.js");
const chatroomRoutes = require("./routes/ChatroomRoute.js");

dotenv.config();
const app = express();

// Security and logging middleware
app.use(helmet());
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/chatrooms", chatroomRoutes); // Changed to include /api prefix

// Not Found Middleware
app.use((req, res) => {
  res.status(404).json({
    error: "Endpoint Not Found",
    message: "The requested resource does not exist",
  });
});

// Centralized Error Handling
app.use((err, req, res, next) => {
  console.error(`🔥 Server error: ${err.stack}`);
  const status = err.status || 500;
  const message =
    process.env.NODE_ENV === "production"
      ? "Internal Server Error"
      : err.message;

  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
});

const startServices = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully!");
    await sequelize.sync({ alter: true }); // Added alter for dev environment
    await connectMongoDB();
    console.log("✅ MongoDB connected successfully!");
    await startConsumer();
    console.log("✅ Kafka consumer started successfully!");
    await startUserConsumer();
    console.log("✅ User Kafka consumer started successfully!");

    const gracefulShutdown = async () => {
      console.log("⚡ Shutting down gracefully...");
      await sequelize.close();
      process.exit(0);
    };

    process.on("SIGTERM", gracefulShutdown);
    process.on("SIGINT", gracefulShutdown);
  } catch (error) {
    console.error("❌ Error starting services:", error);
    process.exit(1);
  }
};

const PORT = process.env.PORT || 5003;
app.listen(PORT, async () => {
  console.log(`🚀 Messaging Service running on port ${PORT}`);
  await startServices();
});
