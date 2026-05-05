import cloudinary from "../config/cloudinary.js";
import User from "../modle/userModle.js";


export const updateProfile = async (req, res) => {
  try {
    const { name, bio, dateOfBirth } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ✅ Update text fields
    if (name !== undefined) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (dateOfBirth !== undefined) user.dateOfBirth = dateOfBirth;

    // ✅ Image already uploaded by CloudinaryStorage
    if (req.file) {
      user.profileImage = req.file.path; // 🔥 THIS IS THE FIX
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated",
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        bio: user.bio,
        dateOfBirth: user.dateOfBirth,
        profileImage: user.profileImage,
      },
    });

  } catch (err) {
    console.error("PROFILE UPDATE ERROR:", err); // 👈 helps debugging
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};