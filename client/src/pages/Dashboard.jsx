import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css'; // CSS file
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [plan, setPlan] = useState('');
  const [subjects, setSubjects] = useState('Math, Physics');
  const [hours, setHours] = useState(3);
  const [days, setDays] = useState(7);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('loggedIn')) {
      navigate('/');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('loggedIn');
    navigate('/');
  };

  const generatePlan = async () => {
    try {
      const res = await axios.post('https://studypal-ai.onrender.com/api/generate-plan', {
        subjects: subjects.split(',').map(s => s.trim()),
        hours: parseInt(hours),
        days: parseInt(days),
      });
      setPlan(res.data.plan);
    } catch (error) {
      setPlan('⚠️ Error generating plan. Please try again.');
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>📅 Generate Your Study Plan</h2>
      <input
        type="text"
        placeholder="Subjects (comma-separated)"
        value={subjects}
        onChange={(e) => setSubjects(e.target.value)}
      />
      <input
        type="number"
        placeholder="Hours per day"
        value={hours}
        onChange={(e) => setHours(e.target.value)}
      />
      <input
        type="number"
        placeholder="Number of days"
        value={days}
        onChange={(e) => setDays(e.target.value)}
      />
      <button onClick={generatePlan}>Generate Plan</button>

      <button
        onClick={handleLogout}
        style={{ marginTop: 20, backgroundColor: '#dc3545' }}
      >
        Logout
      </button>

      {plan && (
        <div
          style={{
            marginTop: 30,
            whiteSpace: 'pre-wrap',
            background: '#f9f9f9',
            padding: 20,
          }}
        >
          <h3>📋 Your Study Plan:</h3>
          <p>{plan}</p>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
