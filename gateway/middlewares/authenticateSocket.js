import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
export const authenticateSocket = (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error("Unauthorized"));

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    socket.user = decoded; // Attach user data to the socket
    next();
  } catch (error) {
    return next(new Error("Invalid token"));
  }
};
