import { Router } from "express";
import {
  acceptSubscriptionHandler,
  deleteSubscriptionHandler,
  sendSubscriptionHandler,
} from "../controllers/subscription.js";

const router = Router();

router.post("/send/:toUserId", sendSubscriptionHandler);

router.delete("/cancel/:toUserId", deleteSubscriptionHandler);

router.post("/accept/:fromUserId", acceptSubscriptionHandler);


export default router;
