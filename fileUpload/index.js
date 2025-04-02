const dotenv = require("dotenv"); // Automatically loads .env variables
const express = require("express");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const FileRoute = require("./routes/fileRoutes");
const MailingRoute = require("./routes/mailingRoutes");
const { connectConsumer } = require("./config/kafka");
const {
  startFileConsumer,
  shutdownConsumer,
} = require("./consumers/avatarConsumer");
const app = express();

app.use(cookieParser());
app.use(helmet());
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/files", FileRoute);
app.use("/mails", MailingRoute);

// Not Found Middleware
app.use((req, res) => {
  res.status(404).json({ error: "Page Not Found" });
});

// Centralized Error Handling
app.use((err, req, res, next) => {
  console.error(`🔥 Server error: ${err.message}`);
  res.status(err.status || 500).json({ error: "Internal Server Error" });
});
const ConnectKafka = async () => {
  try {
    await connectConsumer();
    await startFileConsumer();
  } catch (error) {
    console.error("❌ Kafka producer connection failed:", error);
  }
};
ConnectKafka();
process.on("SIGINT", async () => {
  console.log("⚡ Shutting down gracefully...");
  await shutdownConsumer();
  process.exit(0); // Exit the process after cleanup
});

process.on("SIGTERM", async () => {
  console.log("⚡ Shutting down gracefully...");
  await shutdownConsumer();
  process.exit(0); // Exit the process after cleanup
});
const PORT = process.env.PORT || 5005;
app.listen(PORT, () =>
  console.log(`File Upload Service running on port ${PORT}`)
);
