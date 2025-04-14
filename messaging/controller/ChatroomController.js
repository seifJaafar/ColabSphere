const db = require("../models/index");
const { Chatroom, Chat, User } = db;
const Message = require("../nosqlModels/Message"); // Mongoose model
const { where, Op, Sequelize } = require("sequelize");

const getMessages = async (req, res) => {
  try {
    const userID = req.headers["x-user-id"];
    const chatroomID = req.params.chatroomID;

    // Validate inputs
    if (!userID) {
      return res.status(400).json({
        success: false,
        error: "User ID not provided",
      });
    }
    if (!chatroomID) {
      return res.status(400).json({
        success: false,
        error: "Chatroom ID not provided",
      });
    }

    // Check if chatroom exists (Sequelize)
    const chatroom = await Chatroom.findOne({
      where: { id: chatroomID },
    });
    if (!chatroom) {
      return res.status(404).json({
        success: false,
        error: "Chatroom not found",
      });
    }

    // Check if user has access to this chatroom (Sequelize)
    const userChat = await Chat.findOne({
      where: {
        userID: userID,
        chatroomID: chatroomID,
      },
    });
    if (!userChat) {
      return res.status(403).json({
        success: false,
        error: "User not authorized to access this chatroom",
      });
    }

    // Get messages (Mongoose)
    const messages = await Message.find({ chatroom_id: chatroomID })
      .sort({ createdAt: -1 }) // DESC order
      .lean(); // Convert to plain JS objects

    // Transform messages with sender info
    const formattedMessages = await Promise.all(
      messages.map(async (message) => {
        try {
          // Get sender info (assuming User is a Sequelize model)
          const sender = await db.User.findOne({
            where: { userID: message.sender_id },
            attributes: ["username", "avatar"], // Only get needed fields
          });

          return {
            id: message._id?.toString() || message.id,
            content: message.content?.text || message.content,
            senderId: message.sender_id,
            chatroom_id: message.chatroom_id,
            timestamp:
              message.createdAt?.toISOString() || new Date().toISOString(),
            senderName: sender?.username || "Unknown",
            senderAvatar: sender?.avatar || "/default-avatar.png",
          };
        } catch (error) {
          console.error("Error processing message:", error);
          return {
            id: message._id?.toString() || message.id,
            content: message.content?.text || message.content,
            sender_id: message.sender_id,
            chatroom_id: message.chatroom_id,
            timestamp:
              message.createdAt?.toISOString() || new Date().toISOString(),
            senderName: "Unknown",
            senderAvatar: "/default-avatar.png",
          };
        }
      })
    );

    return res.status(200).json({
      success: true,
      messages: formattedMessages,
    });
  } catch (err) {
    console.error("Error in getMessages:", err);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
      messages: [], // Return empty array on error
    });
  }
};

const getChatrooms = async (req, res) => {
  try {
    const userID = req.headers["x-user-id"];
    if (!userID) {
      return res.status(400).json({
        success: false,
        error: "User ID not provided",
      });
    }

    const chats = await Chat.findAll({
      where: { userID },
      include: [
        {
          model: Chatroom,
          as: "chatroom",
          required: true, // Ensure only chats with chatrooms are returned
        },
      ],
    });

    // Safely transform chatrooms data
    const chatrooms = chats
      .map((chat) => {
        if (!chat.chatroom) return null; // Skip if no chatroom
        return {
          id: chat.chatroom.id,
          title: chat.chatroom.title || "Untitled Chat",
          participants: chat.chatroom.participants || [],
          messages: chat.chatroom.messages || [],
          createdAt: chat.chatroom.createdAt,
          updatedAt: chat.chatroom.updatedAt,
        };
      })
      .filter((chatroom) => chatroom !== null); // Remove any null entries

    return res.status(200).json({
      success: true,
      chatrooms: chatrooms || [], // Ensure we always return an array
    });
  } catch (err) {
    console.error("Error in getChatrooms:", err);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
      chatrooms: [], // Return empty array on error
    });
  }
};
module.exports = {
  getChatrooms,
  getMessages,
};
