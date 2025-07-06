import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "./firebaseConfig";

const Navbar = ({ user, role }) => {
  const handleLogout = () => {
    signOut(auth);
    window.location.reload();
  };

  return (
    <div className="sticky top-0 bg-white shadow-md px-4 py-3 flex justify-between items-center z-50">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Mazdoor</h1>
      </div>
      <div className="text-sm text-gray-600">
        {role && <span className="mr-4">Role: <strong>{role}</strong></span>}
        {user?.email && <span className="mr-4">Logged in as: {user.email}</span>}
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded-md"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
