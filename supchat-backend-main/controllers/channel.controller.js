const Channel = require("../models/channel.model");
const Chat = require("../models/chat.model");
const { AppError, catchAsync } = require("../utils/errorHandler");

// Create a new channel inside a group
exports.createChannel = catchAsync(async (req, res) => {
  const { name, group, isPrivate, members } = req.body;

  const chat = await Chat.findById(group);
  if (!chat || !chat.isGroupChat) {
    throw new AppError("Group not found", 404);
  }

  const channel = await Channel.create({
    name,
    group,
    isPrivate,
    members: isPrivate ? members : [],
  });

  res.status(201).json({ status: "success", data: channel });
});

// Get channels for a group
exports.getChannelsForGroup = catchAsync(async (req, res) => {
  const groupId = req.params.groupId;
  const channels = await Channel.find({ group: groupId });
  res
    .status(200)
    .json({ status: "success", results: channels.length, data: channels });
});

// Get a channel by id
exports.getChannelById = catchAsync(async (req, res) => {
  const channel = await Channel.findById(req.params.id);
  if (!channel) throw new AppError("Channel not found", 404);
  res.status(200).json({ status: "success", data: channel });
});

// Update channel name
exports.updateChannel = catchAsync(async (req, res) => {
  const { name } = req.body;
  const channel = await Channel.findByIdAndUpdate(
    req.params.id,
    { name },
    { new: true }
  );
  if (!channel) throw new AppError("Channel not found", 404);
  res.status(200).json({ status: "success", data: channel });
});

// Delete a channel
exports.deleteChannel = catchAsync(async (req, res) => {
  const channel = await Channel.findByIdAndDelete(req.params.id);
  if (!channel) throw new AppError("Channel not found", 404);
  res.status(200).json({ status: "success", message: "Channel deleted" });
});

// Invite user to private channel
exports.inviteToChannel = catchAsync(async (req, res) => {
  const channelId = req.params.id;
  const { userId } = req.body;
  const channel = await Channel.findById(channelId);
  if (!channel) throw new AppError("Channel not found", 404);
  if (!channel.isPrivate) {
    throw new AppError("Cannot invite to a public channel", 400);
  }
  await Channel.findByIdAndUpdate(channelId, {
    $addToSet: { members: userId },
  });
  res.status(200).json({ status: "success" });
});
