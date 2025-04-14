const mongoose = require("mongoose");
const { Schema } = mongoose;

const ContentSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["text", "image", "file"],
      required: true,
    },
    text: {
      type: String,
      required: function () {
        return this.type === "text";
      },
    },
    url: {
      type: String,
      required: function () {
        return this.type === "image" || this.type === "file";
      },
    },
    filename: {
      type: String,
      required: function () {
        return this.type === "file";
      },
    },
  },
  { _id: false }
); // No separate ID for the nested content

const MessageSchema = new Schema({
  chatroom_id: {
    type: String, // References PostgreSQL chatroom.id (UUID)
    required: true,
    index: true,
  },
  sender_id: {
    type: String, // References PostgreSQL user.id (UUID)
    required: true,
  },
  content: {
    type: ContentSchema,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

// Index for faster querying by chatroom and timestamp
MessageSchema.index({ chatroom_id: 1, timestamp: -1 });

module.exports = mongoose.model("Message", MessageSchema);
