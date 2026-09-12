import { useState, useCallback, useRef } from "react";
import {
  createThread,
  getThreads,
  getThread,
  deleteThread,
  sendMessage,
  updateThreadTitle,
} from "../services/api";

export function useChat() {
  const [threads, setThreads] = useState([]);
  const [activeThread, setActiveThread] = useState(null); // full thread document
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);       // AI generating
  const [threadsLoading, setThreadsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const abortRef = useRef(null);

  // ---- Threads ----

  const loadThreads = useCallback(async () => {
    setThreadsLoading(true);
    try {
      const data = await getThreads();
      setThreads(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setThreadsLoading(false);
    }
  }, []);

  const startNewChat = useCallback(async () => {
    try {
      const thread = await createThread();
      setThreads((prev) => [thread, ...prev]);
      setActiveThread(thread);
      setMessages([]);
      setError(null);
    } catch (e) {
      setError(e.message);
    }
  }, []);

  const selectThread = useCallback(async (threadDoc) => {
    setError(null);
    setActiveThread(threadDoc);
    try {
      const full = await getThread(threadDoc._id);
      setActiveThread(full);
      setMessages(full.messages || []);
    } catch (e) {
      if (e.message.includes("404") || e.message.includes("not found")) {
        setThreads((prev) => prev.filter((t) => t._id !== threadDoc._id));
        setActiveThread(null);
        setMessages([]);
        setError("That conversation no longer exists.");
      } else {
        setError(e.message);
      }
    }
  }, []);

  const removeThread = useCallback(
    async (threadId, e) => {
      e?.stopPropagation();
      try {
        await deleteThread(threadId);
        setThreads((prev) => prev.filter((t) => t._id !== threadId));
        if (activeThread?._id === threadId) {
          setActiveThread(null);
          setMessages([]);
        }
      } catch (e2) {
        setError(e2.message);
      }
    },
    [activeThread]
  );

  // ---- Messaging ----

  const send = useCallback(
    async (text) => {
      if (!text.trim() || loading) return;
      setError(null);

      // We must have an active thread with a thread_id
      let thread = activeThread;
      if (!thread) {
        try {
          thread = await createThread();
          setThreads((prev) => [thread, ...prev]);
          setActiveThread(thread);
        } catch (e) {
          setError(e.message);
          return;
        }
      }

      const userMsg = { role: "user", content: text, timeStamp: new Date() };
      setMessages((prev) => [...prev, userMsg]);
      setLoading(true);

      try {
        const result = await sendMessage(thread.thread_id, text);

        // Update local messages with assistant response
        setMessages((prev) => [...prev, result.assistantMessage]);

        // Update thread title in sidebar if it was "New Chat"
        const updatedThread = result.thread;
        setActiveThread(updatedThread);
        setThreads((prev) =>
          prev.map((t) => (t._id === updatedThread._id ? updatedThread : t))
        );
      } catch (e) {
        setError(e.message || "Failed to get AI response. Try again.");
        // Remove the optimistic user message on failure
        setMessages((prev) => prev.filter((m) => m !== userMsg));
      } finally {
        setLoading(false);
      }
    },
    [activeThread, loading]
  );

  const filteredThreads = threads.filter((t) =>
    t.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    threads,
    filteredThreads,
    activeThread,
    messages,
    loading,
    threadsLoading,
    error,
    sidebarOpen,
    searchQuery,
    setSearchQuery,
    setSidebarOpen,
    loadThreads,
    startNewChat,
    selectThread,
    removeThread,
    send,
    setError,
  };
}
