import { z } from "zod";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import useAuthStore from "../zustand/auth.store";
import { ThemeButton } from "../components/Buttons";
import { InputPassword } from "../components/Inputs";
import { Link, useNavigate } from "react-router-dom";
import { Lock, ArrowLeft, CheckCircle } from "lucide-react";

export default function ResetPassword() {

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    const navigateTo = useNavigate();

    const [errors, setErrors] = useState({});
    const [newPassword, setNewPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    const { resetUserPassword } = useAuthStore();

    const formSchema = z.object({

        newPassword: z.string()
            .min(1, "New password is required.")
            .min(8, "New password must be at least 8 characters long"),

        confirmNewPassword: z.string()
            .min(1, "Confirm password is required.")
            .min(8, "Confirm password must be at least 8 characters long"),
    });
    const validateForm = () => {
        const formData = { newPassword, confirmNewPassword };
        const result = formSchema.safeParse(formData);

        if (!result.success) {
            const newErrors = {};
            const fieldErrors = result.error.flatten().fieldErrors;

            Object.keys(fieldErrors).forEach(key => {
                if (fieldErrors[key] && fieldErrors[key].length > 0) {
                    newErrors[key] = fieldErrors[key][0];
                }
            });
            setErrors(newErrors);
            return false;
        }
        else setErrors({});
        return true;
    };
    const validateField = (name, value) => {
        const fieldSchema = formSchema.pick({ [name]: true });
        const result = fieldSchema.safeParse({ [name]: value });

        const fieldErrors = { ...errors };

        if (!result.success) {
            const fieldError = result.error.errors[0];
            if (fieldError) fieldErrors[name] = fieldError.message;
        }
        else delete fieldErrors[name];

        setErrors(fieldErrors);
    };

    const handleFormSubmission = async (e) => {
        e.preventDefault();

        if (!validateForm()) return toast.error("Please fill in all fields correctly.");

        setIsLoading(true);
        await resetUserPassword(token, newPassword, confirmNewPassword, setIsSuccess);
        setIsLoading(false);
    };

    useEffect(() => {
        if (!token) {
            toast.error("No token found.");
            navigateTo("/");
        }
    }, [token, navigateTo]);


    if (isSuccess) {
        return (
            <div className="animate-themeAnimationLg min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4 py-10 relative overflow-hidden">

                <div className="relative z-10 w-full max-w-md">

                    <div className="backdrop-blur-lg bg-white/80 border border-gray-200 rounded-3xl p-8 shadow-2xl text-center">

                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl mb-4">
                            <CheckCircle className="w-8 h-8 text-white" />
                        </div>

                        <h1 className="text-3xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                            Password Reset!
                        </h1>

                        <p className="text-gray-600 text-sm mb-6">
                            Your password has been successfully reset. You can now login with your new password.
                        </p>

                        <Link to="/login"
                            className="w-full inline-flex items-center justify-center bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
                        >
                            Continue to Login
                        </Link>
                    </div>

                </div>

                {/* ANIMATED BACKGROUND ELEMENTS */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-4 -left-4 w-72 h-72 bg-gray-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" />
                    <div className="absolute -bottom-8 -right-4 w-72 h-72 bg-gray-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000" />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gray-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500" />
                </div>

            </div>
        );
    }

    return (
        <div className="animate-themeAnimationLg min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4 py-10 relative overflow-hidden">

            {/* MAIN RESET PASSWORD CONTAINER */}
            <div className="relative z-10 w-full max-w-md">

                {/* GLASSMORPHISM CARD */}
                <div className="backdrop-blur-lg bg-white/80 border border-gray-200 rounded-3xl p-8 shadow-2xl">

                    {/* BACK BUTTON */}
                    <Link to="/"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 mb-3 text-sm">
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </Link>

                    {/* HEADER */}
                    <div className="text-center mb-4">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl mb-2">
                            <Lock className="w-8 h-8 text-white" />
                        </div>

                        <h1 className="text-3xl font-bold text-gray-900 mb-1 bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                            Reset Password
                        </h1>

                        <p className="text-gray-600 text-sm leading-relaxed">
                            Create a new password for your account
                        </p>
                    </div>

                    {/* RESET PASSWORD FORM */}
                    <form onSubmit={handleFormSubmission}
                        className="space-y-3">

                        <InputPassword required={true}
                            label="New Password"
                            name="newPassword"
                            value={newPassword}
                            errors={errors}
                            icon={<Lock className="h-5 w-5 text-gray-400" />}
                            placeholder="********"
                            onChange={(e) => setNewPassword(e.target.value)}
                            onBlur={(e) => validateField(e.target.name, e.target.value)}
                        />

                        <InputPassword required={true}
                            label="Confirm New Password"
                            name="confirmPassword"
                            value={confirmNewPassword}
                            errors={errors}
                            icon={<Lock className="h-5 w-5 text-gray-400" />}
                            placeholder="********"
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            onBlur={(e) => validateField(e.target.name, e.target.value)}
                        />


                        {/* RESET PASSWORD BUTTON */}
                        <div>
                            <ThemeButton
                                btnLabel="Reset Password"
                                isButtonLoading={isLoading}
                                loadingLabel="Resetting password..."
                                icon={<Lock className="w-5 h-5" />}
                                extraClasses="w-full mt-6"
                            />
                        </div>
                    </form>

                    {/* BACK TO LOGIN */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-600 text-sm">
                            Remember your password?{" "}
                            <Link to="/login"
                                className="text-gray-700 hover:text-gray-900 transition-colors duration-200 hover:underline font-medium">
                                Back to Login
                            </Link>
                        </p>
                    </div>

                </div>

            </div>

            {/* ANIMATED BACKGROUND ELEMENTS */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-4 -left-4 w-72 h-72 bg-gray-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" />
                <div className="absolute -bottom-8 -right-4 w-72 h-72 bg-gray-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gray-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500" />
            </div>

        </div>
    );
}