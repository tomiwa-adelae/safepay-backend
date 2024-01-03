import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		phoneNumber: {
			type: String,
			required: true,
			trim: true,
			unique: true,
		},
		transactionPin: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
		},
		// accountBalance: {
		// 	type: Number,
		// 	required: true,
		// 	default: 0,
		// },
		password: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

// match user entered password to hashed password in datatbase
userSchema.methods.matchPassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);
};

// encrypt password for new users
userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		next();
	}

	const salt = await bcrypt.genSalt(10);

	this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

export default User;
