import express from "express";
import rateLimit from "express-rate-limit";
import { register, login, logout } from "../controllers/authController.js";

const router = express.Router();

// Throttle auth endpoints to blunt credential-stuffing / brute force.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many attempts, please try again later" },
});

router.post("/auth/register", authLimiter, register);
router.post("/auth/login", authLimiter, login);
router.get("/auth/logout", logout);

export default router;
