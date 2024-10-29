import { validateEditProfile } from "../utils/validate.js";
import bcrypt from "bcrypt";

export const viewProfileHandler = async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(500).send("ERROR : " + err.message);
  }
};

export const editProfileHandler = async (req, res) => {
  try {
    const isAllowed = validateEditProfile(req);
    if (!isAllowed) {
      return res.status(400).send("Invalid Edit Request");
    }
    const loggedInUserData = req.user;
    Object.keys(req.body).forEach(
      (key) => (loggedInUserData[key] = req.body[key])
    );
    await loggedInUserData.save();
    res.status(200).json({
      message: `${loggedInUserData.firstName}, your profile was updated successfully`,
      data: loggedInUserData,
    });
  } catch (err) {
    res.status(500).send("ERROR : " + err.message);
  }
};

export const editPasswordHandler = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (oldPassword == newPassword) {
      return res.status(400).send("Old & New Password cannot be same");
    }
    const user = req.user;
    const isOldPassCorrect = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPassCorrect) {
      return res.status(400).send("Old password is incorrect");
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    res.send("Password updated succesfully")
  } catch (err) {
    res.status(500).send("ERROR : " + err.message);
  }
};
