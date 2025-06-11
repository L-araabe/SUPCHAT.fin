const express = require("express");
const router = express.Router();
const messageCtrl = require("../controllers/mesages.controller");
const { protect } = require("../middleware/auth");

router.post("/", protect, messageCtrl.sendMessage);
router.get("/:channelId", protect, messageCtrl.getChannelMessages);
router.put("/seen", protect, messageCtrl.markAsSeen);
router.delete("/:id", protect, messageCtrl.deleteMessage);
router.get("/unread/:channelId", protect, messageCtrl.unReadMessagesOfChannel);

module.exports = router;
