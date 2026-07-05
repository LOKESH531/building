import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerAdmin } from "../../services/authService";
import "./Auth.css";

function AdminSignup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    companyName: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    gst: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const change = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!form.companyName || !form.name || !form.email || !form.phone || !form.password) {
      alert("Please fill all required fields.");
      return;
    }

    if (form.password.length < 8) {
      alert("Password must contain at least 8 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      await registerAdmin(form);
      alert("Admin account created successfully.");
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
        <h2>Create Company</h2>
        <p>Register your company and start managing projects professionally.</p>
        <div className="feature-list">
          <div>✔ Unlimited Projects</div>
          <div>✔ Worker Management</div>
          <div>✔ Expense Tracking</div>
          <div>✔ Material Inventory</div>
          <div>✔ Client Portal</div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card signup-card">
          <h2>Create Admin Account</h2>
          <form onSubmit={submit}>
            <input name="companyName" placeholder="Company Name" value={form.companyName} onChange={change}/>
            <input name="name" placeholder="Admin Name" value={form.name} onChange={change}/>
            <input name="email" type="email" placeholder="Email" value={form.email} onChange={change}/>
            <input name="phone" placeholder="Phone" value={form.phone} onChange={change}/>
            <textarea name="address" placeholder="Company Address" value={form.address} onChange={change}/>
            <input name="gst" placeholder="GST Number" value={form.gst} onChange={change}/>
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

export default AdminSignup;
