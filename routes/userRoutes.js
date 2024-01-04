import express from "express";

import {
	loginUser,
	refreshUser,
	registerUser,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", registerUser);
router.post("/login", loginUser);
router.route("/").get(protect, refreshUser);

export default router;
