import { create } from "zustand";
import { toast } from "react-hot-toast";
import axiosInstance from "../lib/axios";
import { signInWithPopup } from "firebase/auth";
import { consoleError } from "../utils/comman.utils";
import { auth, googleProvider } from "../lib/firebase";

export const useAuthStore = create((set) => ({

    authUser: null,
    setAuthUser: (user) => set({ authUser: user }),

    // CHECK FOR AUTHENTICATED USER
    isCheckingAuth: false,
    checkAuth: async () => {
        set({ isCheckingAuth: true });
        try {
            const response = await axiosInstance.get("/api/v1/auth/check-auth");
            set({ authUser: response?.data?.data });
        } catch (error) {
            set({ authUser: null, error });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    // SIGNUP USER WITH EMAIL AND PASSWORD
    signupUser: async (email, password, confirmPassword, navigateTo) => {
        try {
            const response = await axiosInstance.post("/api/v1/auth/signup", {
                email, password, confirmPassword
            });
            sessionStorage.setItem("email", email);
            toast.success(response?.data?.message);
            navigateTo("/verify-email");
        } catch (error) {
            consoleError("signupUser (auth.store)", error);
            toast.error(error.response?.data?.message || "Internal Server Error.");
        }
    },

    // SIGNUP USER WITH GOOGLE
    signUpWithGoogle: async (navigateTo) => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const response = await axiosInstance.post("/api/v1/auth/signup-with-google", {
                email: result?.user?.email,
                name: result?.user?.displayName,
                picture: result?.user?.photoURL,
                phoneNumber: result?.user?.phoneNumber,
            });

            set({ authUser: response?.data?.data });
            toast.success(response?.data?.message);
            navigateTo("/");
        } catch (error) {
            consoleError("signUpWithGoogle (auth.store)", error);
            toast.error(error.response?.data?.message || "Internal Server Error.");
        }
    },

    // LOGIN USER WITH EMAIL AND PASSWORD
    loginUser: async (email, password, navigateTo) => {
        try {
            const response = await axiosInstance.get(`/api/v1/auth/login?email=${email}&password=${password}`);
            set({ authUser: response?.data?.data });
            toast.success(response?.data?.message);
            navigateTo("/");
        }
        catch (error) {
            consoleError("loginUser (auth.store)", error);
            toast.error(error.response?.data?.message || "Internal Server Error.");
        }
    },

    // LOGIN USER WITH GOOGLE
    loginWithGoogle: async (navigateTo) => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const response = await axiosInstance.post("/api/v1/auth/login-with-google", {
                email: result?.user?.email,
            });

            set({ authUser: response?.data?.data });
            toast.success(response?.data?.message);
            navigateTo("/");
        } catch (error) {
            consoleError("continueWithGoogle (auth.store)", error);
            toast.error(error.response?.data?.message || "Internal Server Error.");
        }
    },

    // VERIFY USER EMAIL
    verifyUserEmail: async (email, emailVerificationCode, setIsVerified) => {
        try {
            const response = await axiosInstance.patch("/api/v1/auth/verify-email", { email, emailVerificationCode });
            set({ authUser: response?.data?.data });
            toast.success(response?.data?.message);
            sessionStorage.removeItem("email");
            setIsVerified(true);
        }
        catch (error) {
            consoleError("verifyUserEmail function (zustand)", error);
            toast.error(error.response?.data?.message || "Internal Server Error.");
        }
    },

    // SEND RESET PASSWORD LINK
    sendResetPassLink: async (email, setIsSuccess) => {
        try {
            const response = await axiosInstance.post("/api/v1/auth/send-reset-password-link", { email });
            toast.success(response?.data?.message);
            setIsSuccess(true);
        }
        catch (error) {
            consoleError("sendResetPassLink (auth.store)", error);
            toast.error(error.response?.data?.message || "Internal Server Error.");
        }
    },

    // RESET USER PASSWORD
    resetUserPassword: async (token, newPassword, confirmNewPassword, setIsSuccess) => {
        try {
            const response = await axiosInstance.patch("/api/v1/auth/reset-password", { token, newPassword, confirmNewPassword });
            toast.success(response?.data?.message);
            setIsSuccess(true);
        }
        catch (error) {
            consoleError("resetUserPassword (auth.store)", error);
            toast.error(error.response?.data?.message || "Internal Server Error.");
        }
    },

    // LOGOUT USER
    logoutUser: async () => {
        try {
            const response = await axiosInstance.get("/api/v1/auth/logout");
            toast.success(response?.data?.message);
            set({ authUser: null });
        } catch (error) {
            consoleError("logoutUser (auth.store)", error);
            toast.error(error.response?.data?.message || "Internal Server Error.");
        }
    },

}));