import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    localStorage.setItem('loggedIn', true);
    navigate('/dashboard');
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h1>🚀 Welcome to <span className="brand">StudyPal</span></h1>
        <p>Your AI-powered study planner</p>
        <button className="login-btn" onClick={handleLogin}>
          <img src="https://static.vecteezy.com/system/resources/previews/041/731/090/non_2x/login-icon-vector.jpg" alt="Google" />
          Login with Google
        </button>
      </div>
    </div>
  );
}

export default Login;



