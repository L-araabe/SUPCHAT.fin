const express = require('express');
const router = express.Router();
const workspaceCtrl = require('../controllers/workspace.controller');
const { protect } = require('../middleware/auth');

router.use(protect);
router.post('/', workspaceCtrl.createWorkspace);
router.get('/', workspaceCtrl.getWorkspaces);

module.exports = router;
