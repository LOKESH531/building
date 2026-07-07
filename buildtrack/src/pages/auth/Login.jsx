import { useState, useEffect, useCallback } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import {
  login,
  logout as authLogout,
  getAuthError,
} from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import "./Auth.css";

function Login() {
  const navigate = useNavigate();
  const { currentUser, role, loading: authLoading } = useAuth();

  const [selectedRole, setSelectedRole] = useState("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const goToDashboard = useCallback(
    (userRole) => {
      if (userRole === "owner" || userRole === "admin") {
        navigate("/admin", { replace: true });
      } else if (userRole === "client") {
        navigate("/client", { replace: true });
      } else {
        navigate("/login", { replace: true });
      }
    },
    [navigate]
  );

  useEffect(() => {
    if (authLoading || !currentUser || !role) return;
    goToDashboard(role);
  }, [authLoading, currentUser, role, goToDashboard]);

  const isRoleAllowed = (selectedLoginRole, actualRole) => {
    if (selectedLoginRole === "admin") {
      return actualRole === "admin" || actualRole === "owner";
    }
    if (selectedLoginRole === "client") {
      return actualRole === "client";
    }
    return false;
  };

  const getRoleErrorMessage = (actualRole) => {
    const selectedName = selectedRole === "admin" ? "Admin" : "Client";
    const actualName = actualRole === "client" ? "Client" : "Admin";
    return `This account is registered as ${actualName}, not ${selectedName}.`;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const result = await login(email, password, remember);

      if (!isRoleAllowed(selectedRole, result.role)) {
        await authLogout();
        alert(getRoleErrorMessage(result.role));
        return;
      }

      goToDashboard(result.role);
    } catch (err) {
      alert(err.code ? getAuthError(err.code) : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <h1>🏗 BuildTrack</h1>
        <h2>Construction Management</h2>

        <p>
          Manage projects, workers, materials, expenses, and client updates from
          one place.
        </p>

        <div className="feature-list">
          <div>✔ Project Management</div>
          <div>✔ Material Tracking</div>
          <div>✔ Expense Management</div>
          <div>✔ Daily Updates</div>
          <div>✔ Client Portal</div>
        </div>
      </div>

      <div className="auth-right">
        <form className="auth-card" onSubmit={handleLogin}>
          <h2>Welcome Back</h2>
          <p>Login to continue</p>

          <div className="role-switch">
            <button
              type="button"
              className={selectedRole === "admin" ? "active" : ""}
              onClick={() => setSelectedRole("admin")}
            >
              Admin
            </button>

            <button
              type="button"
              className={selectedRole === "client" ? "active" : ""}
              onClick={() => setSelectedRole("client")}
            >
              Client
            </button>
          </div>

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <span
              className="eye"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="remember-row">
            <label>
              <input
                type="checkbox"
                checked={remember}
                onChange={() => setRemember(!remember)}
              />{" "}
              Remember Me
            </label>

            <Link to="/forgot-password">Forgot Password?</Link>
          </div>

          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? <div className="loader" /> : "Login"}
          </button>

          <div className="signup-links">
            <Link to="/signup-owner">Create Admin Account</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
