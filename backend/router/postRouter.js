import express from "express";
import Post from "../modle/postModel.js";
import Notification from "../modle/notificationModle.js";
import upload from "../middlewear/uploadmMiddlewwear.js";
import authMiddleware from "../middlewear/authMiddlewear.js";

const router = express.Router();

// ─── CREATE POST ──────────────────────────────────────────────────────────────
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

// ─── GET ALL POSTS ────────────────────────────────────────────────────────────
router.get("/all", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "name username profileImage _id")
      .populate("comments.user", "name username profileImage _id")
      .populate("comments.replies.user", "name username profileImage _id")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── TOGGLE LIKE ──────────────────────────────────────────────────────────────
router.post("/:id/like", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const userId = req.user.id.toString();
    const alreadyLiked = post.likes.some((id) => id.toString() === userId);

    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      post.likes.push(req.user.id);

      // Send notification only if liker is not the post owner
      if (post.user.toString() !== userId) {
        await Notification.create({
          recipient: post.user,
          sender: req.user.id,
          type: "like",
          post: post._id,
        });
      }
    }

    await post.save();
    res.json({ likes: post.likes, likeCount: post.likes.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── ADD COMMENT ─────────────────────────────────────────────────────────────
router.post("/:id/comment", authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.push({ user: req.user.id, text: text.trim() });
    await post.save();

    await post.populate("comments.user", "name username profileImage _id");
    await post.populate("comments.replies.user", "name username profileImage _id");

    const newComment = post.comments[post.comments.length - 1];

    // Send notification only if commenter is not the post owner
    if (post.user.toString() !== req.user.id.toString()) {
      await Notification.create({
        recipient: post.user,
        sender: req.user.id,
        type: "comment",
        post: post._id,
        commentText: text.trim(),
      });
    }

    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── DELETE COMMENT ───────────────────────────────────────────────────────────
router.delete("/:id/comment/:commentId", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.user.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    comment.deleteOne();
    await post.save();
    res.json({ message: "Comment deleted", commentId: req.params.commentId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── ADD REPLY TO COMMENT ─────────────────────────────────────────────────────
router.post("/:id/comment/:commentId/reply", authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Reply text is required" });
    }

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    comment.replies.push({ user: req.user.id, text: text.trim() });
    await post.save();

    await post.populate("comments.user", "name username profileImage _id");
    await post.populate("comments.replies.user", "name username profileImage _id");

    const updatedComment = post.comments.id(req.params.commentId);

    // Notify the comment owner (if replier is not the comment owner)
    if (comment.user.toString() !== req.user.id.toString()) {
      await Notification.create({
        recipient: comment.user,
        sender: req.user.id,
        type: "reply",
        post: post._id,
        commentText: text.trim(),
      });
    }

    res.status(201).json(updatedComment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── DELETE REPLY ─────────────────────────────────────────────────────────────
router.delete("/:id/comment/:commentId/reply/:replyId", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const reply = comment.replies.id(req.params.replyId);
    if (!reply) return res.status(404).json({ message: "Reply not found" });

    if (reply.user.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    reply.deleteOne();
    await post.save();
    res.json({ message: "Reply deleted", replyId: req.params.replyId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── DELETE POST ──────────────────────────────────────────────────────────────
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

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