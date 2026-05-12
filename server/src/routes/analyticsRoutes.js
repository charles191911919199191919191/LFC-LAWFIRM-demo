import { Router } from "express";
import { auditLogs, summary } from "../controllers/analyticsController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = Router();

router.use(authenticate, authorize("admin", "staff", "lawyer"));
router.get("/summary", summary);
router.get("/audit-logs", authorize("admin"), auditLogs);

export default router;
