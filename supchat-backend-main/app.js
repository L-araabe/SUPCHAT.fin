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
app.use(helmet());
app.use(
  cors({
    origin: "*",
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());
app.use(
  hpp({
    whitelist: [],
  })
);
app.use(compression());

app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Server is healthy",
    environment: process.env.NODE_ENV,
  });
});

app.use(PATHS, routes);

// Middleware
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // your frontend URL
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  socket.on("setup", async (userId) => {
    // Save socket.id to DB here...
    socket.join(userId); // join personal room
    console.log(`✅ User ${userId} joined with socket ${socket.id}`);
  });

  socket.on(
    "message",
    async ({ sender, receiverId, chat, content, seenBy }) => {
      const populatedMessage = await receiveMessage({
        sender,
        chat,
        content,
        seenBy,
      });
      // Emit message to receiver's room
      console.log("receiver id", receiverId);
      if (Array.isArray(receiverId)) {
        receiverId.forEach((id) => {
          io.to(id).emit("receive-message", populatedMessage);
        });
      } else {
        io.to(receiverId).emit("receive-message", populatedMessage);
      }
    }
  );
  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
    // Optional: update user status in DB here
  });
});
