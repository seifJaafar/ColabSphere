import express from "express";
import { createServiceProxy } from "./proxy/proxyMiddleware.js";
import { authenticate } from "./middlewares/authenticate.js";
import { services } from "./config/envValidation.js";
const router = express.Router();
// Public Routes (No Authentication)
router.use("/authService", createServiceProxy(services.users));
router.get("/validate", authenticate, (req, res) => {
  res.json({ user: req.user, valid: true });
});
// Protected Routes (Require Authentication)
router.use("/usersService", authenticate, createServiceProxy(services.users));
router.use(
  "/projectsService",
  authenticate,
  createServiceProxy(services.projects)
);
router.use(
  "/tasksService",
  authenticate,
  createServiceProxy(services.projects)
);
router.use(
  "/subscriptions",
  authenticate,
  createServiceProxy(services.projects)
);
router.use(
  "/chatroomsService",
  authenticate,
  createServiceProxy(services.messages)
);
router.use(
  "/messagesService",
  authenticate,
  createServiceProxy(services.messages)
);
router.use(
  "/notificationsService",
  authenticate,
  createServiceProxy(services.notifs)
);
router.use("/filesService", authenticate, createServiceProxy(services.files));
router.use("/mailingService", authenticate, createServiceProxy(services.files));

export default router;
