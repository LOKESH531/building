import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerClient } from "../../services/authService";
import "./Auth.css";

function ClientSignup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });

  const change = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.phone || !form.password) {
      alert("Please fill all fields.");
      return;
    }

    if (form.password.length < 8) {
      alert("Password should contain at least 8 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      await registerClient(form);
      alert("Client account created successfully.");
      navigate("/login");
    } catch (err) {
      alert(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="auth-page">

      <div className="auth-left">
        <h1>🏗 BuildTrack</h1>
        <h2>Client Portal</h2>
        <p>Stay connected with your construction project, monitor progress, expenses and updates in real time.</p>
        <div className="feature-list">
          <div>✔ Live Progress</div>
          <div>✔ Daily Updates</div>
          <div>✔ Expense Tracking</div>
          <div>✔ Project Reports</div>
          <div>✔ Notifications</div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card signup-card">
          <h2>Create Client Account</h2>
          <form onSubmit={submit}>
            <input name="name" placeholder="Full Name" value={form.name} onChange={change}/>
            <input name="email" type="email" placeholder="Email" value={form.email} onChange={change}/>
            <input name="phone" placeholder="Phone Number" value={form.phone} onChange={change}/>
            <input name="password" type="password" placeholder="Password" value={form.password} onChange={change}/>
            <input name="confirmPassword" type="password" placeholder="Confirm Password" value={form.confirmPassword} onChange={change}/>
            <button className="login-btn" disabled={loading}>
              {loading ? "Creating Account..." : "Register"}
            </button>
          </form>
          <div className="signup-links">
            <Link to="/login">Already have an account?</Link>
          </div>
        </div>
      </div>

    </div>
  );
}

export default ClientSignup;
