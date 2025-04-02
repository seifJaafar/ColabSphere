import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { createServer } from "http";
import { limiter } from "./middlewares/rateLimiter.js";
import router from "./routes.js";
import { initializeSocket } from "./config/socket.js";
// Initialize Express
const app = express();
app.use(helmet());
app.use(
  cors({
    origin: [process.env.CLIENT_URL],
    credentials: true,
  })
);
app.use(morgan("combined"));
app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For form data
app.use("/", router);

// Not Found Handler
app.use((req, res) => {
  res.status(404).json({ error: "Page Not Found" });
});

// Centralized Error Handling
app.use((err, req, res, next) => {
  console.error(`🔥 Server error: ${err.message}`);
  res.status(err.status || 500).json({ error: "Internal Server Error" });
});

// Graceful Shutdown
process.on("SIGINT", () => {
  console.log("🛑 Shutting down API Gateway...");
  process.exit();
});

// Start Server
const PORT = process.env.PORT || 5000;
const httpServer = createServer(app);
initializeSocket(httpServer);
httpServer.listen(PORT, () =>
  console.log(`🚀 API Gateway running on port ${PORT}`)
);
