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

      const post = await Post.create({
        user: req.user.id,
        image: req.file.path,
        imageId: req.file.filename,
        caption: req.body.caption,
      });

      const populated = await post.populate("user", "name username profileImage _id");

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
      .populate("user", "name username profileImage _id") // ✅ _id added
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE POST
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Only the owner can delete
    if (post.user.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await post.deleteOne();
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;