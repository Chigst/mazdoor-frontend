// src/pages/EditProfile.js

import React, { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const EditProfile = () => {
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    skill: "",
    company: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);

        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setRole(userData.role);

          const roleDoc = await getDoc(
            doc(db, userData.role === "laborer" ? "laborers" : "contractors", user.uid)
          );

          if (roleDoc.exists()) {
            const data = roleDoc.data();
            setFormData({
              name: data.name || "",
              city: data.city || "",
              skill: data.skill || "",
              company: data.company || "",
            });
          }
        }
      }
    });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!userId || !role) return;

    const ref = doc(db, role === "laborer" ? "laborers" : "contractors", userId);

    await setDoc(ref, { ...formData, uid: userId }, { merge: true });

    toast.success("✅ Profile updated!");
    navigate("/");
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">Edit Profile</h2>

      <div className="space-y-4">
        <input
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        {role === "laborer" && (
          <input
            name="skill"
            placeholder="Skill"
            value={formData.skill}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        )}

        {role === "contractor" && (
          <input
            name="company"
            placeholder="Company Name"
            value={formData.company}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        )}

        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default EditProfile;
