import SubscriptionRequest from "../models/subscriptionRequest.js";
import User from "../models/user.js";

export const sendSubscriptionHandler = async (req, res) => {
  try {
    const { toUserId } = req.params;
    const fromUserId = req.user._id;

    if (toUserId == fromUserId) {
      return res.status(400).send("Can't sent subscription request to itself");
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
      status: "idle",
    });
    const data = await subscriptionRequest.save();
    res
      .status(201)
      .json({ message: "Subscription Request sent successfully", data });
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
};

export const deleteSubscriptionHandler = async (req, res) => {
  try {
    const { toUserId } = req.params;
    const fromUserId = req.user._id;
    if (fromUserId == toUserId) {
      return res.status(400).send("Cannot cancel subscription to itself");
    }

    const isUserExist = await User.findById(toUserId);
    if (!isUserExist) {
      return res.status(400).send("User doesn't exist");
    }
    const isSubscribed = await SubscriptionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });
    if (!isSubscribed) {
      return res.status(400).send("No subscription exists between the users");
    }

    await SubscriptionRequest.findByIdAndDelete(isSubscribed._id);
    res.send("Unsubscribed successfully");
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
};

export const acceptSubscriptionHandler = async (req, res) => {
    try {
      const { fromUserId } = req.params;
      const toUserId = req.user._id;
      if (fromUserId == toUserId) {
        return res.status(400).send("Cannot accept subscription to itself");
      }
      const isUserExist = await User.findById(fromUserId);
      if (!isUserExist) {
        return res.status(400).send("User doesn't exist");
      }
      const isSubscribed = await SubscriptionRequest.findOne({fromUserId, toUserId, status: "idle" });
      if (!isSubscribed) {
        return res.status(400).send("Invalid subscription request");
      }
      isSubscribed.status = "accepted";
      await isSubscribed.save();
      res.send("Subscription accepted successfully");
    } catch (err) {
      res.status(400).send("Error : " + err.message)
    }
}