// src/HireRequestsPage.js
import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from './firebaseConfig';

const HireRequestsPage = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchHireRequests = async () => {
      const q = query(collection(db, 'hireRequests'), orderBy('timestamp', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRequests(data);
    };
    fetchHireRequests();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">📋 Hire Requests</h2>
      {requests.length === 0 ? (
        <p>No hire requests found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {requests.map((req) => (
            <div key={req.id} className="border p-4 rounded shadow bg-white">
              <p><strong>Laborer:</strong> {req.laborerName}</p>
              <p><strong>Contractor:</strong> {req.contractorName}</p>
              <p><strong>Status:</strong> {req.status}</p>
              <p className="text-sm text-gray-500">{new Date(req.timestamp?.seconds * 1000).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HireRequestsPage;
