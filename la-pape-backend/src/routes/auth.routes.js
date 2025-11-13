import { Router } from "express";
import {
  register,
  verifyEmail,
  loginStep1,
  loginStep2,
  forgotPassword,
  resetPassword,
  toggleTwoFA,
} from "../controllers/auth.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/verify-email", verifyEmail);

router.post("/login", loginStep1);
router.post("/verify-2fa", loginStep2);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.patch("/2fa", requireAuth, toggleTwoFA);

export default router;
