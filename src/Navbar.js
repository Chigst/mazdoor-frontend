// src/Navbar.js

import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "./firebaseConfig";

const Navbar = ({ user, role, onLogout }) => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      if (onLogout) onLogout();
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed. Try again.");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm px-4 py-3 flex flex-col md:flex-row md:justify-between md:items-center">
      <h1 className="text-2xl font-bold text-blue-700">Mazdoor</h1>

      <div className="mt-2 md:mt-0 flex flex-col md:flex-row items-start md:items-center text-sm text-gray-700 gap-2">
        {role && (
          <span className="md:mr-4">
            Role: <strong className="capitalize">{role}</strong>
          </span>
        )}
        {user?.email && (
          <span className="md:mr-4">Logged in as: {user.email}</span>
        )}
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded text-sm"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
