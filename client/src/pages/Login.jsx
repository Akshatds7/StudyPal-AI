import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    localStorage.setItem('loggedIn', 'true');
    localStorage.setItem('userName', 'Akshat');
    navigate('/dashboard');
  };

  return (
    <div className="login-wrapper">
      {/* Background decorations */}
      <div className="bg-circle one"></div>
      <div className="bg-circle two"></div>

      <div className="login-card">
        <h1>📘 StudyPal</h1>
        <p className="subtitle">
          Your AI-powered study planner
        </p>

        <ul className="features">
          <li>📅 Smart day-wise study plans</li>
          <li>⚡ Save time & stay consistent</li>
          <li>📈 Track progress & streaks</li>
        </ul>

        <button className="google-btn" onClick={handleLogin}>
          🔐 Continue with Google
        </button>

        <p className="footer-text">
          No spam • Free forever • Secure login
        </p>
      </div>
    </div>
  );
}

export default Login;
