import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["user", "assistant"],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timeStamp: {
    type: Date,
    default: Date.now,
  },
});

const ThreadSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  thread_id: String,
  title: {
    type: String,
    default: "new chat",
  },
  messages: [MessageSchema],
  upload_at: {
    type: Date,
    default: Date.now,
  },
});

const Thread = mongoose.model("Thread", ThreadSchema);

export default Thread;