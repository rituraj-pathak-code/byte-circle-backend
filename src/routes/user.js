import { Router } from "express";
import { getAllFriendSuggestionHandler, getAllSubscribersHandler, getAllsubscriptionRequestHandler, getAllUserPostsHandler, getUserFeedHandler } from "../controllers/user.js";

const router = Router();

router.get("/requests/received", getAllsubscriptionRequestHandler);

router.get("/subscribers", getAllSubscribersHandler);

router.get("/posts/all", getAllUserPostsHandler);

router.get("/feed", getUserFeedHandler);

router.get("/suggestions", getAllFriendSuggestionHandler)



export default router;
