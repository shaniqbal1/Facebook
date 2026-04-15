import express  from "express";
const router = express.Router();
import {register, login, verifyEmail } from "../controller/auth.Controller.js";

router.post("/register", register);
router.get("/verify/:token", verifyEmail);
router.post("/login", login);

export default router;