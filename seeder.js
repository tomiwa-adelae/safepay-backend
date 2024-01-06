import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

import users from "./data/users.js";
import User from "./models/userModel.js";
import Transaction from "./models/transactionModel.js";
import connectDb from "./config/db.js";

connectDb();

const importData = async () => {
	try {
		await User.deleteMany();
		await Transaction.deleteMany();

		await User.insertMany(users);

		console.log("Data imported");
		process.exit();
	} catch (err) {
		console.error(`${err}`);
		process.exit(1);
	}
};

const destroyData = async () => {
	try {
		await User.deleteMany();
		await Transaction.deleteMany();

		console.log("Data destroyed!");
		process.exit();
	} catch (err) {
		console.error(`${err}`);
		process.exit(1);
	}
};

if (process.argv[2] === "-d") {
	destroyData();
} else {
	importData();
}
