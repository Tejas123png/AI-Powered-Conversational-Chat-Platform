import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import chatRoutes from "./backend/routes/chat.js";
import authRoutes from "./backend/routes/auth.js";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Support production frontend origin or localhost in dev
const clientOrigin = process.env.CLIENT_URL || true;
app.use(
  cors({
    origin: clientOrigin === "true" ? true : clientOrigin,
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api", chatRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// In production, serve frontend only if dist exists (e.g. monolithic deployment)
if (process.env.NODE_ENV === "production") {
  const distPath = path.join(__dirname, "frontend", "dist");
  if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
}

const PORT = process.env.PORT || 8080;

// Database Connection
const connectdb = async () => {
  try {
    await mongoose.connect(process.env.mongoatlas_url);
    console.log("Connected to MongoDB database");
  } catch (err) {
    console.error("MongoDB Connection Error:", err);
  }
};

// Start Server
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await connectdb();
});