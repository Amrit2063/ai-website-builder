import express from "express";
const userRouter = express.Router();
import { getCurrentUser } from "../controllers/user.controllers.js";
import isAuth from "../middleware/isAuth.js";

userRouter.get("/me",isAuth, getCurrentUser);

export default userRouter;