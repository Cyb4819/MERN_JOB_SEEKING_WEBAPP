import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, Search } from "lucide-react";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading, searchUsers, searchResults } = useChatStore();
  const [search, setSearch] = useState("");

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  // If there's an active search query, prefer server-side results (if any),
  // otherwise fall back to local filtering of the `users` list.
  const filteredUsers = (search.trim().length > 0 ? (searchResults || []) : users).filter((user) => {
    const name = (user.fullName || user.name || user.username || "").toLowerCase();
    return name.includes(search.toLowerCase());
  });

  // Debounced remote search: call `searchUsers` 300ms after the user stops typing.
  // When the search is cleared, call `searchUsers('')` to reset server-side results.
  useEffect(() => {
    if (search.trim().length === 0) {
      // clear remote results
      searchUsers("").catch((err) => console.error("searchUsers clear failed:", err));
      return;
    }

    const t = setTimeout(() => {
      searchUsers(search).catch((err) => console.error("searchUsers failed:", err));
    }, 300);
    return () => clearTimeout(t);
  }, [search, searchUsers]);

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <>
      <div className="chat-sidebar-header">
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Users size={20} />
          <h2>Contacts</h2>
        </div>
      </div>

      {/* 🔍 Search Bar */}
      <div className="chat-sidebar-search">
        <Search size={16} className="search-icon" />
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <ul className="chat-users-list">
        {filteredUsers.map((user) => (
          <li
            key={user._id}
            className={`chat-user-item ${selectedUser?._id === user._id ? "active" : ""}`}
            onClick={() => setSelectedUser(user)}
          >
            <div className="chat-user-avatar">
              <img src={user.profilePic || "/avatar.png"} alt={user.fullName} />
            </div>
            <div className="chat-user-info">
              <p className="chat-user-name">
                {user.fullName || user.name || user.username}
              </p>
            </div>
          </li>
        ))}

        {filteredUsers.length === 0 && (
          <div style={{ textAlign: "center", color: "#868e96", padding: "1rem" }}>
            No users found
          </div>
        )}
      </ul>
    </>
  );
};

export default Sidebar;
