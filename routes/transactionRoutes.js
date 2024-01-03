import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import { getAllTransactions } from "../controllers/transactionController.js";

const router = express.Router();

// router.route("/").get(protect, getAllTransactions);
router.get("/", getAllTransactions);

export default router;
