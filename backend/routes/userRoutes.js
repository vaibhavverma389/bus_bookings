import express from "express";
import User from "../Models/User.js";
import { protect, adminOnly } from "../Middleware/authMiddleware.js";

const router = express.Router();

// Get all users (Admin only)
router.get("/", protect, adminOnly, async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

// Update user role (Admin only)
router.put("/:id/role", protect, adminOnly, async (req, res) => {
  const { role } = req.body;

  const targetUser = await User.findById(req.params.id);
  if (!targetUser) return res.status(404).json({ message: "User not found" });

  // Prevent modifying another admin
  if (targetUser.role === "admin") {
    return res.status(403).json({ message: "Admins cannot modify other admins" });
  }

  // Prevent modifying your own account
  if (String(targetUser._id) === String(req.user._id)) {
    return res.status(403).json({ message: "You cannot modify yourself" });
  }

  targetUser.role = role;
  await targetUser.save();

  res.json(targetUser);
});

// Delete user (Admin only)
router.delete("/:id", protect, adminOnly, async (req, res) => {
  const targetUser = await User.findById(req.params.id);
  if (!targetUser) return res.status(404).json({ message: "User not found" });

  // Prevent deleting another admin
  if (targetUser.role === "admin") {
    return res.status(403).json({ message: "Admins cannot delete other admins" });
  }

  // Prevent deleting your own account
  if (String(targetUser._id) === String(req.user._id)) {
    return res.status(403).json({ message: "You cannot delete yourself" });
  }

  await User.findByIdAndDelete(req.params.id);

  res.json({ message: "User deleted successfully" });
});

export default router;
