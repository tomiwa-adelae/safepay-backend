import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Transaction from "../models/transactionModel.js";

// @desc    Get all user's transactions
// @route   GET /api/transactions
// @access  Private
const getAllTransactions = asyncHandler(async (req, res) => {
	try {
		// Get all transactions and send them to the user
		const transactions = await Transaction.find({
			user: req.user._id,
		}).sort({
			createdAt: -1,
		});

		res.json(transactions);
	} catch (err) {
		res.status(400);
		throw new Error("An error occured!");
	}
});

// @desc    Get Recent user's transactions - First 3
// @route   GET /api/transactions/recentTransactions
// @access  Private
const getRecentTransactions = asyncHandler(async (req, res) => {
	try {
		// Get recent transactions and send them to the user
		const transactions = await Transaction.find({
			user: req.user._id,
		})
			.sort({
				createdAt: -1,
			})
			.limit(3);

		res.json(transactions);
	} catch (err) {
		res.status(400);
		throw new Error("An error occured!");
	}
});

// @desc    Make transaction
// @route   POST /api/transactions
// @access  Private
const makeTransaction = asyncHandler(async (req, res) => {
	// Get details from the request body
	const { recipientAccountNumber, amount, narration, transactionPin } =
		req.body;

	// Find the sender
	const sender = await User.findOne({
		phoneNumber: req.user.phoneNumber,
	});

	// Check if sender is equal to Recipient
	if (recipientAccountNumber === req.user.phoneNumber) {
		res.status(400);
		throw new Error("You cannot transfer to yourself!");
	} else {
		// Get recipient user
		const recipientUser = await User.findOne({
			phoneNumber: recipientAccountNumber,
		});

		if (!recipientUser) {
			res.status(400);
			throw new Error("Enter valid account number. User not found!");
		} else {
			// Check for transaction pin & validate the pin
			if (
				transactionPin &&
				(await sender.matchTransactionPin(transactionPin))
			) {
				// Check for balance to proceed the transaction
				if (sender.accountBalance < amount) {
					res.status(400);
					throw new Error("Insufficient balance. Top up");
				} else {
					// Debit transaction for the sender
					const debitTransaction = new Transaction({
						senderAccountNumber: req.user.phoneNumber,
						senderName: req.user.name,
						recipientAccountNumber,
						recipientName: recipientUser.name,
						amount,
						narration,
						transactionPin,
						user: req.user._id,
						transactionType: "debit",
					});

					// Credit transaction for the recipient
					const creditTransaction = new Transaction({
						senderAccountNumber: req.user.phoneNumber,
						senderName: req.user.name,
						recipientAccountNumber: recipientUser.phoneNumber,
						recipientName: recipientUser.name,
						amount,
						narration,
						user: recipientUser._id,
						transactionType: "credit",
					});

					// Subtract the sender
					sender.accountBalance = sender.accountBalance - amount;

					// Add the recipient
					recipientUser.accountBalance =
						recipientUser.accountBalance + Number(amount);

					// Save the account balances for both
					const updatedUser = await sender.save();
					await recipientUser.save();

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

export { getAllTransactions, makeTransaction, getRecentTransactions };
