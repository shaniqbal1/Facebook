import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      minlength: 3,
      maxlength: 20
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    bio: {
      type: String,
      default: "",
      maxlength: 150,
    },

    profileImage: {
      type: String,
      default: "",
    },

    dateOfBirth: {
      type: Date,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    verificationToken: String,
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;