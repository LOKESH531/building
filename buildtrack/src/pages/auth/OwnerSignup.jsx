import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerOwner } from "../../services/authService";
import "./Auth.css";

function OwnerSignup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    companyName: "",
    ownerName: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const change = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();

    if (
      !form.companyName.trim() ||
      !form.ownerName.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.password ||
      !form.confirmPassword
    ) {
      alert("Please fill all required fields");
      return;
    }

    if (form.password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await registerOwner(form);

      alert("Contractor account created successfully. Please login.");

      navigate("/login", {
        replace: true,
        state: { role: "contractor" },
      });
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <h1>🏗 BuildTrack</h1>
        <h2>Create Contractor Account</h2>
        <p>
          Register your construction business and start managing house projects
          professionally.
        </p>

        <div className="feature-list">
          <div>✔ Project Management</div>
          <div>✔ Worker Management</div>
          <div>✔ Expense Tracking</div>
          <div>✔ Material Inventory</div>
          <div>✔ House Owner Portal</div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card signup-card">
          <h2>Create Contractor Account</h2>
          <p>Contractor setup</p>

          <form onSubmit={submit}>
            <input
              name="companyName"
              placeholder="Company / Contractor Business Name *"
              value={form.companyName}
              onChange={change}
            />

            <input
              name="ownerName"
              placeholder="Contractor Name *"
              value={form.ownerName}
              onChange={change}
            />

            <input
              name="email"
              type="email"
              placeholder="Email *"
              value={form.email}
              onChange={change}
            />

            <input
              name="phone"
              placeholder="Phone *"
              value={form.phone}
              onChange={change}
            />

            <textarea
              name="address"
              placeholder="Business Address"
              value={form.address}
              onChange={change}
            />

            <input
              name="password"
              type="password"
              placeholder="Password *"
              value={form.password}
              onChange={change}
            />

            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password *"
              value={form.confirmPassword}
              onChange={change}
            />

            <button className="login-btn" disabled={loading}>
              {loading ? "Creating Account..." : "Create Contractor Account"}
            </button>
          </form>

          <div className="signup-links">
            <Link to="/login" state={{ role: "contractor" }}>
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OwnerSignup;
