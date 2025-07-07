// src/Login.js

import React, { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "./firebaseConfig";

function Login() {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("❌ Login failed:", error);
      alert("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-sm w-full border border-gray-200">
        <h1 className="text-3xl font-bold mb-6 text-blue-700">Mazdoor App</h1>
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className={`w-full px-6 py-3 rounded-md text-white text-lg font-medium transition ${
            loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Signing in..." : "Sign in with Google"}
        </button>
      </div>
    </div>
  );
}

export default Login;
