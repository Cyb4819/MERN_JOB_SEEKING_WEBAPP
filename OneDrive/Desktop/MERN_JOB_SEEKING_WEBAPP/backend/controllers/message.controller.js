import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "cloudinary";
import { getReceiverSocketId, io } from "../server.js";
// Get recent chat users for sidebar
export async function getRecentChats(req, res) {
  try {
    const userId = req.user._id;
    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }]
    });
    const userIds = new Set();
    messages.forEach(msg => {
      if (msg.senderId.toString() !== userId.toString()) userIds.add(msg.senderId.toString());
      if (msg.receiverId.toString() !== userId.toString()) userIds.add(msg.receiverId.toString());
    });
    const users = await User.find({ _id: { $in: Array.from(userIds) } }).select("name email profilePic");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function searchUsers(req, res) {
  try {
    const query = req.query.q || "";
    if (!query) return res.status(200).json([]);
    const userId = req.user._id;
    const users = await User.find({
      $and: [
        { _id: { $ne: userId } },
        {
          $or: [
            { name: { $regex: query, $options: "i" } },
            { email: { $regex: query, $options: "i" } }
          ]
        }
      ]
    }).select("name email profilePic");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}
// Get users for sidebar
async function getUsersForSidebar(req, res) {
  try {
    const currentUserId = req.user._id;

    const users = await User.find({ _id: { $ne: currentUserId } }).select("name email");

    res.status(200).json(users);
  } catch (error) {
    console.error("Error in getUsersForSidebar:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Get messages between current user and another user
async function getMessages(req, res) {
  try {
    const currentUserId = req.user._id;
    const receiverId = req.query.receiverId;

    const messages = await Message.find({
      $or: [
        { senderId: currentUserId, receiverId },
        { senderId: receiverId, receiverId: currentUserId },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("senderId", "name email")
      .populate("receiverId", "name email");

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getMessages:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Send message from current user to receiver
async function sendMessage(req, res) {
  try {
    const { text, image } = req.body;
    const senderId = req.user._id;
    const receiverId = req.params.id;

    let imageUrl = "";

    if (image) {
      const result = await cloudinary.v2.uploader.upload(image, {
        folder: "messages",
      });
      imageUrl = result.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    // Real-time socket emission
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(200).json({ message: "Message sent successfully", newMessage });
  } catch (error) {
    console.error("Error in sendMessage:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Group into controller object
const messageController = {
  getUsersForSidebar,
  getMessages,
  sendMessage,
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('name email');
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export default messageController;