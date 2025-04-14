import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
export const authenticateSocket = (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error("Unauthorized"));

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    socket.user = decoded;
    if (decoded.id?.includes("_service")) {
      socket.role = "service"; // Assign role based on ID pattern
    } else {
      socket.role = "user"; // Assign role based on ID pattern
    }
    next();
  } catch (error) {
    return next(new Error("Invalid token"));
  }
};
