import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
	getAllTransactions,
	makeTransaction,
	getRecentTransactions,
} from "../controllers/transactionController.js";

const router = express.Router();

// Transactions controller routes
router.route("/").get(protect, getAllTransactions);
router.route("/recentTransactions").get(protect, getRecentTransactions);
router.route("/").post(protect, makeTransaction);

export default router;
