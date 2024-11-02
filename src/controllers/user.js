import Post from "../models/posts.js";
import SubscriptionRequest from "../models/subscriptionRequest.js";
import User from "../models/user.js";

export const getAllsubscriptionRequestHandler = async (req, res) => {
  try {
    const userId = req.user._id;

    const subscribersList = await SubscriptionRequest.find({
      toUserId: userId,
      status: "idle",
    }).populate("fromUserId", ["firstName", "lastName","photoURL"]);

    const sendingList = subscribersList.map(({ fromUserId }) => fromUserId);

    res.json({
      message: "Data fetched successfully",
      data: sendingList,
    });
  } catch (err) {
    res.send("Error : " + err.message);
  }
};

export const getAllSubscribersHandler = async (req, res) => {
  try {
    const userId = req.user._id;

    const subscribers = await SubscriptionRequest.find({
      $or: [
        { fromUserId: userId, status: "accepted" },
        { toUserId: userId, status: "accepted" },
      ],
    })
      .populate("fromUserId", ["firstName", "lastName","photoURL"])
      .populate("toUserId", ["firstName", "lastName","photoURL"]);

    const data = subscribers.map((row) => {
      if (userId.equals(row.fromUserId._id)) {
        return row.toUserId;
      } else {
        return row.fromUserId;
      }
    });
    res.json({
      message: "Data fetched successfully",
      data: data,
    });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
};

export const getAllUserPostsHandler = async (req, res) => {
  try {
    const userId = req.user._id;

    const posts = await Post.find({ user: userId });
    res.json({
      message: "Posts fetched successfully",
      data: posts,
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
};

export const getUserFeedHandler = async (req, res) => {
  try {
    const userId = req.user._id;

    const subscriptions = await SubscriptionRequest.find({
      $or: [
        { fromUserId: userId, status: "accepted" },
        { toUserId: userId, status: "accepted" },
      ],
    });

    const friendIds = subscriptions.map((subscription) => {
      return subscription.fromUserId.equals(userId)
        ? subscription.toUserId
        : subscription.fromUserId;
    });

    const friendsPosts = await Post.find({ user: { $in: friendIds } })
      .populate("user", ["firstName", "lastName", "photoURL"])
      .sort({ createdAt: -1 });

    res.json({ message: "Feed fetched successfully", data: friendsPosts });
  } catch (err) {
    res.status(400).send(err.message);
  }
};

export const getAllFriendSuggestionHandler = async (req, res) => {
  try {
    const userId = req.user._id;
    const friends = await SubscriptionRequest.find({
      $or: [
        { fromUserId: userId},
        { toUserId: userId }
      ]
    }).select("fromUserId toUserId");

    const friendIds = friends.map(friend => 
      friend.fromUserId.toString() === userId.toString()
        ? friend.toUserId
        : friend.fromUserId
    );

    const profiles = await User.find({
      _id: { $ne: userId, $nin: friendIds }
    });

    res.json({ message: "Success", data: profiles });
  } catch (err) {
    res.status(500).send("ERROR : " + err.message);
  }
};