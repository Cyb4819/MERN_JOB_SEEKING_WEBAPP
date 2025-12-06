import { User } from "../models/userSchema.js";
import UserModel from "../models/user.model.js";
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

    // Try to get users from the main User model (userSchema.js)
    let users = await User.find({ _id: { $ne: currentUserId } }).select("name email profilePic");

    // If no users found, try the chat-specific User model (user.model.js)
    if (users.length === 0) {
      users = await UserModel.find({ _id: { $ne: currentUserId } }).select("fullName email profilePic");
      // Map fullName to name for consistency
      users = users.map(user => ({
        _id: user._id,
        name: user.fullName,
        email: user.email,
        profilePic: user.profilePic
      }));
    }

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
  editMessage,
  deleteMessage,
};

// Edit message
async function editMessage(req, res) {
  try {
    const { messageId } = req.params;
    const { text } = req.body;
    const userId = req.user._id;

    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ error: "Message not found" });

    // Only allow the sender to edit
    if (message.senderId.toString() !== userId.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    message.text = text;
    await message.save();

    // Emit socket event for real-time update
    const receiverSocketId = getReceiverSocketId(message.receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("messageEdited", message);
    }

    res.status(200).json(message);
  } catch (error) {
    console.error("Error in editMessage:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Delete message
async function deleteMessage(req, res) {
  try {
    const { messageId } = req.params;
    const userId = req.user._id;

    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ error: "Message not found" });

    // Only allow the sender to delete
    if (message.senderId.toString() !== userId.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await Message.findByIdAndDelete(messageId);

    // Emit socket event for real-time deletion
    const receiverSocketId = getReceiverSocketId(message.receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("messageDeleted", { messageId });
    }

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error in deleteMessage:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
}

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('name email profilePic');
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export default messageController;