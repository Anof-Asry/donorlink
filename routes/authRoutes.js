import express from "express";
import { signup, login, logout, getMe } from "../controllers/authController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// Protected route — requires valid JWT
router.get("/me", authenticate, getMe);

export default router;
