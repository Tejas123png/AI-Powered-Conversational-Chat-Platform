import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState } from "react";
import "./Chat.css";

function CodeBlock({ language, children }) {
  const [copied, setCopied] = useState(false);
  const code = String(children).trimEnd();
  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <div className="code-block">
      <div className="code-block-header">
        <span className="code-block-lang">{language || "code"}</span>
        <button className="code-copy-btn" onClick={handleCopy} aria-label="Copy code">
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>
      <pre><code>{code}</code></pre>
    </div>
  );
}

export default function Message({ msg }) {
  const isUser = msg.role === "user";

  return (
    <div className={`message-row ${isUser ? "message-row--user" : "message-row--assistant"}`}>
      {!isUser && (
        <div className="message-avatar" aria-label="AI">
          <span>✦</span>
        </div>
      )}
      <div className={`message-bubble ${isUser ? "message-bubble--user" : "message-bubble--assistant"}`}>
        {isUser ? (
          <p className="message-text">{msg.content}</p>
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                if (!inline) {
                  return (
                    <CodeBlock language={match ? match[1] : ""}>
                      {children}
                    </CodeBlock>
                  );
                }
                return <code className="inline-code" {...props}>{children}</code>;
              },
              pre({ children }) {
                return <>{children}</>;
              },
            }}
          >
            {msg.content}
          </ReactMarkdown>
        )}
      </div>
      {isUser && (
        <div className="message-avatar message-avatar--user" aria-label="You">
          <span>U</span>
        </div>
      )}
    </div>
  );
}
