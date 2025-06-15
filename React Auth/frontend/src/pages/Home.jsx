import { useState, useEffect } from "react";
import { useAuthStore } from "../zustand/auth.store";
import { ChevronDown, Star, Zap, Shield, Users, ArrowRight, Menu, X } from "lucide-react";

export default function Home() {

    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const { logoutUser, deleteUserAccount } = useAuthStore();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const features = [
        {
            icon: <Zap className="w-8 h-8" />,
            title: "Lightning Fast",
            description: "Experience blazing fast performance with our optimized platform"
        },
        {
            icon: <Shield className="w-8 h-8" />,
            title: "Secure & Reliable",
            description: "Your data is protected with enterprise-grade security measures"
        },
        {
            icon: <Users className="w-8 h-8" />,
            title: "Team Collaboration",
            description: "Work seamlessly with your team using our collaborative tools"
        }
    ];

    const stats = [
        { number: "10M+", label: "Users Worldwide" },
        { number: "99.9%", label: "Uptime" },
        { number: "24/7", label: "Support" },
        { number: "150+", label: "Countries" }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
            {/* Navigation */}
            <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? "bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-lg" : "bg-transparent"
                }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"></div>
                            <span className="ml-2 text-xl font-bold text-gray-900">Brand</span>
                        </div>

                        <div className="hidden md:flex items-center space-x-8">
                            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
                            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
                            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">About</a>
                            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Contact</a>
                            <button onClick={deleteUserAccount} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300">
                                Delete Account
                            </button>
                            <button onClick={logoutUser} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300">
                                Logout
                            </button>
                        </div>

                        <button
                            className="md:hidden text-gray-900"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg">
                        <div className="px-4 py-6 space-y-4">
                            <a href="#" className="block text-gray-600 hover:text-gray-900 transition-colors">Features</a>
                            <a href="#" className="block text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
                            <a href="#" className="block text-gray-600 hover:text-gray-900 transition-colors">About</a>
                            <a href="#" className="block text-gray-600 hover:text-gray-900 transition-colors">Contact</a>
                            <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full">
                                Get Started
                            </button>
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-4 overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-200/40 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "4s" }}></div>
                </div>

                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full px-4 py-2 mb-8 shadow-sm">
                        <Star className="w-4 h-4 text-yellow-500 mr-2" />
                        <span className="text-sm text-gray-700">New features available now!</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                        Build the
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Future</span>
                        <br />Today
                    </h1>

                    <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                        Transform your ideas into reality with our cutting-edge platform.
                        Experience the power of innovation at your fingertips.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                        <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 flex items-center">
                            Start Free Trial
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </button>
                        <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 backdrop-blur-sm">
                            Watch Demo
                        </button>
                    </div>

                    <ChevronDown className="w-8 h-8 text-gray-400 mx-auto animate-bounce" />
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 px-4 bg-white/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center group hover:scale-105 transition-transform duration-300">
                                <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    {stat.number}
                                </div>
                                <div className="text-gray-600 font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Powerful Features
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Everything you need to succeed, built with modern technology and designed for scale
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="group relative">
                                <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-8 hover:bg-white hover:border-blue-300 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 shadow-sm">
                                    <div className="text-blue-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-3xl p-12 shadow-xl">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Ready to Get Started?
                        </h2>
                        <p className="text-xl text-gray-600 mb-8">
                            Join thousands of satisfied customers and transform your workflow today
                        </p>
                        <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-4 rounded-full text-lg font-semibold hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105">
                            Start Your Journey
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-gray-200 py-12 px-4 bg-white/50">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center mb-4 md:mb-0">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"></div>
                            <span className="ml-2 text-xl font-bold text-gray-900">Brand</span>
                        </div>
                        <div className="flex space-x-6 text-gray-600">
                            <a href="#" className="hover:text-gray-900 transition-colors">Privacy</a>
                            <a href="#" className="hover:text-gray-900 transition-colors">Terms</a>
                            <a href="#" className="hover:text-gray-900 transition-colors">Support</a>
                        </div>
                    </div>
                    <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
                        <p>&copy; 2025 Brand. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}