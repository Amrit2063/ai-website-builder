import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/db.js";
import authRouter from "./routes/auth.routes.js"
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
dotenv.config()

const port =  process.env.PORT || 8000;

//middleware
app.use(express.json())//make sure to parse json body in request as it is sent from frontend as null by default
app.use("/api/auth",authRouter)//use in every route in authRouter, add /api/auth before it
app.use(cookieParser())//to parse cookies in request, as we are sending token in cookie from frontend, we need to parse it in backend to use it for authentication

app.use(
  cors({
    origin: process.env.CORS_ORIGIN, // your frontend port
    credentials: true,
  })
);

app.listen(port,()=>
{
    console.log(`Listening on port ${port}`);
    connectDb()
})