const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chat.controller");
const { protect } = require("../middleware/auth"); // auth middleware

router.post("/", protect, chatController.createChat);
router.get("/", protect, chatController.getUserChats);
router.get("/:id", protect, chatController.getChatById);
router.delete("/:id", protect, chatController.deleteChat);
router.put("/rename", protect, chatController.renameGroupChat);

module.exports = router;
