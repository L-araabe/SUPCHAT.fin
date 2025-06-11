const message = require("../models/message.model");
const chat = require("../models/chat.model");
const channel = require("../models/channel.model");

exports.receiveMessage = async (data) => {
  try {
    const newMessage = await message.create(data);
    if (data?.channel) {
      await channel.findByIdAndUpdate(data.channel, {
        latestMessage: newMessage._id,
      });
    }
    const populatedMessage = await message
      .findById(newMessage._id)
      .populate("sender", "name email")
      .populate("channel");
    return populatedMessage;
  } catch (e) {
    console.log("error occured receiving message", e);
  }
};
