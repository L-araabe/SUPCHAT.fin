const Workspace = require('../models/workspace.model');
const { AppError, catchAsync } = require('../utils/errorHandler');

exports.createWorkspace = catchAsync(async (req, res) => {
  const { name } = req.body;
  const owner = req.user.id;
  const workspace = await Workspace.create({ name, owner, members: [owner] });
  res.status(201).json({ status: 'success', data: workspace });
});

exports.getWorkspaces = catchAsync(async (req, res) => {
  const workspaces = await Workspace.find({ members: req.user.id });
  res.status(200).json({ status: 'success', results: workspaces.length, data: workspaces });
});
