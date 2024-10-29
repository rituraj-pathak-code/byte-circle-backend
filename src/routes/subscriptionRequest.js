import { Router } from "express";
import User from "../models/user.js";
import SubscriptionRequest from "../models/subscriptionRequest.js";

const router = Router();

router.post("/subscribe/:status/:toUserId", async (req, res) => {
  try {
    const { toUserId, status } = req.params;
    const fromUserId = req.user._id;

    if (toUserId == fromUserId) {
      return res.status(400).send("fromUserId & toUserId cannot be same");
    }
    const allowedStatus = "idle";
    if (status.toLowerCase() !== allowedStatus) {
      return res.status(400).send("Invalid status type: " + status);
    }

    const isSubscribed = await SubscriptionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });
    if (isSubscribed) {
      return res
        .status(400)
        .send("Subscription already exists : status - " + isSubscribed.status);
    }

    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(404).send("User not found");
    }
    const subscriptionRequest = new SubscriptionRequest({
      fromUserId: fromUserId,
      toUserId: toUserId,
      status: status.toLowerCase(),
    });
    const data = await subscriptionRequest.save();
    res
      .status(201)
      .json({ message: "Subscription Request sent successfully", data });
  } catch (err) {
    res.status(500).send("Error : " + err.message);
  }
});

export default router;
