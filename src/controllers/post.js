import Post from "../models/posts.js";

export const createPostHandler = async (req, res) => {
  try {
    const user = req.user;
    const { text, images } = req.body;
    console.log(req.body)

    if (!text) {
      return res.status(400).json({ error: "Post body is required." });
    }

    const newPost = new Post({
      user: user._id,
      text: text,
      images: images ?? [],
    });

    await newPost.save();

    res.status(201).json({
      message: "Post created successfully",
      data: newPost,
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
};

export const getPostByIdHandler = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).send("Post not found!");
    }

    res.json({
      message: "Post fetched succcessfully",
      data: post,
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
};

export const updatePostHandler = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;
    const { text, images } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }
    if (post.user.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ error: "You are not authorized to update this post." });
    }

    post.text = text;
    post.images = images || post.images;

    const updatedPost = await post.save();

    res.json({
      message: "Post updated successfully",
      data: updatedPost,
    });
  } catch (err) {
    res.status(400).send(err);
  }
};


export const deletePostHandler = async (req, res) => {
    try {
      const { postId } = req.params;
      const userId = req.user._id;
  
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ error: "Post not found." });
      }
      if (post.user.toString() !== userId.toString()) {
        return res
          .status(403)
          .json({ error: "You are not authorized to delete this post." });
      }
  
      await Post.findByIdAndDelete(postId);
  
      res.json({
        message: "Post deleted successfully",
      });
    } catch (err) {
      res.status(400).send(err);
    }
  }

  export const fetchLikesHandler = async (req,res) => {
    try{
      const {postId} = req.params;
      const userId = req.user._id
      const post = await Post.findById({_id:postId});
      if (!post) return res.status(404).json({ message: "Post not found" });
      const alreadyLiked = post.likes.includes(userId);

      res.status(200).json({ message: "Fetched Likes", count: post.likes.length, liked:alreadyLiked });

    }catch(err){
      res.status(500).send(err.message);
    }
  }

  export const likePostHandler = async (req,res) => {
    try{
      const userId = req.user._id;
      const {postId} = req.body;

      const post = await Post.findById({_id:postId});
      if (!post) return res.status(404).json({ message: "Post not found" });
      const alreadyLiked = post.likes.includes(userId);
      if (alreadyLiked) {
        post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
      }else {
        post.likes.push(userId);
      }
      await post.save();
      res.status(201).json({ message: alreadyLiked ? "Like removed" : "Post liked", post });
    }catch(err){
      console.error(err.message)
      res.status(500).send(err.message);
    }
  }