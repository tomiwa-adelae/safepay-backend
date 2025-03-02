import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

// Middleware that protect unauthorized personnel
const protect = asyncHandler(async (req, res, next) => {
	let token;

	token = req.header("authorization");

	if (token) {
		try {
			const decoded = jwt.verify(token, process.env.JWT_SECRET);

			req.user = await User.findById(decoded.userId).select("-password");
			next();
		} catch (err) {
			res.status(401);
			throw new Error("Not authorized, token failed!");
		}
	} else {
		res.status(401);
		throw new Error("Not authorized, no token");
	}
});

export { protect };
