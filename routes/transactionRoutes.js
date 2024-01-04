import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
	getAllTransactions,
	makeTransaction,
} from "../controllers/transactionController.js";

const router = express.Router();

router.route("/").get(protect, getAllTransactions);
router.route("/").post(protect, makeTransaction);
// router.post("/", makeTransaction);
// router.get("/", getAllTransactions);

export default router;
