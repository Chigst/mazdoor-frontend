// src/Landing.js

import React from "react";
import { motion } from "framer-motion";
import { FcBusinessman, FcEngineering } from "react-icons/fc";
import { auth } from "./firebaseConfig";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const Landing = () => {
  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      alert("Login Failed. Try Again.");
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

      <div className="flex gap-4 mb-8">
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
        className="bg-blue-600 text-white px-6 py-3 rounded-full text-lg hover:bg-blue-700 transition"
      >
        Get Started with Google
      </button>

      <footer className="mt-10 text-sm text-gray-500">© 2025 Mazdoor App</footer>
    </motion.div>
  );
};

export default Landing;
