require("dotenv").config();
const mongoose = require("mongoose");
const Chat = require("../models/chat.model");
const Channel = require("../models/channel.model");
const Message = require("../models/message.model");

mongoose
  .connect(process.env.MONGO_URL || "mongodb://localhost:27017/sup_chat")
  .then(async () => {
    const groups = await Chat.find({ isGroupChat: true });
    for (const group of groups) {
      let channel = await Channel.findOne({ group: group._id });
      if (!channel) {
        channel = await Channel.create({
          name: "general",
          group: group._id,
          isPrivate: false,
        });
      }
      await Message.updateMany({ chat: group._id }, { channel: channel._id });
    }
    console.log("Migration completed");
    process.exit();
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
