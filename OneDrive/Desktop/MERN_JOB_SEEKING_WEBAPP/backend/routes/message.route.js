import express from "express";
import messageController from "../controllers/message.controller.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { getUsers } from "../controllers/message.controller.js";

import { getRecentChats, searchUsers } from "../controllers/message.controller.js";
const router = express.Router();

// Main chat sidebar users route
router.get("/sidebar/users", isAuthenticated, getRecentChats, messageController.getUsersForSidebar);
router.get("/search", isAuthenticated, searchUsers);
// All users (admin/test route)
router.get("/all-users", isAuthenticated, getUsers);
// Get messages between users
router.get("/messages", isAuthenticated, messageController.getMessages);
// Send a message
router.post("/send/:id", isAuthenticated, messageController.sendMessage);

export default router;