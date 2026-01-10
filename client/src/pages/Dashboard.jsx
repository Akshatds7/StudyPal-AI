import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";

const API_URL = "https://studypal-ai.onrender.com/api/generate-plan";

function Dashboard() {
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState("Math, Physics");
  const [hours, setHours] = useState(3);
  const [days, setDays] = useState(7);

  const [plan, setPlan] = useState([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [completedDays, setCompletedDays] = useState([]);
  const [streak, setStreak] = useState(0);

  const userName = localStorage.getItem("userName") || "Student";

  /* ================= AUTH CHECK ================= */
  useEffect(() => {
    if (!localStorage.getItem("loggedIn")) {
      navigate("/");
    }
  }, [navigate]);

  /* ================= GENERATE FULL PLAN ================= */
  const generatePlan = async () => {
  setLoading(true);
  setPlan([]);

  try {
    const res = await axios.post(
      "https://studypal-ai.onrender.com/api/generate-plan",
      {
        subjects: subjects.split(",").map(s => s.trim()),
        hours: Number(hours),
        days: Number(days),
      }
    );

    const raw = res.data.plan;

    // ✅ Robust parsing
    const parsed = raw
      .split(/Day\s+\d+:/)
      .filter(Boolean)
      .map((text, index) => ({
        day: index + 1,
        content: text.trim(),
      }));

    setPlan(parsed);
    setCompletedDays([]);
    setStreak(0);
  } catch (error) {
    console.error(error);
    alert("Failed to generate plan");
  } finally {
    setLoading(false);
  }
};

  /* ================= SINGLE DAY REGEN ================= */
  const regenerateDay = async (dayNumber) => {
    try {
      const res = await axios.post(API_URL, {
        subjects: subjects.split(",").map((s) => s.trim()),
        hours: Number(hours),
        days: 1,
      });

      setPlan((prev) =>
        prev.map((d) =>
          d.day === dayNumber
            ? { ...d, content: res.data.plan }
            : d
        )
      );
    } catch {
      alert("Error regenerating day");
    }
  };

  /* ================= COMPLETE DAY ================= */
  const markCompleted = (day) => {
    if (!completedDays.includes(day)) {
      const updated = [...completedDays, day];
      setCompletedDays(updated);
      setStreak(updated.length);
    }
  };

  /* ================= PDF EXPORT ================= */
  const exportPDF = () => {
    const pdf = new jsPDF();
    pdf.setFontSize(14);
    pdf.text("Study Plan", 10, 10);

    let y = 20;
    plan.forEach((d) => {
      pdf.text(`Day ${d.day}`, 10, y);
      y += 6;
      pdf.setFontSize(11);
      pdf.text(d.content, 10, y);
      y += 14;
    });

    pdf.save("study-plan.pdf");
  };

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className={`dashboard-wrapper ${darkMode ? "dark" : ""}`}>
      <div className={`dashboard-card ${plan.length ? "wide" : ""}`}>
        
        {/* HEADER */}
        <div className="top-bar">
          <h2>📅 Study Planner</h2>
          <button onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>

        <p>Welcome, <strong>{userName}</strong> 👋</p>

        {/* INPUTS */}
        <input
          value={subjects}
          onChange={(e) => setSubjects(e.target.value)}
          placeholder="Subjects"
        />
        <input
          type="number"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          placeholder="Hours per day"
        />
        <input
          type="number"
          value={days}
          onChange={(e) => setDays(e.target.value)}
          placeholder="Days"
        />

        <button onClick={generatePlan} disabled={loading}>
          {loading ? "Generating..." : "Generate Plan"}
        </button>

        {plan.length > 0 && (
          <>
            <div className="stats">
              🔥 Streak: {streak} days completed
            </div>

            <button className="pdf-btn" onClick={exportPDF}>
              📄 Export PDF
            </button>
          </>
        )}

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>

        {/* CALENDAR */}
        {plan.length > 0 && (
          <div className="calendar">
            {plan.map((d) => (
              <div
                key={d.day}
                className={`day-card ${
                  completedDays.includes(d.day) ? "done" : ""
                }`}
              >
                <h4>Day {d.day}</h4>
                <p>{d.content}</p>

                <div className="day-actions">
                  <button onClick={() => markCompleted(d.day)}>
                    ✅ Done
                  </button>
                  <button onClick={() => regenerateDay(d.day)}>
                    🔄 Regenerate
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
