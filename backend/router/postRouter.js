import express from "express";
import Post from "../modle/postModel.js";
import upload from "../middlewear/uploadmMiddlewwear.js";
import authMiddleware from "../middlewear/authMiddlewear.js";

const router = express.Router();

// CREATE POST
router.post(
  "/create",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Image is required" });
      }

      // Normalize Windows backslashes → forward slashes
      const imagePath = req.file.path.replace(/\\/g, "/");

      const post = await Post.create({
        user: req.user.id,
        image: imagePath,
        caption: req.body.caption,
      });

      // ✅ FIX: populate name too (not just username)
      const populated = await post.populate("user", "name username profileImage");

      res.status(201).json(populated);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// GET ALL POSTS
router.get("/all", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "name username profileImage") // ✅ FIX: added name
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;