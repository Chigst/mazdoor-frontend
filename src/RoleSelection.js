// src/RoleSelection.js
import React, { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

function RoleSelection({ user }) {
  const [selectedRole, setSelectedRole] = useState("");

  const handleRole = async () => {
    if (!selectedRole) {
      alert("Please select a role");
      return;
    }

    try {
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        role: selectedRole,
      });
      window.location.reload();
    } catch (error) {
      console.error("Error saving role:", error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Select Your Role</h1>
      <select
        value={selectedRole}
        onChange={(e) => setSelectedRole(e.target.value)}
        className="mb-4 p-3 rounded border w-64"
      >
        <option value="">-- Choose Role --</option>
        <option value="contractor">Contractor</option>
        <option value="laborer">Laborer</option>
      </select>
      <button
        onClick={handleRole}
        className="bg-blue-600 text-white px-6 py-2 rounded"
      >
        Continue
      </button>
    </div>
  );
}

export default RoleSelection;
