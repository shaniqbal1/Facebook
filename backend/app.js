import dotenv from "dotenv";
dotenv.config();
import passport from "./config/passport.js"
import express from "express";
// import router from "./router/userprofileRoute.js";
import cors from "cors";
import authRouter from "./router/authRouter.js";
import googleAuthRouter from "./router/googleauth-Router.js";
import router from "./router/userProfile.js";
import postRoutes from "./router/postRouter.js";

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json()); // ✅ VERY IMPORTANT
app.use("/uploads", express.static("uploads"));

app.use(passport.initialize());
// routes
app.use("/api/auth", authRouter); // ✅ only use this
// GOOGLE ROUTES
app.use("/api/auth", googleAuthRouter);

app.use("/api/user", router);

app.use("/api/post", postRoutes);
//Userprofile
// app.use("/api/users", router);


export default app;