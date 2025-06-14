import React, { useState } from 'react';
import { Mail, ArrowLeft, Check, X } from 'lucide-react';

export default function RequestPasswordReset() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errors, setErrors] = useState({});

    // Email validation
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateEmail = () => {
        const newErrors = {};

        if (!email) {
            newErrors.email = 'Email address is required';
        } else if (!isValidEmail(email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateEmail()) return;

        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setIsSuccess(true);
        }, 2000);
    };

    if (isSuccess) {
        return (
            <div className="animate-themeAnimationLg min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4 py-10 relative overflow-hidden">

                {/* ANIMATED BACKGROUND ELEMENTS */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-4 -left-4 w-72 h-72 bg-gray-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
                    <div className="absolute -bottom-8 -right-4 w-72 h-72 bg-gray-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gray-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
                </div>

                <div className="relative z-10 w-full max-w-md">
                    <div className="backdrop-blur-lg bg-white/80 border border-gray-200 rounded-3xl p-8 shadow-2xl text-center">

                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl mb-4">
                            <Check className="w-8 h-8 text-white" />
                        </div>

                        <h1 className="text-3xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                            Check Your Email
                        </h1>

                        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                            We've sent a password reset link to <strong className="text-gray-800">{email}</strong>.
                            Please check your email and follow the instructions to reset your password.
                        </p>

                        <div className="bg-gray-50 rounded-xl p-4 mb-6">
                            <p className="text-gray-600 text-xs leading-relaxed">
                                Didn't receive the email? Check your spam folder or wait a few minutes before requesting another reset.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={() => setIsSuccess(false)}
                                className="w-full inline-flex items-center justify-center bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
                            >
                                Send Another Email
                            </button>

                            <button
                                onClick={() => alert('Navigate to login!')}
                                className="w-full inline-flex items-center justify-center bg-transparent hover:bg-gray-50 text-gray-700 hover:text-gray-900 font-medium py-4 px-6 rounded-2xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-200"
                            >
                                Back to Login
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-themeAnimationLg min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4 py-10 relative overflow-hidden">

            {/* ANIMATED BACKGROUND ELEMENTS */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-4 -left-4 w-72 h-72 bg-gray-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
                <div className="absolute -bottom-8 -right-4 w-72 h-72 bg-gray-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gray-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
            </div>

            {/* MAIN REQUEST PASSWORD CONTAINER */}
            <div className="relative z-10 w-full max-w-md">

                {/* GLASSMORPHISM CARD */}
                <div className="backdrop-blur-lg bg-white/80 border border-gray-200 rounded-3xl p-8 shadow-2xl">

                    {/* BACK BUTTON */}
                    <button
                        onClick={() => alert('Navigate back!')}
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 mb-6 text-sm"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </button>

                    {/* HEADER */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl mb-4">
                            <Mail className="w-8 h-8 text-white" />
                        </div>

                        <h1 className="text-3xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                            Forgot Password?
                        </h1>

                        <p className="text-gray-600 text-sm leading-relaxed">
                            No worries! Enter your email address and we'll send you a link to reset your password.
                        </p>
                    </div>

                    {/* REQUEST PASSWORD FORM */}
                    <div className="space-y-6">

                        {/* EMAIL INPUT */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Email Address <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email address"
                                    className={`block w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200 ${errors.email
                                        ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500'
                                        : 'border-gray-300 bg-white hover:border-gray-400'
                                        }`}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-red-500 text-sm flex items-center gap-1">
                                    <X className="w-4 h-4" />
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* SEND RESET LINK BUTTON */}
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading || !email}
                            className="w-full bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-700 opacity-0 group-hover:opacity-20 transition-opacity duration-200"></div>
                            {isLoading ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Sending reset link...</span>
                                </div>
                            ) : (
                                'Send Reset Link'
                            )}
                        </button>
                    </div>

                    {/* ADDITIONAL INFO */}
                    <div className="mt-6 bg-gray-50 rounded-xl p-4">
                        <p className="text-gray-600 text-xs leading-relaxed text-center">
                            <strong>Tip:</strong> Make sure to check your spam folder if you don't see the email in your inbox within a few minutes.
                        </p>
                    </div>

                    {/* BACK TO LOGIN */}
                    <div className="mt-8 text-center">
                        <p className="text-gray-600 text-sm">
                            Remember your password?{' '}
                            <button
                                onClick={() => alert('Navigate to login!')}
                                className="text-gray-700 hover:text-gray-900 transition-colors duration-200 hover:underline font-medium"
                            >
                                Back to Login
                            </button>
                        </p>
                    </div>

                </div>

            </div>

        </div>
    );
}