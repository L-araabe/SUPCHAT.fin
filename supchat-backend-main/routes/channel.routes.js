const router = require("express").Router();
const channelCtrl = require("../controllers/channel.controller");
const { protect } = require("../middleware/auth");

router.post("/", protect, channelCtrl.createChannel);
router.get("/group/:groupId", protect, channelCtrl.getChannelsForGroup);
router.get("/:id", protect, channelCtrl.getChannelById);
router.put("/:id", protect, channelCtrl.updateChannel);
router.delete("/:id", protect, channelCtrl.deleteChannel);
router.post("/:id/invite", protect, channelCtrl.inviteToChannel);

module.exports = router;
