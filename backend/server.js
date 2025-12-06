import app from "./app.js";
import cloudinary from "cloudinary";
import { Server } from "socket.io";
import { createServer } from "http";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
  api_key: process.env.CLOUDINARY_CLIENT_API,
  api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
});

// Set the port
const PORT = process.env.PORT || 3000;

const httpServer = createServer(app);
export const io = new Server(httpServer, {
  cors: {
    origin: "*",
    credentials: true
  }
});

app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; connect-src 'self' http://localhost:3000; script-src 'self'; style-src 'self'"
  );
  next();
});

const userSocketMap = {};
export const getReceiverSocketId = (userId) => userSocketMap[userId];

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("welcome", (message) => {
    console.log("Received 'welcome' event from client:", message);
  });

  socket.emit("welcome", "message sent from server");

  socket.on("join", ({ roomId, user }) => {
    socket.join(roomId);
    console.log(`${user} joined room: ${roomId}`);
  });

  socket.on("sendMessage", ({ room, sender, message }) => {
    io.to(room).emit("recieveMessage", { sender, message });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

httpServer.listen(PORT, () => {
  console.log(`IO Server running at port ${PORT}`);
});