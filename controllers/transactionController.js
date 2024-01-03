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
	// Debit the sender and credit the recipient
	const sender = await User.findOne({
		phoneNumber: req.user.phoneNumber,
	});
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
			// Check for transaction pin
			if (await sender.matchTransactionPin(transactionPin)) {
				// Check for balance to proceed the transaction
				if (sender.accountBalance < amount) {
					res.status(400);
					throw new Error("Insufficient balance. Top up");
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

					// Credit transaction for the recipient
					const creditTransaction = new Transaction({
						senderAccountNumber: req.user.phoneNumber,
						recipientAccountNumber: recipientUser.phoneNumber,
						amount,
						narration,
						user: recipientUser._id,
						transactionType: "credit",
					});

					sender.accountBalance = sender.accountBalance - amount;

					recipientUser.accountBalance =
						recipientUser.accountBalance + amount;

					// Save the account balaance
					const updatedUser = await sender.save();
					await recipientUser.save();
					res.json(updatedUser);

					// Save Transactions
					const savedDebit = await debitTransaction.save();
					await creditTransaction.save();
					res.json({ updatedUser, savedDebit });
				}
			} else {
				res.status(400);
				throw new Error("Invalid pin!");
			}
		}
	}
});

export { getAllTransactions, makeTransaction };
