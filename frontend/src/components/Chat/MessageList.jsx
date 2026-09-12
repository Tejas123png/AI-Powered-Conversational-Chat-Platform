import { useEffect, useRef, useState } from "react";
import Message from "./Message";
import TypingIndicator from "./TypingIndicator";
import "./Chat.css";

export default function MessageList({ messages, loading }) {
  const bottomRef = useRef(null);
  const containerRef = useRef(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const userScrolledUp = useRef(false);

  const scrollToBottom = (smooth = true) => {
    bottomRef.current?.scrollIntoView({ behavior: smooth ? "smooth" : "instant" });
    userScrolledUp.current = false;
    setShowScrollBtn(false);
  };

  // Auto-scroll on new messages unless user scrolled up
  useEffect(() => {
    if (!userScrolledUp.current) {
      scrollToBottom();
    } else {
      setShowScrollBtn(true);
    }
  }, [messages, loading]);

  // Detect manual scroll-up
  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    if (atBottom) {
      userScrolledUp.current = false;
      setShowScrollBtn(false);
    } else {
      userScrolledUp.current = true;
    }
  };

  return (
    <div className="message-list" ref={containerRef} onScroll={handleScroll}>
      {messages.map((msg, i) => (
        <Message key={i} msg={msg} />
      ))}
      {loading && <TypingIndicator />}
      <div ref={bottomRef} />

      {showScrollBtn && (
        <button
          className="scroll-to-bottom-btn"
          onClick={() => scrollToBottom()}
          aria-label="Scroll to latest message"
        >
          ↓ New messages
        </button>
      )}
    </div>
  );
}
