import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Transaction from "../models/transactionModel.js";

// @desc    Get all user's transactions
// @route   GET /api/transactions
// @access  Private
const getAllTransactions = asyncHandler(async (req, res) => {
	const transactions = await Transaction.find({ user: req.user._id });
	res.json(transactions);
});

// @desc    Make transaction
// @route   POST /api/transactions
// @access  Private
const makeTransaction = asyncHandler(async (req, res) => {
	const { recipientAccountNumber, amount, narration, transactionPin } =
		req.body;

	if (recipientAccountNumber === req.user.phoneNumber) {
		res.status(400);
		throw new Error("You cannot transfer to yourself!");
	} else {
		// get recipient user
		const recipientUser = await User.findOne({
			phoneNumber: recipientAccountNumber,
		});

		if (!recipientUser) {
			res.status(400);
			throw new Error("Enter valid account number. User not found!");
		} else {
			// Debit transaction for the sender
			const debitTransaction = new Transaction({
				senderAccountNumber: req.user.phoneNumber,
				recipientAccountNumber,
				amount,
				narration,
				transactionPin,
				user: req.user._id,
				transactionType: "debit",
			});
			// res.send(recipientUser);
			// Credit transaction for the recipient
			const creditTransaction = new Transaction({
				senderAccountNumber: req.user.phoneNumber,
				recipientAccountNumber: recipientUser.phoneNumber,
				amount,
				narration,
				user: recipientUser._id,
				transactionType: "credit",
			});

			res.send({ debitTransaction, creditTransaction });
		}

		// res.send(req.user);

		// res.send(transaction);
	}
});

export { getAllTransactions, makeTransaction };
