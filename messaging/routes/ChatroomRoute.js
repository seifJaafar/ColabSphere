const express = require("express");
const {
  getChatrooms,
  getMessages,
} = require("../controller/ChatroomController.js");

const router = express.Router();

// GET /api/chatrooms - Get all chatrooms for the current user
router.get("/", getChatrooms);
router.get("/:chatroomID", getMessages);

module.exports = router;
