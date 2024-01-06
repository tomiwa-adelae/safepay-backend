import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
	const token = jwt.sign({ userId }, process.env.JWT_SECRET);

	return token;
};

export default generateToken;
