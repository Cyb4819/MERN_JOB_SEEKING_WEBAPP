import express from "express";
import messageController from "../controllers/messageController.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { getUsers } from "../controllers/messageController.js";

import { getRecentChats, searchUsers } from "../controllers/messageController.js";
const router = express.Router();

router.get("/all-users", getUsers);

// Get messages between users
router.get("/messages", isAuthenticated, messageController.getMessages);

//Get all chats of user
router.get("/all-chats", isAuthenticated, messageController.getRecentChats);

// Send a message
router.post("/send/:id", messageController.sendMessage);

export default router;