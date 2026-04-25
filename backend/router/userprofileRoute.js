import express from "express";
import User from "../modle/userModle.js";
import authMiddleware from "../middlewear/authMiddlewear.js";
import upload from "../middlewear/uploadmMiddlewwear.js";

const router = express.Router();


// ======================
// 🔹 GET PROFILE
// ======================
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to get profile" });
  }
});


// ======================
// 🔹 UPDATE PROFILE (name, bio, etc.)
// ======================
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const { name, bio, dateOfBirth } = req.body;

    const updateData = {};

    if (name) updateData.name = name;
    if (bio) updateData.bio = bio;
    if (dateOfBirth) updateData.dateOfBirth = dateOfBirth;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: "Failed to update profile" });
  }
});


// ======================
// 🔹 UPLOAD PROFILE IMAGE
// ======================
router.put(
  "/profile/image",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      const userId = req.user.id;

      if (!req.file) {
        return res.status(400).json({ message: "No image uploaded" });
      }

      const imagePath = req.file.path;

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { profileImage: imagePath },
        { new: true }
      ).select("-password");

      res.json(updatedUser);
    } catch (err) {
      res.status(500).json({ error: "Image upload failed" });
    }
  }
);

export default router;