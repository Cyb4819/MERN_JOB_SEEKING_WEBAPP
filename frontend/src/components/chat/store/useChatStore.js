import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";
import { useAuthStore } from "./useAuthStore.js";
import { io } from "socket.io-client";
import axios from 'axios';

// Ensure the socket connection is established correctly
const socket = io("http://localhost:3000");

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  searchResults: [],

  searchUsers: async (query) => {
    if (!query) return set({ searchResults: [] });
    const res = await axiosInstance.get(`/message/search?q=${encodeURIComponent(query)}`);
    set({ searchResults: res.data });
  },

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      // Use backend chat users endpoint
      const res = await axiosInstance.get("/message/sidebar/users");
      console.log("[getUsers] response:", res.data);
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      console.error("[getUsers] error:", error);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/message/messages?receiverId=${userId}`);
      console.log("[getMessages] response:", res.data);
      set({ messages: res.data });
    } catch (error) {
      console.error("[getMessages] error:", error);
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  },

  editMessage: async (messageId, text) => {
    const { messages } = get();
    try {
      const res = await axiosInstance.put(`/message/edit/${messageId}`, { text });
      const updated = messages.map((msg) =>
        msg._id === messageId ? res.data : msg
      );
      set({ messages: updated });
      toast.success("Message updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to edit message");
    }
  },

  deleteMessage: async (messageId) => {
    const { messages } = get();
    try {
      await axiosInstance.delete(`/message/delete/${messageId}`);
      set({ messages: messages.filter((msg) => msg._id !== messageId) });
      toast.success("Message deleted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete message");
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) {
      console.error("No selected user, can't subscribe to messages.");
      return;
    }

    const socket = useAuthStore.getState().socket;
    if (!socket) {
      console.error("Socket is not initialized!");
      return;
    }

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
