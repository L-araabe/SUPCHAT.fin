require("dotenv").config();
const express = require("express");
require("./db/index");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const compression = require("compression");
const { Server } = require("socket.io");
const { PATHS } = require("./constants/route.constants");
const routes = require("./routes/index");
const { receiveMessage } = require("./utils/helpingFunctions");

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(helmet());
app.use(cors({ origin: "*", credentials: true, optionsSuccessStatus: 200 }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp({ whitelist: [] }));
app.use(compression());

// Routes
app.get("/api/v1/health", (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Server is healthy",
        environment: process.env.NODE_ENV,
    });
});
app.use(PATHS, routes);
app.get("/", (req, res) => {
    res.send("Backend is running!");
});

// Start the server
const server = app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});

// Socket.io
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.id);

    socket.on("setup", async (userId) => {
        socket.join(userId);
        console.log(`✅ User ${userId} joined with socket ${socket.id}`);
    });

  socket.on("message", async ({ sender, receiverId, channel, content, seenBy }) => {
        const populatedMessage = await receiveMessage({ sender, channel, content, seenBy });
        if (Array.isArray(receiverId)) {
            receiverId.forEach((id) => {
                io.to(id).emit("receive-message", populatedMessage);
            });
        } else {
            io.to(receiverId).emit("receive-message", populatedMessage);
        }
    });

    socket.on("disconnect", () => {
        console.log("🔴 User disconnected:", socket.id);
    });
});
