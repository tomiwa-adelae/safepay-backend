import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import bcrypt from "bcryptjs";

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
	// Get details from the request body
	const { phoneNumber, password } = req.body;

	// Find user and confirm if user exist
	const user = await User.findOne({ phoneNumber });

	if (user && (await user.matchPassword(password))) {
		const token = generateToken(res, user._id);

		// Send user
		res.json({
			_id: user._id,
			name: user.name,
			email: user.email,
			phoneNumber: user.phoneNumber,
			accountBalance: user.accountBalance,
			token,
		});
	} else {
		res.status(401);
		throw new Error("Invalid phone number or password!");
	}
});

// @desc    Register new user & get token
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
	// Get details from the request body
	const { name, email, phoneNumber, transactionPin, password } = req.body;

	// Find user and confirm if user exist
	const userExist = await User.findOne({ phoneNumber });

	if (userExist) {
		res.status(400);
		throw new Error("User already exists! Please login");
	}
	// Create a new user in database
	const user = await User.create({
		name,
		email,
		password,
		phoneNumber,
		transactionPin,
	});

	if (user) {
		const token = generateToken(res, user._id);

		// Send user
		res.status(201).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			phoneNumber: user.phoneNumber,
			accountBalance: user.accountBalance,
			token,
		});
	} else {
		res.status(400);
		throw new Error("Invalid user data");
	}
});

// @desc    Refresh page to get current details
// @route   GET /api/users
// @access  Private
const refreshUser = asyncHandler(async (req, res) => {
	// Get details from request body
	const phoneNumber = req.user.phoneNumber;

	// Find user
	const user = await User.findOne({ phoneNumber });

	const token = generateToken(res, user._id);

	// Send user
	res.status(201).json({
		_id: user._id,
		name: user.name,
		email: user.email,
		phoneNumber: user.phoneNumber,
		accountBalance: user.accountBalance,
		token,
	});
});

// @desc    Get a single user with their phone number
// @route   GET /api/users/:phoneNumber
// @access  Private
const getUser = asyncHandler(async (req, res) => {
	try {
		// Get details from request body
		const phoneNumber = req.params.phoneNumber;

		// Find user
		const recipient = await User.findOne({ phoneNumber });

		// Confirm if the sender is equal to the recipient
		if (phoneNumber === req.user.phoneNumber) {
			res.status(400);
			throw new Error("You cannot transfer to yourself!");
		} else {
			if (recipient) {
				// Send recipient
				res.status(200).json({
					name: recipient.name,
				});
			} else {
				res.status(400);
				throw new Error("Enter valid account number. User not found!");
			}
		}
	} catch (err) {
		res.status(400);
		throw new Error(err);
	}
});

// @desc    Update user login password
// @route   PUT /api/users/password
// @access  Private
const updateUserPassword = asyncHandler(async (req, res) => {
	// Get details from request body
	const { oldPassword, newPassword } = req.body;

	const user = await User.findById(req.user._id);

	if (user) {
		if (await user.matchPassword(oldPassword)) {
			user.password = newPassword;

			// Hash new password with Bcrypt
			const salt = await bcrypt.genSalt(10);

			user.password = await bcrypt.hash(user.password, salt);

			// Save user
			await user.save();

			res.status(201).json({
				msg: "Your login password has been changed successfully!",
			});
		} else {
			res.status(404);
			throw new Error("Invalid old password!");
		}
	} else {
		res.status(404);
		throw new Error("User not found! An error occured!");
	}
});

// @desc    Update user transaction pin
// @route   PUT /api/users/pin
// @access  Private
const updateUserPin = asyncHandler(async (req, res) => {
	const { oldTransactionPin, newTransactionPin } = req.body;

	const user = await User.findById(req.user._id);

	if (user) {
		if (await user.matchTransactionPin(oldTransactionPin)) {
			user.transactionPin = newTransactionPin;

			// Hash new pin with Bcrypt
			const salt = await bcrypt.genSalt(10);

			user.password = await bcrypt.hash(user.transactionPin, salt);

			// Save user
			await user.save();

			res.status(201).json({
				msg: "Your transaction pin has been changed successfully!",
			});
		} else {
			res.status(404);
			throw new Error("Invalid old transaction pin!");
		}
	} else {
		res.status(404);
		throw new Error("User not found! An error occured!");
	}
});

export {
	loginUser,
	registerUser,
	refreshUser,
	getUser,
	updateUserPassword,
	updateUserPin,
};
