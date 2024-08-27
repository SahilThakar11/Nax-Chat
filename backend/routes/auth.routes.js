import express from "express";
import {
  getMe,
  login,
  logout,
  register,
  // deleteAccount,
  // requestPasswordReset,
  // resetPassword,
} from "../controllers/auth.controller.js";

import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/getMe", protectRoute, getMe);

router.post("/login", login);
router.post("/logout", logout);
router.post("/register", register);

// router.post("/request-password-reset", requestPasswordReset);
// router.post("/reset-password/:token", resetPassword);

// router.delete("/delete-account/:id", protectRoute, deleteAccount);

export default router;
