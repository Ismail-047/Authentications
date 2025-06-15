import express from "express";
// CONTROLLERS
import {
    checkAuth,
    loginUser,
    logoutUser,
    signupUser,
    verifyUserEmail,
    resetUserPassword,
    sendResetPassLink,
    // deleteUserById,
    // signupUser2,
    loginWithGoogle,
    signupWithGoogle,
} from "../controllers/auth.controllers.js";
// MIDDLEWARES
import { authenticateToken } from "../middlewares/authenticateToken.js";

const router = express.Router();

// GET REQUESTS
router.get("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/check-auth", authenticateToken, checkAuth);

// POST REQUESTS
router.post("/signup", signupUser);
router.post("/login-with-google", loginWithGoogle);
router.post("/signup-with-google", signupWithGoogle);
router.post("/send-reset-password-link", sendResetPassLink);

// PATCH REQUESTS
router.patch("/verify-email", verifyUserEmail);
router.patch("/reset-password", resetUserPassword);

//DELETE REQUESTS
// router.delete("/delete-user", authenticateToken, deleteUserById);

export default router;