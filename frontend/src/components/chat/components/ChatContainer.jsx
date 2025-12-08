import { useChatStore } from "../store/useChatStore.js";
import { useEffect, useRef, useState } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore.js";
import { formatMessageTime } from "../lib/utils.js";
import { Edit2, Trash2 } from "lucide-react";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    editMessage,
    deleteMessage,
  } = useChatStore();
  const { authUser, socket } = useAuthStore();
  const messageEndRef = useRef(null);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [openImage, setOpenImage] = useState(null);

  if (!authUser) {
    return (
      <div className="chat-main-area">
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Loading...
        </div>
      </div>
    );
  }

  useEffect(() => {
    getMessages(selectedUser._id);

    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // debug: log first message to inspect structure when messages update
  useEffect(() => {
    if (messages && messages.length > 0) {
      console.debug("[ChatContainer] sample message:", messages[0]);
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="chat-main-area">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="chat-main-area">
      <ChatHeader />

      <div className="chat-messages">
        {messages.map((message, idx) => {
          // normalize sender id (message.senderId may be populated object or id string)
          const senderId =
            message.senderId && typeof message.senderId === "object"
              ? message.senderId._id || message.senderId.id || ""
              : message.senderId || "";
          const isOwn = senderId === authUser._id;
          const isEditing = editingId === message._id;
          const createdAtTs = message.createdAt ? new Date(message.createdAt).getTime() : 0;
          const TWENTY_MIN = 20 * 60 * 1000;
          const canEdit = isOwn && (Date.now() - createdAtTs <= TWENTY_MIN);
          const canDelete = isOwn && !message.readAt;

          const handleEditClick = () => {
            setEditingId(message._id);
            setEditText(message.text || "");
          };

          const handleSaveEdit = () => {
            if (editText.trim()) {
              editMessage(message._id, editText);
              setEditingId(null);
              setEditText("");
            }
          };

          const handleDeleteClick = () => {
            if (window.confirm("Delete this message?")) {
              deleteMessage(message._id);
            }
          };

          return (
            <div
              key={message._id}
              className={`message-group ${isOwn ? "own" : ""}`}
              ref={idx === messages.length - 1 ? messageEndRef : null}
              style={{ position: "relative" }}
            >
              <div className="message-content">
                {isEditing ? (
                  <div style={{ display: "flex", gap: "0.5rem", width: "100%" }}>
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      style={{
                        flex: 1,
                        padding: "0.5rem",
                        borderRadius: "8px",
                        border: "1px solid #667eea",
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveEdit();
                        if (e.key === "Escape") setEditingId(null);
                      }}
                    />
                    <button
                      onClick={handleSaveEdit}
                      style={{
                        background: "#667eea",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        padding: "0.5rem 1rem",
                        cursor: "pointer",
                      }}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      style={{
                        background: "#ccc",
                        border: "none",
                        borderRadius: "4px",
                        padding: "0.5rem 1rem",
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <div className={`message-bubble ${isOwn ? "own" : "other"}`}>
                      {message.image && (
                        <img
                          src={message.image}
                          alt="Attachment"
                          className="message-image"
                          style={{ cursor: "pointer" }}
                          onClick={() => setOpenImage(message.image)}
                        />
                      )}

                      {/* robust text fallback: try common fields */}
                      {(() => {
                        const text =
                          message.text || message.message || message.content || message.body ||
                          (message.newMessage && (message.newMessage.text || message.newMessage.message)) || "";
                        if (text) {
                          return <p style={{ margin: 0, color: isOwn ? "#fff" : "#111" }}>{text}</p>;
                        }
                        // if no text and no image, show small placeholder to diagnose
                    
                      })()}
                    </div>
                    <div className="message-time">{formatMessageTime(message.createdAt)}</div>

                    {isOwn && (
                      <div
                        style={{
                          display: "flex",
                          gap: "0.5rem",
                          marginTop: "0.25rem",
                          opacity: 0.7,
                        }}
                      >
                        <button
                          onClick={handleEditClick}
                          disabled={!canEdit}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: canEdit ? "pointer" : "not-allowed",
                            padding: 0,
                            display: "flex",
                            alignItems: "center",
                            opacity: canEdit ? 0.9 : 0.4,
                          }}
                          title={canEdit ? "Edit" : "Edit (disabled after 20 minutes)"}
                        >
                          <Edit2 size={16} color="#667eea" />
                        </button>
                        <button
                          onClick={handleDeleteClick}
                          disabled={!canDelete}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: canDelete ? "pointer" : "not-allowed",
                            padding: 0,
                            display: "flex",
                            alignItems: "center",
                            opacity: canDelete ? 0.9 : 0.4,
                          }}
                          title={canDelete ? "Delete" : "Cannot delete after message was read"}
                        >
                          <Trash2 size={16} color="#ff6b6b" />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <MessageInput />
      {openImage && (
        <div className="image-lightbox-overlay" onClick={() => setOpenImage(null)}>
          <div className="image-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="image-lightbox-close"
              onClick={() => setOpenImage(null)}
              aria-label="Close image"
            >
              ×
            </button>
            <img src={openImage} alt="Zoomed" />
          </div>
        </div>
      )}
    </div>
  );
};
export default ChatContainer;
