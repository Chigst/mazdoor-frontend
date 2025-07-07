// src/HireRequests.js

import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "./firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { formatDistanceToNow } from "date-fns";

const HireRequests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      onAuthStateChanged(auth, async (user) => {
        if (!user) return;

        // Get contractor ID from 'contractors' collection
        const contractorQuery = query(
          collection(db, "contractors"),
          where("uid", "==", user.uid)
        );
        const contractorSnap = await getDocs(contractorQuery);

        if (contractorSnap.empty) return;

        const contractorId = contractorSnap.docs[0].id;

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

    fetchRequests();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-purple-700 mb-4">Your Hire Requests</h2>

      {requests.length === 0 ? (
        <p>No hire requests found.</p>
      ) : (
        <div className="grid gap-4">
          {requests.map((req) => (
            <div key={req.id} className="border p-4 rounded shadow bg-white">
              <p className="font-semibold">Laborer: {req.laborerName}</p>
              <p className="text-sm text-gray-500">
                Sent:{" "}
                {req.timestamp?.toDate
                  ? formatDistanceToNow(req.timestamp.toDate(), { addSuffix: true })
                  : "Unknown time"}
              </p>
              <p>
                Status:{" "}
                <span
                  className={`font-bold capitalize ${
                    req.status === "accepted"
                      ? "text-green-600"
                      : req.status === "rejected"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {req.status}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HireRequests;
