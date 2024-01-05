import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
	const token = jwt.sign({ userId }, process.env.JWT_SECRET);

	return token;

	// res.cookie("jwt", token, {
	// 	httpOnly: true,
	// 	secure: true,
	// 	sameSite: "None",
	// 	maxAge: 60 * 60,
	// });
};

export default generateToken;
