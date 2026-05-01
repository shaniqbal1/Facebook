import User from "../modle/userModle.js";

// ========================
// GET PROFILE
// ========================
export const getProfile = async (req, res) => {
  try {
    // ✅ FIX: support both id and _id (very important)
    const userId = req.user.id || req.user._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No user id found in token",
      });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: user, // frontend expects this
    });

  } catch (err) {
    console.log("GET PROFILE ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};