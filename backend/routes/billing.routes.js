import express from "express";
import isAuth from "../middleware/isAuth.js";
import { billing, verifyPayment } from "../controllers/billing.controller.js";

const billingRouter = express.Router();
billingRouter.post("/",isAuth, billing);
billingRouter.post("/verify-payment", isAuth, verifyPayment);

export default billingRouter;