import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected example route
router.get("/profile", protect, (req, res) => {
  res.json({ message: "Welcome to your profile", user: req.user });
});

export default router;
