import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Check, X, ArrowLeft } from 'lucide-react';

export default function ResetPassword() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errors, setErrors] = useState({});

    // Password validation
    const passwordsMatch = newPassword && confirmPassword && newPassword === confirmPassword;
    const passwordHasMinLength = newPassword.length >= 8;
    const passwordHasUppercase = /[A-Z]/.test(newPassword);
    const passwordHasLowercase = /[a-z]/.test(newPassword);
    const passwordHasNumber = /\d/.test(newPassword);

    const isPasswordValid = passwordHasMinLength && passwordHasUppercase && passwordHasLowercase && passwordHasNumber;
    const isFormValid = isPasswordValid && passwordsMatch;

    const validatePasswords = () => {
        const newErrors = {};

        if (!newPassword) {
            newErrors.newPassword = 'New password is required';
        } else if (!isPasswordValid) {
            newErrors.newPassword = 'Password must meet all requirements';
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (!passwordsMatch) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validatePasswords()) return;

        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setIsSuccess(true);
        }, 2000);
    };

    const PasswordInput = ({ label, value, onChange, show, toggleShow, name, placeholder }) => (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
                {label} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type={show ? "text" : "password"}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`block w-full pl-10 pr-12 py-3 border-2 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200 ${errors[name]
                        ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 bg-white hover:border-gray-400'
                        }`}
                />
                <button
                    type="button"
                    onClick={toggleShow}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                    {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
            </div>
            {errors[name] && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                    <X className="w-4 h-4" />
                    {errors[name]}
                </p>
            )}
        </div>
    );

    const PasswordRequirement = ({ met, text }) => (
        <div className={`flex items-center gap-2 text-sm transition-colors duration-200 ${met ? 'text-green-600' : 'text-gray-500'
            }`}>
            {met ? (
                <Check className="w-4 h-4 text-green-600" />
            ) : (
                <X className="w-4 h-4 text-gray-400" />
            )}
            <span>{text}</span>
        </div>
    );

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
                            Password Reset!
                        </h1>

                        <p className="text-gray-600 text-sm mb-6">
                            Your password has been successfully reset. You can now login with your new password.
                        </p>

                        <button
                            onClick={() => alert('Navigate to login!')}
                            className="w-full inline-flex items-center justify-center bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
                        >
                            Continue to Login
                        </button>
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

            {/* MAIN RESET PASSWORD CONTAINER */}
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
                            <Lock className="w-8 h-8 text-white" />
                        </div>

                        <h1 className="text-3xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                            Reset Password
                        </h1>

                        <p className="text-gray-600 text-sm leading-relaxed">
                            Create a new password for your account
                        </p>
                    </div>

                    {/* RESET PASSWORD FORM */}
                    <div className="space-y-6">

                        {/* NEW PASSWORD */}
                        <PasswordInput
                            label="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            show={showPassword}
                            toggleShow={() => setShowPassword(!showPassword)}
                            name="newPassword"
                            placeholder="Enter new password"
                        />

                        {/* PASSWORD REQUIREMENTS */}
                        {newPassword && (
                            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                                <h4 className="text-sm font-medium text-gray-700 mb-3">Password Requirements:</h4>
                                <PasswordRequirement met={passwordHasMinLength} text="At least 8 characters" />
                                <PasswordRequirement met={passwordHasUppercase} text="One uppercase letter" />
                                <PasswordRequirement met={passwordHasLowercase} text="One lowercase letter" />
                                <PasswordRequirement met={passwordHasNumber} text="One number" />
                            </div>
                        )}

                        {/* CONFIRM PASSWORD */}
                        <PasswordInput
                            label="Confirm New Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            show={showConfirmPassword}
                            toggleShow={() => setShowConfirmPassword(!showConfirmPassword)}
                            name="confirmPassword"
                            placeholder="Confirm new password"
                        />

                        {/* PASSWORD MATCH INDICATOR */}
                        {confirmPassword && (
                            <div className={`flex items-center gap-2 text-sm transition-colors duration-200 ${passwordsMatch ? 'text-green-600' : 'text-red-500'
                                }`}>
                                {passwordsMatch ? (
                                    <Check className="w-4 h-4" />
                                ) : (
                                    <X className="w-4 h-4" />
                                )}
                                <span>
                                    {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
                                </span>
                            </div>
                        )}

                        {/* RESET PASSWORD BUTTON */}
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading || !isFormValid}
                            className="w-full bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-700 opacity-0 group-hover:opacity-20 transition-opacity duration-200"></div>
                            {isLoading ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Resetting password...</span>
                                </div>
                            ) : (
                                'Reset Password'
                            )}
                        </button>
                    </div>

                    {/* BACK TO LOGIN */}
                    <div className="mt-8 text-center">
                        <p className="text-gray-600 text-sm">
                            Remember your password?{' '}
                            <button onClick={() => alert('Navigate to login!')} className="text-gray-700 hover:text-gray-900 transition-colors duration-200 hover:underline font-medium">
                                Back to Login
                            </button>
                        </p>
                    </div>

                </div>

            </div>

        </div>
    );
}