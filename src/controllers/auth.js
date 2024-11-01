import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validateSignupData } from "../utils/validate.js";

export const signupHandler = async (req, res) => {
  try {
    const isAllowed = validateSignupData(req)
    if (!isAllowed) {
      return res.status(400).send("Invalid Sign up Request");
    }
    const { firstName, lastName, email, password } = req.body;
    if(!firstName || !lastName || !email || !password){
      return res.status(400).json({message: "Please fill all the details"});
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    await user.save();
    res.status(201).json({message: "Account Created Successfully!"});
  } catch (err) {
    console.log(err)
    if (err.code === 11000) {
      return res.status(200).json({message: "Email is already registered."});
    }
    res.status(500).json({message: err.message});
  }
};

export const loginHandler = async (req, res) => {
  try {
    // Do validation if anything comes empty
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).send("Invalid Credentials");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send("Invalid Credentials");
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });
    res.status(200).send("Login successfull");
  } catch (err) {
    res.status(500).send("An Error occured. Please try again later.");
  }
};


export const logoutHandler = (req, res) => {
    try {
      res.cookie("token", null, {
        expires: new Date(Date.now() + 8 * 3600000), //look into expiry
      });
      res.send("Logout successfull")
    } catch (err) {
      res.status(500).send("An Error occured. Please try again later.");
    }
  }