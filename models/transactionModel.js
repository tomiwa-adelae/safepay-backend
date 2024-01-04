import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
		recipientAccountNumber: {
			type: Number,
			required: true,
		},
		recipientName: {
			type: String,
			required: true,
		},
		senderName: {
			type: String,
			required: true,
		},
		senderAccountNumber: {
			type: Number,
			required: true,
		},
		isSuccessful: {
			type: Boolean,
			default: true,
		},
		transactionType: {
			type: String,
			required: true,
		},
		amount: {
			type: Number,
			required: true,
			default: 0,
		},
		narration: { type: String },
	},
	{
		timestamps: true,
	}
);

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
