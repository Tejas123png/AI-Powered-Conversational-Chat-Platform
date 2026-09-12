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

// Determine allowed origins dynamically:
// 1. Specific production origin configured in CLIENT_URL (e.g. https://ai-powered-conversational-chat-plat.vercel.app)
// 2. Local development environments (e.g. http://localhost:5173, http://localhost:3000)
// 3. Vercel preview deployments for this project (e.g. https://ai-powered-conversational-chat-*.vercel.app)
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
].filter(Boolean);

// Regex matching preview deployments for this project on vercel.app
const vercelPreviewPattern = /^https:\/\/ai-powered-conversational-chat-[a-z0-9-]+-tejas123pns-projects\.vercel\.app$/;
const vercelGeneralProjectPattern = /^https:\/\/ai-powered-conversational-chat(-[a-z0-9-]+)?\.vercel\.app$/;

const corsOptions = {
  origin: (origin, callback) => {
    // 1. Allow requests without Origin (e.g., mobile apps, curl, server-to-server, health checks)
    if (!origin) {
      return callback(null, true);
    }

    // 2. Check exact matches in whitelist
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // 3. Check Vercel preview domain patterns for this project
    if (
      vercelPreviewPattern.test(origin) ||
      vercelGeneralProjectPattern.test(origin)
    ) {
      return callback(null, true);
    }

    // 4. Reject other origins
    console.warn(`[CORS Blocked] Origin not allowed: ${origin}`);
    callback(new Error(`CORS origin not allowed: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
};

app.use(cors(corsOptions));

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