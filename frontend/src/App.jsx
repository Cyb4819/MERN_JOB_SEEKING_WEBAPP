import React, { useContext, useEffect } from "react";
import "./App.css";
import { Context } from "./main";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import { Toaster } from "react-hot-toast";
import ChatbotInterface from "./components/ChatbotInterface";
import axios from "axios";
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";
import Home from "./components/Home/Home";
import Jobs from "./components/Job/Jobs";
import JobDetails from "./components/Job/JobDetails";
import Application from "./components/Application/Application";
import MyApplications from "./components/Application/MyApplications";
import PostJob from "./components/Job/PostJob";
import NotFound from "./components/NotFound/NotFound";
import MyJobs from "./components/Job/MyJobs";
import socket from "./socket.js";
import MessagingPage from "./components/chat/page.jsx";
import { MessagingLayout } from "./components/chat/components/MessagingLayout.jsx";

const App = () => {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to Socket.IO server:", socket.id);
      socket.emit("join", { roomId: "abc123", user: socket.id });
    });

    socket.on("welcome", (message) => {
      console.log("Received 'welcome' event from server:", message);
    });

    socket.emit("welcome", "message from client");

    socket.emit("sendMessage", { room: "abc123", message: "Hello from client", name: "vansh" });

    return () => {
      socket.off("connect");
      socket.off("welcome");
    };
  }, []);

  const { isAuthorized, setIsAuthorized, setUser } = useContext(Context);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/user/getuser",
          {
            withCredentials: true,
          }
        );
        setUser(response.data.user);
        setIsAuthorized(true);
      } catch (error) {
        setIsAuthorized(false);
      }
    };
    fetchUser();
  }, [isAuthorized]);

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
          <Route path="/job/getall" element={<Jobs />} />
          <Route path="/job/:id" element={<JobDetails />} />
          <Route path="/application/:id" element={<Application />} />
          <Route path="/applications/me" element={<MyApplications />} />
          <Route path="/job/post" element={<PostJob />} />
          <Route path="/job/me" element={<MyJobs />} />
          <Route path="/messaging" element={<MessagingLayout />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
        <Toaster />
        <ChatbotInterface />
      </BrowserRouter>
    </>
  );
};

export default App;
