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
    res.status(400).json({ message: err.message });
  }
});

app.get("/user", async (req, res) => {
  const userEmail = req.body.email;

  try {
    const users = await User.find({ email: userEmail });

    if (users.length == 0) {
      res.status(404).json({ message: "User not found" });
    } else {
      res.send(users);
    }
  } catch (err) {
    console.log("Something went wrong");
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    console.log("Something went wrong");
  }
});
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params.userId;
  const data = req.body;

  if (userId) {
    try {
      const ALLOWED_UPDATES = [
        "firstName",
        "lastName",
        "age",
        "photoURL",
        "password",
        "gender",
        "skills",
      ];
      const isUpdateAllowed = Object.keys(data).every((k) =>
        ALLOWED_UPDATES.includes(k)
      );
      if (!isUpdateAllowed) {
        throw new Error("Update not allowed.");
      }
      await User.findByIdAndUpdate({ _id: userId }, data);
      res.send("User updated successfully");
    } catch (err) {
      res.status(400).send(err.message);
    }
  } else {
    res.status(404).send("User not found");
  }
});
app.delete("/user/:userId", async (req, res) => {
  const userId = req.params.userId;
  if (userId) {
    try {
      const user = await User.findByIdAndDelete(userId);
      res.send("User deleted successfully");
    } catch (err) {
      res.status(400).send("Something went wrong");
    }
  } else {
    res.status(404).send("User not found");
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
