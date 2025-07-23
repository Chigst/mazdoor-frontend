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

  const fetchRequests = async (id) => {
    try {
      setLoading(true);
      const q = query(collection(db, "hireRequests"), where("laborerId", "==", id));
      const snap = await getDocs(q);
      const data = snap.docs.map((doc) => {
        const d = doc.data();
        return {
          id: doc.id,
          ...d,
          timeAgo: d.timestamp?.toDate
            ? formatDistanceToNow(d.timestamp.toDate(), { addSuffix: true })
            : "Unknown time",
        };
      });
      setRequests(data);
      if (data.length === 0) toast.info("No job requests yet.");
    } catch (err) {
      console.error("Fetch error:", err);
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
    } catch (err) {
      console.error("Status update failed:", err);
      toast.error("Failed to update request.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="flex justify-between items-center border-b pb-4 mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Mazdoor</h1>
        <button
          onClick={() => auth.signOut()}
          className="text-sm text-gray-600 hover:underline"
        >
          Logout
        </button>
      </header>

      <div className="max-w-3xl mx-auto">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Your Job Requests</h2>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : requests.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No job requests yet. Your profile is ready for work!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {requests.map((req) => (
              <div
                key={req.id}
                className={`rounded-xl border border-gray-200 p-5 shadow-sm bg-white ${
                  req.status !== "pending" ? "opacity-70" : ""
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <p className="text-lg font-medium text-gray-900">{req.contractorName}</p>
                    <p className="text-sm text-gray-500">{req.contractorCompany || req.jobLocation}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      req.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : req.status === "accepted"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {req.status}
                  </span>
                </div>

                <div className="text-sm text-gray-600 space-y-1 mb-3">
                  <p>
                    <strong>Start:</strong>{" "}
                    {req.startDate
                      ? new Date(req.startDate).toLocaleDateString()
                      : "N/A"}
                  </p>
                  {req.pay && (
                    <p>
                      <strong>Pay:</strong> {req.pay}
                    </p>
                  )}
                  <p>
                    <strong>Time:</strong> {req.timeAgo}
                  </p>
                </div>

                {req.jobDescription && (
                  <p className="text-gray-700 text-sm bg-gray-100 rounded p-3 mb-3">
                    {req.jobDescription}
                  </p>
                )}

                {req.status === "pending" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAction(req.id, "accepted")}
                      className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleAction(req.id, "rejected")}
                      className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
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
    </div>
  );
};

export default LaborerDashboard;
