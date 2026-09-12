import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import getAIresponse from "./backend/utils/OpenAIresponse.js";
import chatRoutes from "./backend/routes/chat.js";

const app = express();
app.use(express.json());
app.use(cors());
app.use("/api", chatRoutes);


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

// Chat Endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const reply = await getAIresponse(message);
    res.json({ reply });
  } catch (error) {
    console.error("Chat route error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Start Server
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await connectdb();
});