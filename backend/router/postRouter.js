import express from "express";
import Post from "../modle/postModel.js";
import  upload  from "../middlewear/uploadmMiddlewwear.js";
import  authMiddleware  from "../middlewear/authMiddlewear.js";

const router = express.Router();

// CREATE POST
router.post(
  "/create",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      const post = await Post.create({
        user: req.user.id,
        image: req.file.path,
        caption: req.body.caption,
      });

      res.json(post);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// GET ALL POSTS
router.get("/all", async (req, res) => {
  const posts = await Post.find()
    .populate("user", "username profileImage")
    .sort({ createdAt: -1 });

  res.json(posts);
});

export default router;