import express from "express";
import Thread from "../models/thread.js";
import getAIresponse from "../utils/OpenAIresponse.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

// Apply auth middleware to all chat routes
router.use(authMiddleware);

// POST /api/thread - Create a new thread
router.post("/thread", async (req, res) => {
  try {
    const thread_id = uuidv4();
    const newThread = new Thread({
      userId: req.user._id,
      thread_id,
      title: "New Chat",
      messages: [],
    });
    const saved = await newThread.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create thread" });
  }
});

// GET /api/thread - Get all threads for authenticated user
router.get("/thread", async (req, res) => {
  try {
    const threads = await Thread.find({ userId: req.user._id }).sort({ upload_at: -1 });
    res.json(threads);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch threads" });
  }
});

// GET /api/thread/:id - Get a single thread by MongoDB _id (authorized)
router.get("/thread/:id", async (req, res) => {
  try {
    const thread = await Thread.findOne({ _id: req.params.id, userId: req.user._id });
    if (!thread) {
      return res.status(404).json({ error: "Thread not found or unauthorized" });
    }
    res.json(thread);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch thread" });
  }
});

// DELETE /api/thread/:id - Delete a thread (authorized)
router.delete("/thread/:id", async (req, res) => {
  try {
    const deleted = await Thread.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!deleted) {
      return res.status(404).json({ error: "Thread not found or unauthorized" });
    }
    res.json({ message: "Thread deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete thread" });
  }
});

// PATCH /api/thread/:id/title - Update thread title (authorized)
router.patch("/thread/:id/title", async (req, res) => {
  try {
    const { title } = req.body || {};
    if (!title) return res.status(400).json({ error: "Title is required" });
    const thread = await Thread.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { title },
      { new: true }
    );
    if (!thread) return res.status(404).json({ error: "Thread not found or unauthorized" });
    res.json(thread);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update title" });
  }
});

// POST /api/chat - Send a message to a thread (authorized)
router.post("/chat", async (req, res) => {
  const { thread_id, message } = req.body || {};
  if (!thread_id || !message) {
    return res.status(400).json({ error: "thread_id and message are required" });
  }
  try {
    let thread = await Thread.findOne({ thread_id, userId: req.user._id });

    if (!thread) {
      // Create a new thread if one doesn't exist with this thread_id for this user
      thread = new Thread({
        userId: req.user._id,
        thread_id,
        title: message.slice(0, 60),
        messages: [],
      });
    }

    // Push user message
    thread.messages.push({ role: "user", content: message });

    // If this is first message, set title from it
    if (thread.messages.length === 1) {
      thread.title = message.slice(0, 60);
    }

    // Get AI response
    const assistantResponse = await getAIresponse(message);

    // Push assistant message
    thread.messages.push({ role: "assistant", content: assistantResponse });

    await thread.save();

    res.json({
      thread_id: thread.thread_id,
      _id: thread._id,
      assistantMessage: {
        role: "assistant",
        content: assistantResponse,
        timeStamp: new Date(),
      },
      thread,
    });
  } catch (err) {
    console.error("Chat route error:", err);
    res.status(500).json({ error: "Failed to process chat" });
  }
});

export default router;