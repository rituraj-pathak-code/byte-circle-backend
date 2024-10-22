import express from "express";
import dotenv from "dotenv";

import { connectDB } from "./config/database.js";
import User from "./models/user.js";
dotenv.config();

const app = express();


app.use(express.json());

app.post("/signup", async (req, res) => {
  const userData = req.body;
  const user = new User(userData);

  try {
    await user.save();
    res.json({ message: "User saved successfully" });
  } catch (err) {
    console.log("Error saving user : " + err.message);
    res.status(400).json({ message: "Something went wrong" + err.message });
  }
});

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
