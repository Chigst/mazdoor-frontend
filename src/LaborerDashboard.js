// src/LaborerDashboard.js

import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where, doc, updateDoc } from "firebase/firestore";
import { db, auth } from "./firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { toast } from "react-toastify";
import { formatDistanceToNow } from "date-fns";

const LaborerDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [laborerId, setLaborerId] = useState("");

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const q = query(collection(db, "laborers"), where("uid", "==", user.uid));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const laborerData = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
          setLaborerId(laborerData.id);

          await fetchRequests(laborerData.id);
        }
      }
    });
  }, []);

  const fetchRequests = async (laborerId) => {
    const hireQ = query(collection(db, "hireRequests"), where("laborerId", "==", laborerId));
    const hireSnap = await getDocs(hireQ);
    const hireData = hireSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timeAgo: doc.data().timestamp?.toDate
        ? formatDistanceToNow(doc.data().timestamp.toDate(), { addSuffix: true })
        : "Unknown time"
    }));
    setRequests(hireData);
  };

  const handleAction = async (id, status) => {
    try {
      await updateDoc(doc(db, "hireRequests", id), { status });
      toast.success(`✅ Request ${status}!`);
      await fetchRequests(laborerId);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("❌ Failed to update request.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-green-700 mb-4">Hire Requests</h2>

      {requests.length === 0 ? (
        <p>No hire requests yet.</p>
      ) : (
        <div className="grid gap-4">
          {requests.map((req) => (
            <div key={req.id} className="border p-4 rounded shadow">
              <p className="font-semibold">From: {req.contractorName}</p>
              <p className="text-sm text-gray-500">Sent {req.timeAgo}</p>
              <p>Status: <span className={`font-bold capitalize ${
                req.status === "accepted" ? "text-green-600" :
                req.status === "rejected" ? "text-red-600" : "text-yellow-600"
              }`}>{req.status}</span></p>

              {req.status === "pending" && (
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleAction(req.id, "accepted")}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleAction(req.id, "rejected")}
                    className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LaborerDashboard;
