import express from "express";
const authRouter = express.Router();
import { googleAuth,logout } from "../controllers/auth.controller.js";
// import isAuth from "../middleware/isAuth.js";

authRouter.post("/google", googleAuth);
authRouter.get("/logout", logout);

export default authRouter;