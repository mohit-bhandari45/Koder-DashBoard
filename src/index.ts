import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { connectDatabase } from "./config/database.config";
import cookieParser from "cookie-parser";
import os from "os";
import dashBoardRoutes from "./modules/dashboard/dashboard.routes";
import adminRoutes from "./modules/admin";

const PORT = process.env.PORT || 4000;
const app = express();

// Connect to database
connectDatabase();

// middlewares
app.use(express.json());
app.use(cookieParser());

// cors
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "https://koder-frontend.vercel.app"
        : "http://localhost:3000",
  })
);

// routes
app.use("/dashboard", dashBoardRoutes);
app.use("/admin", adminRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ success: true, timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
