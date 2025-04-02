const dotenv = require("dotenv"); // Automatically loads .env variables
const express = require("express");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const passport = require("./config/passeport");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/usersRoutes");
const sequelize = require("./config/database");
const { connectProducer } = require("./config/kafka");
const { consumeAvatarEvents } = require("./config/kafkaConsumer"); // ✅ Fixed typo

dotenv.config();
const app = express();

app.use(cookieParser());
app.use(helmet());
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

app.use("/auth", authRoutes);
app.use("/user", userRoutes);

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

    // ✅ Connect Kafka Producer
    await connectProducer();
    console.log("✅ Kafka producer connected successfully!");

    // ✅ Start Kafka Consumer
    await consumeAvatarEvents();
    console.log("✅ Kafka consumer (Avatar Updates) started!");
  } catch (error) {
    console.error("❌ Error starting services:", error);
  }
};

// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, async () => {
  console.log(`🚀 User Service running on port ${PORT}`);
  await startServices(); // ✅ Initialize services
});
