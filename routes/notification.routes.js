import { Router } from "express";
import {
  getNotifications,
  markAsRead
} from "../controllers/notification.controller.js";

const router = Router();

router.get("/:userId", getNotifications);
router.put("/:userId/read", markAsRead);

export default router;
