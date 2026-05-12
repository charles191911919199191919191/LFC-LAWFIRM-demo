import { Router } from "express";
import { listNotifications, markAllRead, markAsRead } from "../controllers/notificationController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.use(authenticate);
router.get("/", listNotifications);
router.patch("/read-all", markAllRead);
router.patch("/:id/read", markAsRead);

export default router;
