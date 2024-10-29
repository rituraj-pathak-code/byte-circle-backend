import { Router } from "express";
import {
  loginHandler,
  logoutHandler,
  signupHandler,
} from "../controllers/auth.js";

const router = Router();

router.post("/signup", signupHandler);
router.post("/login", loginHandler);
router.post("/logout", logoutHandler);

export default router;
