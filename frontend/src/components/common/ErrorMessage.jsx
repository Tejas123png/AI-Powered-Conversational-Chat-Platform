import "./ErrorMessage.css";

export default function ErrorMessage({ message, onDismiss, onRetry }) {
  return (
    <div className="error-message" role="alert">
      <span className="error-icon">⚠</span>
      <span className="error-text">{message}</span>
      <div className="error-actions">
        {onRetry && (
          <button className="error-retry-btn" onClick={onRetry}>
            Retry
          </button>
        )}
        {onDismiss && (
          <button className="error-dismiss-btn" onClick={onDismiss} aria-label="Dismiss error">
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
