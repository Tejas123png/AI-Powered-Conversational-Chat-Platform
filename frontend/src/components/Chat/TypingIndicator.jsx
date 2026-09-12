export default function TypingIndicator() {
  return (
    <div className="message-row message-row--assistant">
      <div className="message-avatar" aria-label="AI">
        <span>✦</span>
      </div>
      <div className="message-bubble message-bubble--assistant typing-indicator" aria-label="AI is thinking">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}
