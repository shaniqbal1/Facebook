import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    image: String,
    caption: String,
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);