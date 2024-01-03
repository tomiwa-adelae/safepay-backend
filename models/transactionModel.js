import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
	{
		accountBalance: {
			type: Number,
			required: true,
			default: 0,
		},
		transactions: [
			{
				from: {
					type: String,
					required: true,
				},
				to: {
					type: String,
					required: true,
				},
				transactionType: {
					type: String,
					required: true,
				},
				isSuccessful: {
					type: Boolean,
					default: false,
				},
			},
		],
	},
	{
		timestamps: true,
	}
);

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
