import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";

// Import Routes
import userRoutes from "./routes/userRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import cookieParser from "cookie-parser";

import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const app = express();

// Express body parser
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

// Cross origin requests
app.use(cors({ credentials: true }));

// Cookie parser
app.use(cookieParser());

// Connect MongoDB
connectDB();
// API Routes
app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes);

app.get("/", (req, res) => {
	res.send("APP IS RUNNING");
});

// Error middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on PORT ${PORT}...`));
