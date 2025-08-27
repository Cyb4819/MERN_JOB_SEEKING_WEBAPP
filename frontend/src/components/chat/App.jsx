import React, { useEffect } from "react";

import Navbar from "./components/Navbar.jsx";
import HomePage from "./pages/HomePage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore.js";
import { useThemeStore } from "./store/useThemeStore.js";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

const App = () => {
  // Safe destructuring with fallback
  const authStore = useAuthStore();
  const themeStore = useThemeStore();
  const authUser = authStore?.authUser;
  const checkAuth = authStore?.checkAuth;
  const isCheckingAuth = authStore?.isCheckingAuth;
  // const onlineUsers = authStore?.onlineUsers;
  const theme = themeStore?.theme || "coffee";

  useEffect(() => {
    if (checkAuth) checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <div data-theme={theme}>
      <Navbar />
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        {/* Chat does not handle signup/login, handled by main app */}
        <Route path="/settings" element={<SettingsPage />} />
        {/* Profile handled by main app */}
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
