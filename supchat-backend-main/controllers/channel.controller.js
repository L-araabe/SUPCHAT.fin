const Channel = require('../models/channel.model');
const Workspace = require('../models/workspace.model');
const { AppError, catchAsync } = require('../utils/errorHandler');

exports.createChannel = catchAsync(async (req, res) => {
  const { name, workspaceId, isPrivate } = req.body;
  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) throw new AppError('Workspace not found', 404);
  const channel = await Channel.create({
    name,
    workspace: workspaceId,
    isPrivate,
    members: [req.user.id],
  });
  res.status(201).json({ status: 'success', data: channel });
});

exports.getWorkspaceChannels = catchAsync(async (req, res) => {
  const { workspaceId } = req.params;
  const channels = await Channel.find({ workspace: workspaceId });
  res.status(200).json({ status: 'success', results: channels.length, data: channels });
});
