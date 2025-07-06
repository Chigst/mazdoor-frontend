import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { toast } from "react-toastify";


const ContractorDashboard = () => {
  const [laborers, setLaborers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filters, setFilters] = useState({ name: '', skill: '', city: '' });
  const [contractor, setContractor] = useState(null);
  const [hireRequests, setHireRequests] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const contractorQuery = query(collection(db, 'contractors'), where('uid', '==', user.uid));
        const snapshot = await getDocs(contractorQuery);
        if (!snapshot.empty) {
          const contractorData = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
          setContractor(contractorData);

          const hireQuery = query(collection(db, 'hireRequests'), where('contractorId', '==', contractorData.id));
          const hireSnap = await getDocs(hireQuery);
          const hireData = hireSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setHireRequests(hireData);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchLaborers = async () => {
      const q = query(collection(db, 'laborers'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLaborers(data);
      setFiltered(data);
    };
    fetchLaborers();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...filters, [name]: value.toLowerCase() };
    setFilters(updated);

    const filteredData = laborers.filter(laborer =>
      laborer.name?.toLowerCase().includes(updated.name) &&
      laborer.skill?.toLowerCase().includes(updated.skill) &&
      laborer.city?.toLowerCase().includes(updated.city)
    );
    setFiltered(filteredData);
  };

  const handleHire = async (laborer) => {
    if (!contractor) {
      alert("Contractor info not found.");
      return;
    }

    try {
      await addDoc(collection(db, 'hireRequests'), {
        contractorId: contractor.id,
        contractorName: contractor.name,
        laborerId: laborer.id,
        laborerName: laborer.name,
        status: 'pending',
        timestamp: serverTimestamp()
      });
      toast.success("✅ Hire request sent!");

      const hireQuery = query(collection(db, 'hireRequests'), where('contractorId', '==', contractor.id));
      const hireSnap = await getDocs(hireQuery);
      const hireData = hireSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setHireRequests(hireData);
    } catch (error) {
      console.error('Error sending hire request:', error);
      toast.error("❌ Failed to send request.");
    }
  };

  const getRequestStatus = (laborerId) => {
    const match = hireRequests.find(req => req.laborerId === laborerId);
    return match ? match.status : null;
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-blue-800 mb-4">Welcome Contractor</h2>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input type="text" name="name" placeholder="Search by name" className="border p-2 rounded" onChange={handleFilterChange} />
        <input type="text" name="skill" placeholder="Search by skill" className="border p-2 rounded" onChange={handleFilterChange} />
        <input type="text" name="city" placeholder="Search by city" className="border p-2 rounded" onChange={handleFilterChange} />
      </div>

      {/* Laborer Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((laborer) => {
          const status = getRequestStatus(laborer.id);

          return (
            <div
              key={laborer.id}
              className="bg-white shadow-md rounded-xl p-4 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-bold text-blue-800">{laborer.name}</h3>
                <p className="text-sm text-gray-700">🛠️ Skill: {laborer.skill}</p>
                <p className="text-sm text-gray-700">📍 City: {laborer.city}</p>
              </div>

              {/* Status Badge */}
              {status && (
                <span className={`text-xs px-2 py-1 rounded-full mt-2 w-max ${
                  status === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                  status === 'accepted' ? 'bg-green-200 text-green-800' :
                  'bg-red-200 text-red-800'
                }`}>
                  {status.toUpperCase()}
                </span>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 mt-3">
                <a href={`tel:${laborer.phone}`} className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">Call</a>
                <a href={`https://wa.me/${laborer.phone}`} target="_blank" rel="noreferrer" className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">WhatsApp</a>
                {!status && (
                  <button
                    onClick={() => handleHire(laborer)}
                    className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
                  >
                    Hire
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ContractorDashboard;
