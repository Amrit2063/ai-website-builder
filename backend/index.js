import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import connectDb from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import websiteRouter from "./routes/website.routes.js";
import billingRouter from "./routes/billing.routes.js";
import stripe from "./config/stripe.js";
import { stripeWebhook } from "./controllers/stripeWebhook.controller.js";

dotenv.config();
const app = express();
app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);
const port = process.env.PORT || 5000;

// 🔥 MIDDLEWARE FIRST
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.status(200).json({ message: "This is WebNest.ai API" });
});

// 🔥 ROUTES AFTER
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/website", websiteRouter);
app.use("/api/billing", billingRouter);


app.listen(port, () => {
  console.log(`Listening on port ${port}`);
  connectDb();
});
