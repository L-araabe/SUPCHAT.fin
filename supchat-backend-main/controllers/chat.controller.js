const Chat = require("../models/chat.model");
const Channel = require("../models/channel.model");
const { AppError, catchAsync } = require("../utils/errorHandler");

// ✅ Create a new chat
exports.createChat = catchAsync(async (req, res) => {
  const { users, isGroupChat, chatName, groupAdmin } = req.body;

  if (!users || users.length < 2) {
    throw new AppError("A chat must have at least two users", 400);
  }

  const chats = await Chat.create({
    users,
    isGroupChat,
    chatName: isGroupChat ? chatName : undefined,
    groupAdmin: isGroupChat ? groupAdmin : undefined,
  });

  if (isGroupChat) {
    await Channel.create({
      name: "general",
      group: chats._id,
      isPrivate: false,
    });
  }

  const chat = await Chat.findById(chats?._id)
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .populate({
      path: "latestMessage",
      populate: {
        path: "sender",
        select: "name email",
      },
    })
    .sort({ updatedAt: -1 });
  res.status(201).json({
    status: "success",
    data: chat,
  });
});

// ✅ Get all chats for a user
exports.getUserChats = catchAsync(async (req, res) => {
  const userId = req.user._id; // assuming user is attached to req via auth middleware

  const chats = await Chat.find({ users: userId })
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .populate({
      path: "latestMessage",
      populate: {
        path: "sender",
        select: "name email",
      },
    })
    .sort({ updatedAt: -1 });

  res.status(200).json({
    status: "success",
    results: chats.length,
    data: chats,
  });
});

// ✅ Get chat by ID
exports.getChatById = catchAsync(async (req, res) => {
  const chatId = req.params.id;

  const chat = await Chat.findById(chatId)
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .populate("latestMessage");

  if (!chat) {
    throw new AppError("Chat not found", 404);
  }

  res.status(200).json({
    status: "success",
    data: chat,
  });
});

// ✅ Delete a chat
exports.deleteChat = catchAsync(async (req, res) => {
  const chatId = req.params.id;

  const chat = await Chat.findByIdAndDelete(chatId);

  if (!chat) {
    throw new AppError("Chat not found or already deleted", 404);
  }

  res.status(200).json({
    status: "success",
    message: "Chat deleted successfully",
  });
});

// ✅ Update chat name (for group chats)
exports.renameGroupChat = catchAsync(async (req, res) => {
  const { chatId, newName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    { chatName: newName },
    { new: true }
  );

  if (!updatedChat) {
    throw new AppError("Group chat not found", 404);
  }

  res.status(200).json({
    status: "success",
    data: updatedChat,
  });
});
