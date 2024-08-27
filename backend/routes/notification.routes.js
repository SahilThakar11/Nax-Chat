import express from "express";

import {
  getNotifications,
  deleteNotification,
} from "../controllers/notification.controller.js";

import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, getNotifications);
router.delete("/:id", protectRoute, deleteNotification);

export default router;
