import { useEffect } from "react";
import { useChat } from "../hooks/useChat";
import Sidebar from "../components/Sidebar/Sidebar";
import MessageList from "../components/Chat/MessageList";
import ChatComposer from "../components/Composer/ChatComposer";
import EmptyState from "../components/common/EmptyState";
import ErrorMessage from "../components/common/ErrorMessage";
import "./ChatPage.css";

export default function ChatPage() {
  const {
    filteredThreads,
    threads,
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
  } = useChat();

  // Load threads on mount
  useEffect(() => {
    loadThreads();
  }, []);

  const handleSend = async (text) => {
    await send(text);
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="chat-page">
      <Sidebar
        threads={threads}
        filteredThreads={filteredThreads}
        activeThread={activeThread}
        threadsLoading={threadsLoading}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onNewChat={startNewChat}
        onSelectThread={selectThread}
        onDeleteThread={removeThread}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="chat-main">
        {/* Header */}
        <header className="chat-header">
          <button
            className="chat-menu-btn"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <span /><span /><span />
          </button>
          <div className="chat-header-title">
            {activeThread ? (activeThread.title || "New Chat") : "NovaMind"}
          </div>
          <div className="chat-header-badge">
            <span className="status-dot" />
            Online
          </div>
        </header>

        {/* Error */}
        {error && (
          <ErrorMessage
            message={error}
            onDismiss={() => setError(null)}
          />
        )}

        {/* Messages or empty state */}
        {hasMessages ? (
          <MessageList messages={messages} loading={loading} />
        ) : (
          <EmptyState onSend={handleSend} />
        )}

        {/* Composer */}
        <ChatComposer
          onSend={handleSend}
          loading={loading}
        />
      </div>
    </div>
  );
}
