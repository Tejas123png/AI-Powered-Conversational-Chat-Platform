import { useEffect, useState } from "react";
import "./Sidebar.css";
import "./SidebarFooter.css";
import { useAuth } from "../../context/AuthContext";

// Group threads by date label
function groupByDate(threads) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today - 86400000);
  const lastWeek = new Date(today - 7 * 86400000);
  const lastMonth = new Date(today - 30 * 86400000);

  const groups = { Today: [], Yesterday: [], "Last 7 days": [], "Last 30 days": [], Older: [] };
  threads.forEach((t) => {
    const d = new Date(t.upload_at || t.createdAt);
    if (d >= today) groups["Today"].push(t);
    else if (d >= yesterday) groups["Yesterday"].push(t);
    else if (d >= lastWeek) groups["Last 7 days"].push(t);
    else if (d >= lastMonth) groups["Last 30 days"].push(t);
    else groups["Older"].push(t);
  });
  return groups;
}

export default function Sidebar({
  threads,
  filteredThreads,
  activeThread,
  threadsLoading,
  searchQuery,
  setSearchQuery,
  onNewChat,
  onSelectThread,
  onDeleteThread,
  isOpen,
  onClose,
}) {
  const grouped = groupByDate(filteredThreads);
  const hasResults = filteredThreads.length > 0;
  const { user, logout } = useAuth();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}

      <aside className={`sidebar ${isOpen ? "sidebar--open" : ""}`}>
        {/* Header */}
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="sidebar-logo-icon">✦</span>
            <span className="sidebar-logo-text">NovaMind</span>
          </div>
          <button className="sidebar-close-btn" onClick={onClose} aria-label="Close sidebar">
            ✕
          </button>
        </div>

        {/* New Chat */}
        <button className="new-chat-btn" onClick={onNewChat}>
          <span className="new-chat-icon">+</span>
          New Chat
        </button>

        {/* Search */}
        <div className="sidebar-search">
          <span className="search-icon">⌕</span>
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button className="search-clear" onClick={() => setSearchQuery("")}>✕</button>
          )}
        </div>

        {/* Thread list */}
        <div className="sidebar-threads">
          {threadsLoading ? (
            <div className="sidebar-loading">
              <div className="sidebar-loading-dots">
                <span /><span /><span />
              </div>
            </div>
          ) : !hasResults ? (
            <div className="sidebar-empty">
              {searchQuery ? (
                <p>No conversations match "{searchQuery}"</p>
              ) : (
                <p>No conversations yet.<br />Start a new chat.</p>
              )}
            </div>
          ) : (
            Object.entries(grouped).map(([label, items]) =>
              items.length === 0 ? null : (
                <div key={label} className="thread-group">
                  <div className="thread-group-label">{label}</div>
                  {items.map((t) => (
                    <ConversationItem
                      key={t._id}
                      thread={t}
                      isActive={activeThread?._id === t._id}
                      onSelect={() => onSelectThread(t)}
                      onDelete={(e) => onDeleteThread(t._id, e)}
                    />
                  ))}
                </div>
              )
            )
          )}
        </div>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user?.name || "User"}</div>
            <div className="sidebar-user-email">{user?.email || "user@email.com"}</div>
          </div>
          <div className="sidebar-footer-item">
            <span>⚙</span> Settings
          </div>
          <div className="sidebar-footer-item" onClick={logout} style={{ color: "#ef4444" }}>
            <span>🚪</span> Log out
          </div>
        </div>
      </aside>
    </>
  );
}

function ConversationItem({ thread, isActive, onSelect, onDelete }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className={`conversation-item ${isActive ? "conversation-item--active" : ""}`}
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onSelect()}
      aria-label={thread.title}
    >
      <span className="conversation-item-title">{thread.title || "New Chat"}</span>
      {hovered && (
        <button
          className="conversation-item-delete"
          onClick={onDelete}
          aria-label="Delete conversation"
          title="Delete"
        >
          🗑
        </button>
      )}
    </div>
  );
}
