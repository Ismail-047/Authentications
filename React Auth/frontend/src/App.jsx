import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyEmail from "./pages/VerifyEmail";
import ResetPassword from "./pages/ResetPassword";
import RequestPasswordReset from "./pages/RequestPasswordReset";
import { useAuthStore } from "./zustand/auth.store";

export default function App() {

  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const pathName = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathName]);

  if (isCheckingAuth) return (
    <div className="h-screen flex items-center flex-col justify-center bg-gray-50">
      <div className="w-10 h-10 border-t-4 border-b-4 border-gray-900 rounded-full animate-spin"></div>
      <div className="text-2xl font-bold mt-4">Loading...</div>
    </div>
  );

  return (
    <>
      <Toaster position="top-right"
        toastOptions={{
          style: { background: "#333", color: "#fff" },
          duration: 4000,
        }}
      />

      <Routes>
        <Route path="/"
          element={authUser ? <Home /> : <Login />}
        />
        <Route path="/login"
          element={!authUser ? <Login /> : <Navigate to="/" replace />}
        />
        <Route path="/signup"
          element={!authUser ? <Signup /> : <Navigate to="/" replace />}
        />
        <Route path="/verify-email"
          element={sessionStorage.getItem("email") || !authUser?.isVerified ? <VerifyEmail /> : <Navigate to="/" replace />}
        />
        <Route path="/reset-password"
          element={<ResetPassword />}
        />
        <Route path="/request-reset-password"
          element={<RequestPasswordReset />}
        />
      </Routes>
    </>
  )
}