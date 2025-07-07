// src/LaborerDashboard.js

import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db, auth } from "./firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { toast } from "react-toastify";
import { formatDistanceToNow } from "date-fns";

const LaborerDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [laborerId, setLaborerId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const q = query(
          collection(db, "laborers"),
          where("uid", "==", user.uid)
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const laborerData = {
            id: snapshot.docs[0].id,
            ...snapshot.docs[0].data(),
          };
          setLaborerId(laborerData.id);
          await fetchRequests(laborerData.id);
        } else {
          toast.error("Laborer profile not found.");
        }
      }
    });
  }, []);

  const fetchRequests = async (laborerId) => {
    try {
      setLoading(true);
      const hireQ = query(
        collection(db, "hireRequests"),
        where("laborerId", "==", laborerId)
      );
      const hireSnap = await getDocs(hireQ);
      const hireData = hireSnap.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          timeAgo: data.timestamp?.toDate
            ? formatDistanceToNow(data.timestamp.toDate(), { addSuffix: true })
            : "Unknown time",
        };
      });

      setRequests(hireData);
      if (hireData.length === 0) toast.info("No hire requests yet.");
    } catch (err) {
      console.error("Failed to fetch requests", err);
      toast.error("Error loading requests.");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, status) => {
    try {
      await updateDoc(doc(db, "hireRequests", id), { status });
      toast.success(`Request ${status}`);
      await fetchRequests(laborerId);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update request.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-green-700 mb-4">
        Hire Requests
      </h2>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : requests.length === 0 ? (
        <p className="text-gray-600">No hire requests available.</p>
      ) : (
        <div className="grid gap-4">
          {requests.map((req) => (
            <div
              key={req.id}
              className="border border-gray-200 rounded-lg shadow-sm p-4 bg-white"
            >
              <p className="text-lg font-semibold text-blue-800">
                From: {req.contractorName}
              </p>
              <p className="text-sm text-gray-500 mb-2">
                Sent {req.timeAgo}
              </p>
              <div className="mb-2">
                Status:{" "}
                <span
                  className={`font-bold text-sm px-2 py-1 rounded ${
                    req.status === "pending"
                      ? "bg-yellow-200 text-yellow-800"
                      : req.status === "accepted"
                      ? "bg-green-200 text-green-800"
                      : "bg-red-200 text-red-800"
                  }`}
                >
                  {req.status}
                </span>
              </div>

              {req.status === "pending" && (
                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() => handleAction(req.id, "accepted")}
                    className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleAction(req.id, "rejected")}
                    className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
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
