const dotenv = require("dotenv"); // Automatically loads .env variables
const express = require("express");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const sequelize = require("./config/database");
const morgan = require("morgan");
const projectRouter = require("./routes/projectRoutes");
const moduleRouter = require("./routes/modulRoutes");
const taskRouter = require("./routes/tasksRoutes");
const taskDependencyRouter = require("./routes/taskDependancyRoute");
const { consumeTeamServiceTopic } = require("./config/kafkaConsumer");
const { connectProducer } = require("./config/kafkaProducer");
dotenv.config();
const app = express();

app.use(cookieParser());
app.use(helmet());
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/projects", projectRouter);
app.use("/modules", moduleRouter);
app.use("/tasks", taskRouter);
app.use("/dependencies", taskDependencyRouter);
app.use((req, res) => {
  res.status(404).json({ error: "Page Not Found" });
});

// Centralized Error Handling
app.use((err, req, res, next) => {
  console.error(`🔥 Server error: ${err.message}`);
  res.status(err.status || 500).json({ error: "Internal Server Error" });
});

// Function to Initialize Services
const startServices = async () => {
  try {
    // ✅ Connect to Database
    await sequelize.authenticate();
    console.log("✅ Database connected successfully!");
    await sequelize.sync();
    await connectProducer(); // ✅ Connect to Kafka Producer
    console.log("✅ Kafka producer connected successfully!");
    await consumeTeamServiceTopic();
    console.log("✅ Kafka consumer (Team Service) started!");
  } catch (error) {
    console.error("❌ Error starting services:", error);
  }
};

// Start Server
const PORT = process.env.PORT || 5002;
app.listen(PORT, async () => {
  console.log(`🚀 Project Service running on port ${PORT}`);
  await startServices(); // ✅ Initialize services
});
