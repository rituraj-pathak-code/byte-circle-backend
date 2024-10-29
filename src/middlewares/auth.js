import User from "../models/user.js";
import jwt from "jsonwebtoken"

export const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.send(401).send("Unauthorised")
    }

    const decodedMessage = await jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = decodedMessage;

    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user
    next()
  } catch (err) {
    res.status(500).send("ERROR : " + err.message);
  }
};
