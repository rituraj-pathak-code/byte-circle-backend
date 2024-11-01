import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    images: [
      {
        url: {
          type: String,
        },
      },
    ],
    likes: {
      type: Number,
      required: true,
      default: 0
    },
    comments: {
      type: [String]
    }
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
