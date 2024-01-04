import express from "express";

import {
	loginUser,
	refreshUser,
	registerUser,
	getUser,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", registerUser);
router.post("/login", loginUser);
router.route("/").get(protect, refreshUser);
router.route("/:phoneNumber").get(protect, getUser);
// router.get("/:phoneNumber", getUser);

export default router;
