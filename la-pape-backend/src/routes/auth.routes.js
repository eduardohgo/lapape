import { Router } from "express";
import {
  register,
  verifyEmail,
  loginStep1,
  loginStep2,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", register);
router.post("/verify-email", verifyEmail);

router.post("/login", loginStep1);
router.post("/verify-2fa", loginStep2);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
