import { MessageSquare } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="no-chat-selected">
      <div className="no-chat-selected-icon">
        <MessageSquare size={80} />
      </div>
      <h2>Start Your Conversation!</h2>
      <p>Select a conversation from the sidebar to start chatting</p>
    </div>
  );
};

export default NoChatSelected;
