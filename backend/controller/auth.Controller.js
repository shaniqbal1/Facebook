import User from "../modle/userModle.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import {sendEmail} from "../utils/send-email.js";

// ========================
// REGISTER
// ========================
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create verification token
    const token = crypto.randomBytes(32).toString("hex");

    // create user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      verificationToken: token,
      isVerified: false,
    });

    await newUser.save();

    // verification link
    const verifyLink = `http://localhost:8000/api/auth/verify/${token}`;

    // send email
    await sendEmail(
      email,
      "Verify your account",
      `
      <h2>Welcome ${username}</h2>
      <p>Click below to verify your account</p>
      <a href="${verifyLink}">Verify Account</a>
      `
    );

    return res.status(201).json({
      success: true,
      message: "User registered successfully. Please verify your email.",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ========================
// VERIFY EMAIL
// ========================
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (err) {
  console.log("REGISTER ERROR:", err);

  return res.status(500).json({
    success: false,
    message: "Server error",
    error: err.message,
  });
}
};


// ========================
// LOGIN
// ========================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // check email verification
    if (!user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Please verify your email first",
      });
    }

    // check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // create JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};