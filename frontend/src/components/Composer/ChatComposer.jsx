import { useRef, useEffect } from "react";
import "./ChatComposer.css";

export default function ChatComposer({ onSend, loading, disabled }) {
  const textareaRef = useRef(null);

  // Auto-grow textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
  });

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    const val = textareaRef.current?.value.trim();
    if (!val || loading) return;
    onSend(val);
    textareaRef.current.value = "";
    textareaRef.current.style.height = "auto";
    textareaRef.current.focus();
  };

  return (
    <div className="composer-wrapper">
      <div className="composer-container">
        <div className={`composer-box ${loading ? "composer-box--loading" : ""}`}>
          <textarea
            ref={textareaRef}
            className="composer-textarea"
            placeholder={loading ? "Waiting for response..." : "Message NovaMind…"}
            onKeyDown={handleKeyDown}
            disabled={loading || disabled}
            rows={1}
            aria-label="Message input"
            aria-multiline="true"
          />
          <button
            className={`composer-send-btn ${loading ? "composer-send-btn--loading" : ""}`}
            onClick={handleSend}
            disabled={loading || disabled}
            aria-label="Send message"
          >
            {loading ? (
              <span className="composer-spinner" />
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
            )}
          </button>
        </div>
        <p className="composer-hint">
          Enter to send · Shift+Enter for newline
        </p>
      </div>
    </div>
  );
}
