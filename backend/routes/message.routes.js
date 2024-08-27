import express from "express";

import {
  sendMessage,
  fetchMessages,
  deleteMessage,
  lastMessage,
  unreadMessageById,
} from "../controllers/message.controller.js";

import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/send/:id", protectRoute, sendMessage);
router.get("/fetch/:id", protectRoute, fetchMessages);
router.get("/unread/:id", protectRoute, unreadMessageById);
router.get("/last-message/:id", protectRoute, lastMessage);
router.delete("/delete/:id", protectRoute, deleteMessage);

export default router;
