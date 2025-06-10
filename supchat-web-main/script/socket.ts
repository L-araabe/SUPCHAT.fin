// socket.js
import { io } from "socket.io-client";
import { BACKEND_URL } from "../src/constants/variables";

export const socket = io(BACKEND_URL, {
  cors: {
    origin: "http://localhost:5173", // your frontend URL
    methods: ["GET", "POST"],
  },
});
