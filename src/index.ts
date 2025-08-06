import express from "express";
import cors from "cors";
import { connectDatabase } from "./config/database.config";
import cookieParser from "cookie-parser";
import os from "os";
import dashBoardRoutes from "./modules/dashboard/dashboard.routes";
import { authCheck } from "./modules/middlewares/auth.middleware";

const PORT = process.env.PORT || 8000;
const app = express();

// Connect to database
connectDatabase();

// middlewares
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));
app.use(cookieParser());
app.use(authCheck);

// routes
app.use("/dashboard", dashBoardRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Code execution server is running 🚀",
    timestamp: new Date().toISOString(),
    system: {
      platform: os.platform(),                      // e.g., 'linux'
      arch: os.arch(),                              // e.g., 'x64'
      cpus: os.cpus().length,                       // Number of CPU cores
      totalMemory: `${(os.totalmem() / 1e9).toFixed(2)} GB`, // GB
      freeMemory: `${(os.freemem() / 1e9).toFixed(2)} GB`,   // GB
      uptime: `${(os.uptime() / 3600).toFixed(2)} hours`,    // hours
      hostname: os.hostname(),
    },
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});