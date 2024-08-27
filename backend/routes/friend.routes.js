import express from "express";
import {
  sendRequest,
  cancelRequest,
  acceptRequest,
  rejectRequest,
  unfriend,
  searchUser,
} from "../controllers/friend.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/send-request/:id", protectRoute, sendRequest);
router.post("/cancel-request/:id", protectRoute, cancelRequest);
router.post("/accept-request/:id", protectRoute, acceptRequest);
router.post("/reject-request/:id", protectRoute, rejectRequest);
router.post("/unfriend/:id", protectRoute, unfriend);

router.get("/search", protectRoute, searchUser);

export default router;
