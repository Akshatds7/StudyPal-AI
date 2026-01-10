import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar({ darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'Student';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <nav className={`navbar ${darkMode ? 'dark' : ''}`}>
      <div className="nav-left">
        📘 <span className="logo-text">StudyPal</span>
      </div>

      <div className="nav-right">
        <span className="user">👤 {userName}</span>

        <button
          className="icon-btn"
          onClick={() => setDarkMode(!darkMode)}
          title="Toggle Dark Mode"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
