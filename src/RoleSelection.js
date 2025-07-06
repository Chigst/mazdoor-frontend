import React, { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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
        await setDoc(doc(db, "laborers", user.uid), {
          uid: user.uid,
          name: formData.name,
          city: formData.city,
          skill: formData.skill,
          phone: formData.phone
        }, { merge: true });
      } else {
        await setDoc(doc(db, "contractors", user.uid), {
          uid: user.uid,
          name: formData.name,
          city: formData.city,
          company: formData.company
        }, { merge: true });
      }

      toast.success("✅ Profile saved. Redirecting to dashboard...");
      navigate("/");
    } catch (error) {
      console.error("Error saving role:", error);
      toast.error("❌ Failed to save profile.");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Select Your Role</h2>

      <div className="space-y-4">
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="">Choose role</option>
          <option value="laborer">Laborer</option>
          <option value="contractor">Contractor</option>
        </select>

        <input
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full border p-2 rounded"
        />

        <input
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          className="w-full border p-2 rounded"
        />

        {role === "laborer" && (
          <>
            <input
              name="skill"
              placeholder="Skill"
              value={formData.skill}
              onChange={(e) => setFormData({ ...formData, skill: e.target.value })}
              className="w-full border p-2 rounded"
            />
            <input
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full border p-2 rounded"
            />
          </>
        )}

        {role === "contractor" && (
          <input
            name="company"
            placeholder="Company Name"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            className="w-full border p-2 rounded"
          />
        )}

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default RoleSelection;
