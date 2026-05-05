import dotenv from "dotenv";
dotenv.config();
import passport from "./config/passport.js";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import authRouter from "./router/authRouter.js";
import googleAuthRouter from "./router/googleauth-Router.js";
import router from "./router/userProfile.js";
import postRoutes from "./router/postRouter.js";
import notificationRoutes from "./router/notificationRouter.js"; // ✅ fixed import

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(passport.initialize());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/auth", googleAuthRouter);
app.use("/api/user", router);
app.use("/api/post", postRoutes);
app.use("/api/notifications", notificationRoutes); // ✅ now points to correct router

export default app;