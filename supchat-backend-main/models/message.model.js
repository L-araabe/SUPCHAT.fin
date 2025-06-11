const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: { type: String, required: true },
    // Direct messages can still use the chat field
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "chats" },
    // Messages inside a workspace channel
    channel: { type: mongoose.Schema.Types.ObjectId, ref: "Channel" },
    seenBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const model = mongoose.model("messages", messageSchema);

module.exports = model;
