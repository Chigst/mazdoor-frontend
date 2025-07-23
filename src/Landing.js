import React, { useState } from "react";
import { motion } from "framer-motion";
import { FcBusinessman, FcEngineering } from "react-icons/fc";
import { Smartphone, MessageCircle, Users, Shield } from "lucide-react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "./firebaseConfig";
import heroImage from "./assets/hero-image.jpg";

const Landing = () => {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      alert("❌ Login Failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-white text-gray-800"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white pt-20 pb-32">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
            India’s Trusted <br />
            <span className="text-blue-600">Labor Connection</span> App
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Find skilled labor near your site — quick, simple, verified.
            Connect contractors with reliable laborers across India.
          </p>

          <button
            onClick={handleLogin}
            disabled={loading}
            className={`px-8 py-4 text-lg rounded-full font-medium text-white transition ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Signing in..." : "Get Started with Google"}
          </button>
        </div>

        <div className="mt-16 container mx-auto px-4 max-w-4xl">
          <img
            src={heroImage}
            alt="Construction collaboration"
            className="w-full rounded-xl shadow-xl"
          />
        </div>
      </section>

      {/* Role Selection */}
      <section className="py-20 bg-gray-50">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Choose Your Role</h2>
        </div>
        <div className="flex justify-center gap-10">
          <div className="flex flex-col items-center">
            <FcBusinessman size={56} />
            <span className="mt-2 text-md font-medium text-gray-700">For Contractors</span>
          </div>
          <div className="flex flex-col items-center">
            <FcEngineering size={56} />
            <span className="mt-2 text-md font-medium text-gray-700">For Laborers</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-white">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">Simple. Fast. Reliable.</h2>
          <p className="text-gray-600 mt-4">
            Connect with skilled professionals in just 3 taps. Built for India’s labor market.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto px-4">
          {[{
            icon: Smartphone,
            title: "Mobile First",
            text: "Designed for on-the-go professionals across India"
          }, {
            icon: MessageCircle,
            title: "Instant Connect",
            text: "WhatsApp and call integration for fast communication"
          }, {
            icon: Users,
            title: "Verified Profiles",
            text: "Trusted network of skilled laborers and contractors"
          }, {
            icon: Shield,
            title: "Secure Platform",
            text: "Secure platform with verified identity checks"
          }].map(({ icon: Icon, title, text }, idx) => (
            <div key={idx} className="text-center p-6 border rounded-lg shadow-sm bg-gray-50">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <Icon className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg">{title}</h3>
              <p className="text-gray-600 mt-2 text-sm">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gray-100 text-center">
        <div className="max-w-2xl mx-auto px-4 space-y-6">
          <h2 className="text-3xl font-bold">Ready to get started?</h2>
          <p className="text-gray-600">
            Join thousands of contractors and laborers already using Mazdoor.
          </p>
          <button
            onClick={handleLogin}
            disabled={loading}
            className={`px-8 py-4 text-lg rounded-full font-medium text-white transition ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Signing in..." : "Start Connecting Today"}
          </button>
        </div>
      </section>

      <footer className="text-center text-sm text-gray-400 py-6">
        © 2025 Mazdoor App
      </footer>
    </motion.div>
  );
};

export default Landing;
