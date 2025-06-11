const express = require('express');
const router = express.Router();
const channelCtrl = require('../controllers/channel.controller');
const { protect } = require('../middleware/auth');

router.use(protect);
router.post('/', channelCtrl.createChannel);
router.get('/:workspaceId', channelCtrl.getWorkspaceChannels);

module.exports = router;
