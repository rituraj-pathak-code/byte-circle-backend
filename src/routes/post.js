import { Router } from "express";
import { userAuth } from "../middlewares/auth.js";
import { createPostHandler, deletePostHandler, getPostByIdHandler, updatePostHandler } from "../controllers/post.js";

const router = Router();

router.post("/create", userAuth, createPostHandler);

router.get("/:postId", getPostByIdHandler);

router.put("/:postId", userAuth, updatePostHandler);

router.delete("/:postId", userAuth, deletePostHandler);


export default router;
