import express from "express";
import Notification from "../modle/notificationModle.js";
import authMiddleware from "../middlewear/authMiddlewear.js";

const router = express.Router();

// ─── GET ALL NOTIFICATIONS ────────────────────────────────────────────────────
router.get("/", authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user.id })
      .populate("sender", "name username profileImage")
      .populate("post", "image caption")
      .sort({ createdAt: -1 })
      .limit(30);

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── GET UNREAD COUNT ─────────────────────────────────────────────────────────
router.get("/unread-count", authMiddleware, async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      recipient: req.user.id,
      isRead: false,
    });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── MARK ALL AS READ ─────────────────────────────────────────────────────────
router.put("/mark-read", authMiddleware, async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user.id, isRead: false },
      { isRead: true }
    );
    res.json({ message: "Marked as read" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;