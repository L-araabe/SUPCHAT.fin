const express = require("express");
const router = express.Router();
const messageCtrl = require("../controllers/mesages.controller");
const { protect } = require("../middleware/auth");

router.post("/", protect, messageCtrl.sendMessage);
router.get("/:chatId", protect, messageCtrl.getChatMessages);
router.get("/channel/:channelId", protect, messageCtrl.getChannelMessages);
router.put("/seen", protect, messageCtrl.markAsSeen);
router.delete("/:id", protect, messageCtrl.deleteMessage);
router.get("/unread/:chatId", protect, messageCtrl.unReadMessagesOfChat);
router.get("/unread/channel/:channelId", protect, messageCtrl.unReadMessagesOfChannel);

module.exports = router;
