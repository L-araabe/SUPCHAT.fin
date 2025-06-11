const express = require("express");
const router = express.Router();
const messageCtrl = require("../controllers/mesages.controller");
const { protect } = require("../middleware/auth");

router.post("/", protect, messageCtrl.sendMessage);
router.get("/channel/:channelId", protect, messageCtrl.getChannelMessages);
router.get("/unread/channel/:channelId", protect, messageCtrl.unReadMessagesOfChannel);
router.get("/:chatId", protect, messageCtrl.getChatMessages);
router.put("/seen", protect, messageCtrl.markAsSeen);
router.delete("/:id", protect, messageCtrl.deleteMessage);
router.get("/unread/:chatId", protect, messageCtrl.unReadMessagesOfChat);

module.exports = router;
