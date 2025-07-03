import React, { useState } from 'react';
import axios from 'axios';

function LaborerCard({ laborer }) {
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const sendHire = async () => {
    try {
      await axios.post('https://workforceconnect--chaychowdhary.repl.co/hires', {
        laborerId: laborer.id,
        contractorId: 'contractor@example.com',
        message,
        timestamp: new Date().toISOString()
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Error sending hire request', err);
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', marginBottom: 10, padding: 10 }}>
      <h3>{laborer.name}</h3>
      <p>City: {laborer.location}</p>
      <p>Skills: {laborer.skills.join(', ')}</p>

      {!submitted ? (
        <>
          <input
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{ marginRight: 10 }}
          />
          <button onClick={sendHire}>Send Hire</button>
        </>
      ) : (
        <p style={{ color: 'green' }}>Hire request sent!</p>
      )}
    </div>
  );
}

export default LaborerCard;
