// src/pages/SentRequests.js

import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

const SentRequests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchSentRequests = async () => {
      onAuthStateChanged(auth, async (user) => {
        if (!user) return;

        // Get contractor doc ID first
        const contractorQuery = query(
          collection(db, "contractors"),
          where("uid", "==", user.uid)
        );
        const contractorSnap = await getDocs(contractorQuery);
        if (contractorSnap.empty) return;

        const contractorId = contractorSnap.docs[0].id;

        // Get hireRequests using contractorId
        const hireQuery = query(
          collection(db, "hireRequests"),
          where("contractorId", "==", contractorId)
        );
        const hireSnap = await getDocs(hireQuery);
        const hireData = hireSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setRequests(hireData);
      });
    };

    fetchSentRequests();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold text-blue-700 mb-4">Hire Requests Sent</h2>

      {requests.length === 0 ? (
        <p>No hire requests sent.</p>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req.id}
              className="p-4 border rounded-lg shadow-sm flex justify-between items-center bg-white"
            >
              <div>
                <p>
                  <strong>Laborer:</strong> {req.laborerName}
                </p>
              </div>
              <span
                className={`px-2 py-1 rounded text-xs font-semibold ${
                  req.status === "accepted"
                    ? "bg-green-100 text-green-700"
                    : req.status === "rejected"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {req.status?.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SentRequests;
