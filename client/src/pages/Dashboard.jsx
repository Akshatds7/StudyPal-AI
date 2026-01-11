import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const API_BASE = "http://localhost:5000/api";

function Dashboard() {
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState("Math, Physics");
  const [hours, setHours] = useState(3);
  const [days, setDays] = useState(7);

  const [plan, setPlan] = useState([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [completedDays, setCompletedDays] = useState([]);

  /* ---------- AUTH CHECK ---------- */
  useEffect(() => {
    if (!localStorage.getItem("loggedIn")) {
      navigate("/");
    }
  }, [navigate]);

  /* ---------- LOGOUT ---------- */
  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    navigate("/");
  };

  /* ---------- GENERATE FULL PLAN ---------- */
  const generatePlan = async () => {
    setLoading(true);
    setPlan([]);
    setCompletedDays([]);

    try {
      const res = await axios.post(`${API_BASE}/generate-plan`, {
        subjects: subjects.split(",").map(s => s.trim()),
        hours: Number(hours),
        days: Number(days),
      });

      console.log("AI RESPONSE:", res.data.plan);

      const parsed = res.data.plan
        .split(/Day\s+\d+:/)
        .filter(Boolean)
        .map((text, index) => ({
          day: index + 1,
          content: text.trim(),
        }));

      setPlan(parsed);
    } catch (err) {
      console.error(err);
      alert("Failed to generate plan");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- REGENERATE SINGLE DAY ---------- */
  const regenerateDay = async (dayNumber) => {
    try {
      const res = await axios.post(`${API_BASE}/generate-plan`, {
        subjects: subjects.split(",").map(s => s.trim()),
        hours: Number(hours),
        days: 1,
      });

      setPlan(prev =>
        prev.map(d =>
          d.day === dayNumber
            ? { ...d, content: res.data.plan }
            : d
        )
      );
    } catch {
      alert("Failed to regenerate day");
    }
  };

  /* ---------- MARK COMPLETE ---------- */
  const toggleComplete = (day) => {
    setCompletedDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const streak = completedDays.length;

  /* ---------- PDF EXPORT ---------- */
  const exportPDF = () => {
    const pdf = new jsPDF();
    pdf.setFontSize(16);
    pdf.text("Study Plan", 10, 10);

    let y = 20;
    plan.forEach(d => {
      pdf.setFontSize(14);
      pdf.text(`Day ${d.day}`, 10, y);
      y += 6;

      pdf.setFontSize(11);
      pdf.text(d.content, 12, y);
      y += 12;
    });

    pdf.save("StudyPal_Plan.pdf");
  };

  return (
    <div className={`dashboard-wrapper ${darkMode ? "dark" : ""}`}>
      <div className="dashboard-card wide">

        {/* HEADER */}
        <div className="top-bar">
          <h2>📅 Study Planner</h2>
          <button onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>

        <div className="stats">
          🔥 Streak: <strong>{streak}</strong> days
        </div>

        {/* INPUTS */}
        <input value={subjects} onChange={e => setSubjects(e.target.value)} />
        <input type="number" value={hours} onChange={e => setHours(e.target.value)} />
        <input type="number" value={days} onChange={e => setDays(e.target.value)} />

        <button onClick={generatePlan} disabled={loading}>
          {loading ? "Generating..." : "Generate Plan"}
        </button>

        {plan.length > 0 && (
          <>
            <button className="pdf-btn" onClick={exportPDF}>
              📄 Export PDF
            </button>

            <div className="calendar">
              {plan.map(d => (
                <div
                  key={d.day}
                  className={`day-card ${completedDays.includes(d.day) ? "done" : ""}`}
                >
                  <h4>Day {d.day}</h4>
                  <p>{d.content}</p>

                  <div className="day-actions">
                    <button onClick={() => toggleComplete(d.day)}>
                      {completedDays.includes(d.day) ? "✅ Done" : "Mark Done"}
                    </button>
                    <button onClick={() => regenerateDay(d.day)}>
                      🔄 Regenerate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
