import { Router } from "express";
import { getLawyerAvailability, listLawyers } from "../controllers/lawyerController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = Router();

router.get("/", listLawyers);
router.get("/:id/availability", authenticate, authorize("client", "lawyer", "staff", "admin"), getLawyerAvailability);

export default router;
