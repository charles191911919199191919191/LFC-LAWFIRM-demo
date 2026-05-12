import { Router } from "express";
import { listUsers, updateUserRole } from "../controllers/userController.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { userSchemas } from "../validations/schemas.js";

const router = Router();

router.use(authenticate, authorize("admin", "staff"));
router.get("/", validate(userSchemas.list), listUsers);
router.patch("/:id/role", authorize("admin"), validate(userSchemas.updateRole), updateUserRole);

export default router;
