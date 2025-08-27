import app from "./app.js";
import cloudinary from "cloudinary";
import http from "http";
import { Server } from "socket.io";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
  api_key: process.env.CLOUDINARY_CLIENT_API,
  api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [process.env.FRONTEND_URL || "http://localhost:5173"],
    credentials: true,
  },
});

const userSocketMap = {};
export const getReceiverSocketId = (userId) => userSocketMap[userId];

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  userSocketMap[userId] = socket.id;
  if (userId) userSocketMap[userId] = socket.id;

  // Emit online users on new connection
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Handle new message
  socket.on("newMessage", (message) => {
    io.emit("newMessage", message); // Broadcast to all users
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io };

// Optional: handle POST messages via HTTP
app.post("/message/send", (req, res) => {
  const message = req.body;
  io.emit("newMessage", message);
  res.json(message);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
