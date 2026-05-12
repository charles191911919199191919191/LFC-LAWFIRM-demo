import { Router } from "express";
import { csrf, login, logout, me, refresh, register } from "../controllers/authController.js";
import { authenticate } from "../middleware/auth.js";
import { authRateLimiter } from "../middleware/rateLimiter.js";
import { validate } from "../middleware/validate.js";
import { authSchemas } from "../validations/schemas.js";

const router = Router();

router.post("/register", authRateLimiter, validate(authSchemas.register), register);
router.post("/login", authRateLimiter, validate(authSchemas.login), login);
router.post("/refresh", authRateLimiter, refresh);
router.post("/logout", logout);
router.get("/csrf", csrf);
router.get("/me", authenticate, me);

export default router;
