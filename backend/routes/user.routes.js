import express from "express";

import {
  updateProfile,
  updatePassword,
  getUserById,
} from "../controllers/user.controller.js";

import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/update-profile", protectRoute, updateProfile);
router.post("/update-password", protectRoute, updatePassword);

router.get("/:id", protectRoute, getUserById);

export default router;
