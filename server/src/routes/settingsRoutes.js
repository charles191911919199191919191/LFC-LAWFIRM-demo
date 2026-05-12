import { Router } from "express";
import { listSettings, updateSetting } from "../controllers/settingsController.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { settingsSchemas } from "../validations/schemas.js";

const router = Router();

router.use(authenticate, authorize("admin"));
router.get("/", listSettings);
router.put("/", validate(settingsSchemas.update), updateSetting);

export default router;
