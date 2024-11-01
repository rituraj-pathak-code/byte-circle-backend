import express from "express";
import dotenv from "dotenv";
import bcrypt from 'bcrypt'
import { connectDB } from "./config/database.js";
import User from "./models/user.js";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import { userAuth } from "./middlewares/auth.js";
import authRouter from "./routes/auth.js"
import profileRouter from "./routes/profile.js"
import subscriptionRequestRouter from "./routes/subscriptionRequest.js"
import userRouter from "./routes/user.js"
import postRouter from "./routes/post.js"
import cors from 'cors'

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser())

app.use('/api/auth',authRouter);
app.use('/api/profile', userAuth, profileRouter);
app.use('/api/subscribe', userAuth, subscriptionRequestRouter);
app.use('/api/user', userAuth, userRouter);
app.use('/api/post', postRouter);




connectDB()
  .then(() => {
    console.log("Database connection established");
    app.listen(3000, () => {
      console.log("Server is running at 3000");
    });
  })
  .catch((err) => {
    console.error("Database connection failed");
  });
