// src/components/RoleSelection.js

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { Briefcase, HardHat } from "lucide-react";
import { db, auth } from "./firebaseConfig";

const RoleSelection = ({ user }) => {
  const [role, setRole] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    skill: "",
    phone: "",
    company: ""
  });

  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!role || !formData.name || !formData.city) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (role === "laborer" && (!formData.skill || !formData.phone)) {
      toast.error("Laborers must enter skill and phone number.");
      return;
    }

    try {
      await setDoc(doc(db, "users", user.uid), { role }, { merge: true });

      if (role === "laborer") {
        await setDoc(
          doc(db, "laborers", user.uid),
          {
            uid: user.uid,
            name: formData.name,
            city: formData.city,
            skill: formData.skill,
            phone: formData.phone,
            availability: true
          },
          { merge: true }
        );
      } else {
        await setDoc(
          doc(db, "contractors", user.uid),
          {
            uid: user.uid,
            name: formData.name,
            city: formData.city,
            company: formData.company
          },
          { merge: true }
        );
      }

      toast.success("✅ Profile saved. Redirecting to dashboard...");
      navigate("/");
    } catch (error) {
      console.error("Error saving role:", error);
      toast.error("❌ Failed to save profile.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Welcome to Mazdoor</h1>
          <p className="text-muted-foreground">We're almost there. Tell us who you are.</p>
        </div>

        <div className="space-y-4">
          <div
            onClick={() => setRole("contractor")}
            className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
              role === "contractor" ? "border-blue-600 shadow-md" : "border-gray-200 hover:border-blue-400"
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Briefcase className="text-blue-600 w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">I'm a Contractor</h3>
                <p className="text-sm text-gray-500">I need to hire skilled laborers for my projects</p>
              </div>
            </div>
          </div>

          <div
            onClick={() => setRole("laborer")}
            className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
              role === "laborer" ? "border-blue-600 shadow-md" : "border-gray-200 hover:border-blue-400"
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <HardHat className="text-blue-600 w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">I'm a Laborer</h3>
                <p className="text-sm text-gray-500">I'm looking for daily work opportunities</p>
              </div>
            </div>
          </div>

          <input
            type="text"
            placeholder="Your Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full border rounded px-4 py-2"
          />

          <input
            type="text"
            placeholder="City"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="w-full border rounded px-4 py-2"
          />

          {role === "laborer" && (
            <>
              <input
                type="text"
                placeholder="Skill"
                value={formData.skill}
                onChange={(e) => setFormData({ ...formData, skill: e.target.value })}
                className="w-full border rounded px-4 py-2"
              />

              <input
                type="text"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full border rounded px-4 py-2"
              />
            </>
          )}

          {role === "contractor" && (
            <input
              type="text"
              placeholder="Company Name"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full border rounded px-4 py-2"
            />
          )}

          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
