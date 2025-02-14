import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import userRouter from "./Routes/userRoute.js";
import backupRoutes from "./Routes/backupRoutes.js"; 
import backupStatusRoutes from "./Routes/backupStatusRoutes.js"; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(cors());

// Database Connection
connectDB();

// Routes
app.use("/api/user", userRouter);
app.use("/api/backup", backupRoutes); // Uncomment if needed
app.use("/", backupStatusRoutes);


// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
