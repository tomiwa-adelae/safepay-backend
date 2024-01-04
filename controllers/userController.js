import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
	const { phoneNumber, password } = req.body;

	const user = await User.findOne({ phoneNumber });

	if (user && (await user.matchPassword(password))) {
		const token = generateToken(res, user._id);

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
	const { name, email, phoneNumber, transactionPin, password } = req.body;

	const userExist = await User.findOne({ phoneNumber });

	if (userExist) {
		res.status(400);
		throw new Error("User already exists!");
	}
	const user = await User.create({
		name,
		email,
		password,
		phoneNumber,
		transactionPin,
	});

	if (user) {
		const token = generateToken(res, user._id);

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
	const phoneNumber = req.user.phoneNumber;
	const user = await User.findOne({ phoneNumber });

	const token = generateToken(res, user._id);

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
		const phoneNumber = req.params.phoneNumber;
		const recipient = await User.findOne({ phoneNumber });

		// console.log(recipient, req.user);

		if (recipient) {
			if (phoneNumber === req.user.phoneNumber) {
				res.status(400);
				throw new Error("You cannot transfer to yourself!");
			} else {
				res.json({
					name: recipient.name,
				});
			}
		} else {
			res.status(400);
			throw new Error("Enter valid account number. User not found!");
		}
	} catch (err) {
		res.status(400);
		throw new Error("Enter valid account number. User not found!");
	}
});

export { loginUser, registerUser, refreshUser, getUser };
