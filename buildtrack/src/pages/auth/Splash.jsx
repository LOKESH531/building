import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Splash() {
  const navigate = useNavigate();
  const { currentUser, role, loading } = useAuth();

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + 5;
      });
    }, 80);

    return () => clearInterval(progressTimer);
  }, []);

  useEffect(() => {
    if (loading) return;

    const timer = setTimeout(() => {
      if (currentUser && role) {
        if (role === "owner") navigate("/users", { replace: true });
        else if (role === "admin") navigate("/admin", { replace: true });
        else if (role === "client") navigate("/client", { replace: true });
        else navigate("/login", { replace: true, state: { role: "contractor" } });
      } else {
        navigate("/login", { replace: true, state: { role: "contractor" } });
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [loading, currentUser, role, navigate]);

  const handleGetStarted = () => {
    if (currentUser && role) {
      if (role === "owner") navigate("/users", { replace: true });
      else if (role === "admin") navigate("/admin", { replace: true });
      else if (role === "client") navigate("/client", { replace: true });
      else navigate("/login", { replace: true, state: { role: "contractor" } });
    } else {
      navigate("/login", { replace: true, state: { role: "contractor" } });
    }
  };

  return (
    <div className="splash-page">
      <div className="splash-bg-circle circle-one" />
      <div className="splash-bg-circle circle-two" />

      <div className="splash-card">
        <div className="splash-logo-wrap">
          <div className="splash-logo">🏗</div>
        </div>

        <h1>BuildTrack</h1>

        <p className="splash-subtitle">Construction Management System</p>

        <p className="splash-description">
          Manage projects, workers, materials, expenses, and house owner updates
          from one simple dashboard.
        </p>

        <div className="splash-progress-box">
          <div className="splash-progress-info">
            <span>Loading workspace</span>
            <strong>{progress}%</strong>
          </div>

          <div className="splash-progress-bar">
            <span style={{ width: `${progress}%` }} />
          </div>
        </div>

        <button className="splash-btn" onClick={handleGetStarted}>
          Get Started
        </button>

        <div className="splash-footer">
          Contractor Portal • House Owner Portal
        </div>
      </div>
    </div>
  );
}

export default Splash;
