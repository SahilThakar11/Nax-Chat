import express from "express";

import {
  createConversation,
  fetchConversationByUserName,
  fetchConversations,
} from "../controllers/conversation.controller.js";

import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/all", protectRoute, fetchConversations);
router.get("/conversation/query", protectRoute, fetchConversationByUserName);
router.post("/create-conversation/:rId", protectRoute, createConversation);

export default router;
