import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    image: String,    // ✅ Cloudinary URL
    imageId: String,  // ✅ Cloudinary public_id (needed to delete image later)
    caption: String,
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);