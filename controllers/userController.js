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
			// accountbalance: user.accountBalance,
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

	// // Check for all fields filled
	// if (!name || !email || !transactionPin || !phoneNumber || !password) {
	// 	res.status(400);
	// 	throw new Error("Please enter all fields!");
	// }

	// if (phoneNumber.length !== 11 || phoneNumber.charAt(0) !== "0") {
	// 	res.status(400);
	// 	throw new Error("Enter a valid phone number!");
	// }

	// if (password.length <= 6) {
	// 	res.status(400);
	// 	throw new Error("Password should be at least 6 character long!");
	// }

	// if (transactionPin.length !== 4) {
	// 	res.status(400);
	// 	throw new Error("Transaction pin should be 4 digits");
	// }

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
			// accountbalance: user.accountBalance,
			token,
		});

		// console.log(res.cookie);
	} else {
		res.status(400);
		throw new Error("Invalid user data");
	}
});

export { loginUser, registerUser };
