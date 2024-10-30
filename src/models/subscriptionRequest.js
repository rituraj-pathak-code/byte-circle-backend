import mongoose from "mongoose";

const subscriptionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: { values: ["accepted", "idle"] },
      message: `{VALUE} is unsupported status type`,
    },
  },
  { timestamps: true }
);
 
subscriptionRequestSchema.index({fromUserId:1, toUserId: 1});
subscriptionRequestSchema.index({fromUserId:1, toUserId: 1, status:1});

const SubscriptionRequest = mongoose.model('SubscriptionRequest', subscriptionRequestSchema);

export default SubscriptionRequest;