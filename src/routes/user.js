import { Router } from "express";
import { getAllSubscribersHandler, getAllsubscriptionRequestHandler, getAllUserPostsHandler, getUserFeedHandler } from "../controllers/user.js";

const router = Router();

router.get("/requests/received", getAllsubscriptionRequestHandler);

router.get("/subscribers", getAllSubscribersHandler);

router.get("/posts/all", getAllUserPostsHandler);

router.get("/feed", getUserFeedHandler);

export default router;
