import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyEmail from "./pages/VerifyEmail";
import ResetPassword from "./pages/ResetPassword";
import RequestPasswordReset from "./pages/RequestPasswordReset";

export default function App() {

  const isAuthenticated = false;

  const pathName = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathName]);

  return (
    <>
      <Toaster position="top-right"
        toastOptions={{
          style: { background: "#333", color: "#fff" },
          duration: 3000,
        }}
      />

      <Routes>
        <Route path="/"
          element={isAuthenticated ? <Home /> : <Login />}
        />
        <Route path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />}
        />
        <Route path="/signup"
          element={!isAuthenticated ? <Signup /> : <Navigate to="/" replace />}
        />
        <Route path="/verify-email"
          element={!isAuthenticated
            // && sessionStorage.getItem("email") 
            ? <VerifyEmail /> : <Navigate to="/" replace />}
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