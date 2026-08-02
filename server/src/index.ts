import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { connectDB } from "@config/databaseConfig";

import taskRoutes from "@routes/taskRoutes";
import statisticsRoutes from "@routes/statisticsRoutes";
import userRoutes from "@routes/userRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());
app.use("/api", taskRoutes);
app.use("/api", statisticsRoutes);
app.use("/api", userRoutes);

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

start();