import "./EmptyState.css";

const SUGGESTIONS = [
  "Explain how JavaScript Promises work",
  "Help me debug my React component",
  "Write a plan for a new web project",
  "What is the difference between SQL and NoSQL?",
];

export default function EmptyState({ onSend }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">✦</div>
      <h1 className="empty-state-title">How can I help you?</h1>
      <p className="empty-state-subtitle">
        Ask anything. Explore ideas. Build something. Learn something.
      </p>
      <div className="empty-state-suggestions">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            className="suggestion-btn"
            onClick={() => onSend(s)}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
