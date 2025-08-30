import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user_model.js";

export const loginUser = async (req, res) => {
  try {
    const { number, password } = req.body;

    // Validate input
    if (!number || !password) {
      return res.status(400).json({ message: "Number and password are required" });
    }

    // Find user
    const user = await User.findOne({ number });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // Update lastLogin
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = jwt.sign(
      { id: user._id, number: user.number },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      token,
      message: "Login successful",
      user: { id: user._id, number: user.number }
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
