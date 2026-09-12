import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Helper to compute cookie options based on environment and cross-origin setup
const getCookieOptions = (isCrossDomain, isProd) => ({
  httpOnly: true,
  secure: isProd,
  sameSite: isCrossDomain ? "none" : "lax",
});

// Helper to generate token and set cookie
const generateTokenAndSetCookie = (req, res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  const isProd = process.env.NODE_ENV === "production";
  const origin = req.headers.origin || "";
  // Cross-domain if CLIENT_URL is set, or if Origin header indicates a remote domain
  const isCrossDomain =
    isProd && (Boolean(process.env.CLIENT_URL) || origin.includes("vercel.app") || origin.startsWith("https://"));

  res.cookie("token", token, {
    ...getCookieOptions(isCrossDomain, isProd),
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

// POST /api/auth/register
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Please provide all required fields" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already in use" });
    }

    const user = await User.create({ name, email, password });
    
    generateTokenAndSetCookie(req, res, user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Server error during registration" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Please provide email and password" });
  }

  try {
    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      generateTokenAndSetCookie(req, res, user._id);
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    } else {
      res.status(401).json({ error: "Invalid email or password" });
    }
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error during login" });
  }
});

// POST /api/auth/logout
router.post("/logout", (req, res) => {
  const isProd = process.env.NODE_ENV === "production";
  const origin = req.headers.origin || "";
  const isCrossDomain =
    isProd && (Boolean(process.env.CLIENT_URL) || origin.includes("vercel.app") || origin.startsWith("https://"));

  res.cookie("token", "", {
    ...getCookieOptions(isCrossDomain, isProd),
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
});

// GET /api/auth/me
router.get("/me", authMiddleware, async (req, res) => {
  try {
    // req.user is set in authMiddleware
    res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
