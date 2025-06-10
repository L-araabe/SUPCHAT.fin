const router = require("express").Router();
const authRoutes = require("../routes/auth.routes");
const userRoutes = require("../routes/user.routes");
const chatRoutes = require("../routes/chat.route");
const messagesRoutes = require("../routes/messages.routes");
const groupinvite = require("../routes/groupinvite.route");
const { ROUTES } = require("../constants/route.constants");

router.use(ROUTES.AUTH.ROOT, authRoutes);
router.use(ROUTES.USER.ROOT, userRoutes);
router.use("/chat", chatRoutes);
router.use("/groupinvite", groupinvite);
router.use("/message", messagesRoutes);

module.exports = router;
