import { Router } from "express";
import { editPasswordHandler, editProfileHandler, viewProfileHandler } from "../controllers/profile.js";

const router = Router();

router.get("/view", viewProfileHandler);
router.patch("/edit", editProfileHandler);
router.patch("/edit/password", editPasswordHandler)

export default router;
