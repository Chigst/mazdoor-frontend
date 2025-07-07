// src/Landing.js

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FcBusinessman, FcEngineering } from "react-icons/fc";
import { auth, provider } from "./firebaseConfig";
import { signInWithPopup } from "firebase/auth";

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
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-white text-center px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-4xl font-bold text-blue-800 mb-4">Mazdoor App</h1>
      <p className="text-gray-700 max-w-lg mb-6">
        A simple platform connecting contractors and daily laborers across India.
        Easily find skilled workers or job opportunities near you.
      </p>

      <div className="flex gap-6 mb-8">
        <div className="flex flex-col items-center">
          <FcBusinessman size={48} />
          <span className="text-sm mt-2">For Contractors</span>
        </div>
        <div className="flex flex-col items-center">
          <FcEngineering size={48} />
          <span className="text-sm mt-2">For Laborers</span>
        </div>
      </div>

      <button
        onClick={handleLogin}
        disabled={loading}
        className={`px-6 py-3 rounded-full text-lg text-white transition ${
          loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Signing in..." : "Get Started with Google"}
      </button>

      <footer className="mt-10 text-sm text-gray-500">© 2025 Mazdoor App</footer>
    </motion.div>
  );
};

export default Landing;
