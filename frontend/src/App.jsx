import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Chat from "./pages/Chat";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Settings from "./pages/Setting";
import Notification from "./pages/Notification";
import Friend from "./pages/Friend";
import VerifyEmail from "./pages/auth/VerifyEmail";

import { useAuth } from "./hooks/useAuth";

const App = () => {
  const { authUser, isLoading } = useAuth();

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
      </div>
    );

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            authUser ? <Chat authUser={authUser} /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/login"
          element={!authUser ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/register"
          element={!authUser ? <Register /> : <Navigate to="/" />}
        />
        <Route
          path="/settings"
          element={
            authUser ? (
              <Settings authUser={authUser} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/notifications"
          element={
            authUser ? (
              <Notification authUser={authUser} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/friends"
          element={
            authUser ? (
              <Friend authUser={authUser.user} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
      <Toaster />
    </>
  );
};

export default App;
