// src/pages/SentRequests.js

import React, { useEffect, useState } from 'react';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const SentRequests = () => {
  const [requests, setRequests] = useState([]);
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const db = getFirestore();

  useEffect(() => {
    const fetchRequests = async () => {
      if (!currentUser) return;

      const q = query(
        collection(db, 'hireRequests'),
        where('contractorId', '==', currentUser.uid)
      );

      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRequests(data);
    };

    fetchRequests();
  }, [currentUser]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Hire Requests Sent</h2>
      {requests.map((req) => (
        <div key={req.id} className="p-4 mb-2 border rounded-lg shadow-sm flex justify-between items-center">
          <div>
            <p><strong>Laborer Name:</strong> {req.laborerName}</p>
            <p><strong>City:</strong> {req.city}</p>
            <p><strong>Skill:</strong> {req.skill}</p>
          </div>
          <span className={`px-2 py-1 rounded text-white ${
            req.status === 'Accepted' ? 'bg-green-500' :
            req.status === 'Rejected' ? 'bg-red-500' :
            'bg-yellow-500'
          }`}>
            {req.status}
          </span>
        </div>
      ))}
    </div>
  );
};

export default SentRequests;
