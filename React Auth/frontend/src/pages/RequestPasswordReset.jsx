import React, { useState } from "react";
import { Mail, ArrowLeft, Info, CheckCircle } from "lucide-react";
import { useAuthStore } from "../zustand/auth.store";
import { Link } from "react-router-dom";
import { ThemeButton } from "../components/Buttons";
import { Input } from "../components/Inputs";
import { z } from "zod";
import toast from "react-hot-toast";

export default function RequestPasswordReset() {

    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errors, setErrors] = useState({});

    const { sendResetPassLink } = useAuthStore();

    const formSchema = z.object({

        email: z.string()
            .min(1, "Email is required.")
            .email("Invalid email address"),
    });
    const validateForm = () => {
        const formData = { email };
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
        await sendResetPassLink(email, setIsSuccess);
        setIsLoading(false);
    };

    if (isSuccess) {
        return (
            <div className="animate-themeAnimationLg min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4 py-10 relative overflow-hidden">

                <div className="relative z-10 w-full max-w-md">
                    <div className="backdrop-blur-lg bg-white/80 border border-gray-200 rounded-3xl p-8 shadow-2xl text-center">

                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl mb-4">
                            <CheckCircle className="w-8 h-8 text-white" />
                        </div>

                        <h1 className="text-3xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                            Check Your Email
                        </h1>

                        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                            We"ve sent a password reset link to <br />
                            <strong className="text-gray-800">{email}</strong> <br />
                            Please check your email and follow the instructions to reset your password.
                        </p>

                        <div className="text-gray-600 text-sm my-6 bg-gray-100 pl-3 pr-5 py-3 rounded-lg flex gap-2.5 mx-4 border-l-4 border-gray-500 text-left">
                            <Info /> Don’t forget to check your spam or junk folder in case our email ended up there!
                        </div>

                        <Link to="/login"
                            className="w-full inline-flex items-center justify-center bg-transparent hover:bg-gray-50 text-gray-700 hover:text-gray-900 font-medium py-4 px-6 rounded-2xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-200">
                            Back to Login
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

            {/* MAIN REQUEST PASSWORD CONTAINER */}
            <div className="relative z-10 w-full max-w-md">

                <form onSubmit={handleFormSubmission}
                    className="backdrop-blur-lg bg-white/80 border border-gray-200 rounded-3xl p-8 shadow-2xl">

                    {/* BACK BUTTON */}
                    <Link to="/login"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 mb-3 text-sm">
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </Link>

                    {/* HEADER */}
                    <div className="text-center mb-2">

                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl mb-3">
                            <Mail className="w-8 h-8 text-white" />
                        </div>

                        <h1 className="text-3xl font-bold text-gray-900 mb-1 bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                            Forgot Password?
                        </h1>

                        <p className="text-gray-600 text-sm leading-relaxed">
                            No worries! Enter your email address and we"ll send you a link to reset your password.
                        </p>
                    </div>

                    {/* REQUEST PASSWORD FORM */}
                    <Input required={true}
                        type="email"
                        name="email"
                        label="Email"
                        value={email}
                        errors={errors}
                        placeholder="you@example.com"
                        onChange={(e) => setEmail(e.target.value)}
                        icon={<Mail className="h-5 w-5 text-gray-400" />}
                        onBlur={(e) => validateField(e.target.name, e.target.value)}
                    />

                    {/* ADDITIONAL INFO */}
                    <div className="text-gray-600 text-sm my-6 bg-gray-100 pl-3 pr-5 py-3 rounded-lg flex gap-2.5 mx-4 border-l-4 border-gray-500">
                        <Info /> Don’t forget to check your spam or junk folder in case our email ended up there!
                    </div>

                    <ThemeButton
                        isButtonLoading={isLoading}
                        className="w-full"
                        btnLabel="Send Reset Link"
                        loadingLabel="Sending Email..."
                        icon={<Mail className="w-5 h-5" />}
                    />

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

                </form>

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