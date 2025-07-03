import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LaborerCard from './components/LaborerCard';

function App() {
  const [laborers, setLaborers] = useState([]);
  const [city, setCity] = useState('');
  const [skill, setSkill] = useState('');

  useEffect(() => {
  fetchLaborers();
}, []);

const fetchLaborers = async () => {
  try {
    const params = {};
    if (city) params.city = city;
    if (skill) params.skill = skill;
    const res = await axios.get('https://workforceconnect.chaychowdhary.repl.co/laborers', { params });
    setLaborers(res.data);
  } catch (err) {
    console.error('Error fetching laborers', err);
  }
};

  return (
    <div style={{ padding: 20 }}>
      <h1>Mazdoor App</h1>
      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="Filter by city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          style={{ marginRight: 10 }}
        />
        <input
          placeholder="Filter by skill"
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          style={{ marginRight: 10 }}
        />
        <button onClick={fetchLaborers}>Search</button>
      </div>

      <div>
        {laborers.map((lab) => (
          <LaborerCard key={lab.id} laborer={lab} />
        ))}
      </div>
    </div>
  );
}

export default App;
