import bcrypt from "bcryptjs";

const users = [
	{
		name: "John Doe",
		phoneNumber: "08027836001",
		transactionPin: bcrypt.hashSync("1234", 10),
		email: "john@gmail.com",
		accountBalance: 5000,
		password: bcrypt.hashSync("1234567890", 10),
	},
	{
		name: "Jane Doe",
		phoneNumber: "07038803037",
		transactionPin: bcrypt.hashSync("1234", 10),
		email: "jane@gmail.com",
		accountBalance: 5000,
		password: bcrypt.hashSync("1234567890", 10),
	},
	{
		name: "Donald Trump",
		phoneNumber: "07033623935",
		transactionPin: bcrypt.hashSync("1234", 10),
		email: "donald@gmail.com",
		accountBalance: 5000,
		password: bcrypt.hashSync("1234567890", 10),
	},
	{
		name: "Joe Biden",
		phoneNumber: "07015687868",
		transactionPin: bcrypt.hashSync("1234", 10),
		email: "joe@gmail.com",
		accountBalance: 5000,
		password: bcrypt.hashSync("1234567890", 10),
	},
	{
		name: "Bola Tinubu",
		phoneNumber: "09033826455",
		transactionPin: bcrypt.hashSync("1234", 10),
		email: "bola@gmail.com",
		accountBalance: 5000,
		password: bcrypt.hashSync("1234567890", 10),
	},
];

export default users;
