import dotenv from "dotenv";
dotenv.config();
import express from "express";

import cors from "cors";
import authRouter from "./router/authRouter.js";

const app = express();


app.use(cors());
app.use(express.json()); // ✅ VERY IMPORTANT

// routes
app.use("/api/auth", authRouter); // ✅ only use this

export default app;