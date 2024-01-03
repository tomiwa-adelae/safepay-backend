import asyncHandler from "express-async-handler";
import Transaction from "../models/transactionModel.js";

// @desc    Get all user's transactions
// @route   GET /api/transactions
// @access  Private
const getAllTransactions = asyncHandler(async (req, res) => {
	res.send("All Transactions");
});

export { getAllTransactions };
