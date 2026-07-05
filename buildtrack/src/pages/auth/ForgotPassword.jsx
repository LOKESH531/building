import { useState } from "react";
import { Link } from "react-router-dom";
import { resetPassword } from "../../services/authService";
import "./Auth.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const sendReset = async (e) => {
    e.preventDefault();

    if (!email) {
      alert("Enter your email.");
      return;
    }

    try {
      setLoading(true);
      await resetPassword(email);
      alert("Password reset email sent.");
    } catch (err) {
      alert(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="auth-page">

      <div className="auth-left">
        <h1>🏗 BuildTrack</h1>
        <h2>Forgot Password</h2>
        <p>Enter your registered email address and we'll send a password reset link.</p>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <h2>Reset Password</h2>
          <form onSubmit={sendReset}>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
            />
            <button className="login-btn" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
          <div className="signup-links">
            <Link to="/login">Back to Login</Link>
          </div>
        </div>
      </div>

    </div>
  );
}

export default ForgotPassword;
