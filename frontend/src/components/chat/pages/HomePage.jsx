import { useChatStore } from "../store/useChatStore";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";
import "../chat.css";

const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="chat-page-container">
      <div className="chat-box-wrapper">
        <div className="chat-sidebar">
          <Sidebar />
        </div>

        <div className="chat-main-area">
          {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
        </div>
      </div>
    </div>
  );
};
export default HomePage;

