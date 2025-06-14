import Login from "./pages/Login";
import { Toaster } from "react-hot-toast";
import { Routes, Route, Navigate } from "react-router-dom";

export default function App() {

  const isAuthenticated = true;

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
          element={!isAuthenticated ? <VerifyEmail /> : <Navigate to="/" replace />}
        />
        <Route path="/reset-password"
          element={<ResetPassword />}
        />
        <Route path="/request-reset-password"
          element={<RequestPasswordReset />}
        />
      </Routes>
      <Login />
    </>
  )
}