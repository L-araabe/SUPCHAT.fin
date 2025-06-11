const Message = require("../models/message.model");
const Channel = require("../models/channel.model");
const { AppError, catchAsync } = require("../utils/errorHandler");

// ✅ Send a message
exports.sendMessage = catchAsync(async (req, res) => {
  const { content, channelId } = req.body;

  if (!content || !channelId) {
    throw new AppError("Invalid data passed into request", 400);
  }

  const newMessage = await Message.create({
    sender: req.user.id,
    content,
    channel: channelId,
  });

  // Update latest message in Channel
  await Channel.findByIdAndUpdate(channelId, {
    latestMessage: newMessage._id,
  });

  const populatedMessage = await Message.findById(newMessage._id)
    .populate("sender", "name email")
    .populate("channel");

  res.status(201).json({
    status: "success",
    data: populatedMessage,
  });
});

// ✅ Get all messages for a channel
exports.getChannelMessages = catchAsync(async (req, res) => {
  const channelId = req.params.channelId;

  const messages = await Message.find({ channel: channelId })
    .populate("sender", "name email profilePicture")
    .populate("channel");

  res.status(200).json({
    status: "success",
    results: messages.length,
    data: messages,
  });
});

exports.unReadMessagesOfChannel = catchAsync(async (req, res) => {
  const channelId = req.params.channelId;
  const userId = req.user.id;
  const messages = await Message.find({
    channel: channelId,
    seenBy: { $ne: userId }, // userId is NOT in the seenBy array
  });
  res.status(200).json({
    status: "success",
    result: messages?.length,
    data: { unreadMessages: messages?.length },
  });
});

// ✅ Mark message(s) as seen
exports.markAsSeen = catchAsync(async (req, res) => {
  const { messageIds } = req.body; // array of message IDs

  if (!Array.isArray(messageIds) || messageIds.length === 0) {
    throw new AppError("No messages provided", 400);
  }

  await Message.updateMany(
    { _id: { $in: messageIds } },
    { $addToSet: { seenBy: req.user.id } }
  );

  res.status(200).json({
    status: "success",
    message: "Messages marked as seen",
  });
});

// ✅ Optional: Delete a message
exports.deleteMessage = catchAsync(async (req, res) => {
  const messageId = req.params.id;

  const message = await Message.findById(messageId);
  if (!message) throw new AppError("Message not found", 404);

  // Optional: Only allow sender to delete
  if (message.sender.toString() !== req.user.id) {
    throw new AppError("Unauthorized to delete this message", 403);
  }

  await message.deleteOne();

  res.status(200).json({
    status: "success",
    message: "Message deleted",
  });
});
