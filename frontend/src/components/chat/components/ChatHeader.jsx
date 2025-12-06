import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore.js";
import { useChatStore } from "../store/useChatStore.js";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  const displayName = selectedUser
    ? (selectedUser.fullName || selectedUser.name || selectedUser.username || "Unknown")
    : "";

  return (
    <div className="chat-header">
      <div className="chat-header-info">
        <div className="chat-header-avatar">
          <img src={(selectedUser && selectedUser.profilePic) || "/avatar.png"} alt={displayName} />
        </div>
        <div className="chat-header-details">
          <h3>{displayName || "Select a contact"}</h3>
          <p className="chat-header-status">
            {selectedUser ? (onlineUsers.includes(selectedUser._id) ? "Online" : "Offline") : ""}
          </p>
        </div>
      </div>
      <button className="chat-close-btn" onClick={() => setSelectedUser(null)}>
        <X size={24} />
      </button>
    </div>
  );
};
export default ChatHeader;
