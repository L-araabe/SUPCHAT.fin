const Channel = require("../models/channel.model");
const Chat = require("../models/chat.model");
const { AppError, catchAsync } = require("../utils/errorHandler");

// Create a new channel inside a group
exports.createChannel = catchAsync(async (req, res) => {
  const { group, channelName, isPublic, members } = req.body;

  const chat = await Chat.findById(group);
  if (!chat || !chat.isGroupChat) {
    throw new AppError("Group not found", 404);
  }

  const channel = await Channel.create({
    channelName,
    group,
    isPublic,
    members: isPublic ? [] : members,
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

// Get channel by id
exports.getChannelById = catchAsync(async (req, res) => {
  const channel = await Channel.findById(req.params.id);
  if (!channel) throw new AppError("Channel not found", 404);
  res.status(200).json({ status: "success", data: channel });
});
