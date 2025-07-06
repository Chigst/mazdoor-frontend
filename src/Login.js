import React from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "./firebaseConfig";

function Login() {
  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      alert("Login successful!");
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Try again.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <button
        onClick={handleGoogleLogin}
        className="bg-blue-600 text-white px-6 py-3 rounded-md text-lg shadow"
      >
        Sign in with Google
      </button>
    </div>
  );
}

export default Login;
