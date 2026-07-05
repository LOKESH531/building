import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { loginUser, getAuthError } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import "./Auth.css";

function Login() {
  const navigate = useNavigate();
  const { currentUser, role } = useAuth();

  const [selectedRole, setSelectedRole] = useState("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    if (role === "admin") navigate("/dashboard");
    if (role === "client") navigate("/client-dashboard");
  }, [currentUser, role]);

  const login = async () => {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const result = await loginUser(email, password, remember);

      if (result.role !== selectedRole) {
        alert(`This account is not a ${selectedRole}.`);
        setLoading(false);
        return;
      }

      if (result.role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/client-dashboard");
      }
    } catch (err) {
      alert(getAuthError(err.code) || err.message);
    }

    setLoading(false);
  };

  return (
    <div className="auth-page">

      <div className="auth-left">
        <h1>🏗 BuildTrack</h1>
        <h2>Construction ERP</h2>
        <p>Manage Projects, Workers, Materials, Expenses and Clients from one place.</p>
        <div className="feature-list">
          <div>✔ Project Management</div>
          <div>✔ Material Tracking</div>
          <div>✔ Expense Management</div>
          <div>✔ Daily Updates</div>
          <div>✔ Client Portal</div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <h2>Welcome Back</h2>
          <p>Login to continue</p>

          <div className="role-switch">
            <button className={selectedRole==="admin"?"active":""} onClick={()=>setSelectedRole("admin")}>Admin</button>
            <button className={selectedRole==="client"?"active":""} onClick={()=>setSelectedRole("client")}>Client</button>
          </div>

          <input
            placeholder="Email Address"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
          />

          <div className="password-wrapper">
            <input
              type={showPassword?"text":"password"}
              placeholder="Password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
            />
            <span className="eye" onClick={()=>setShowPassword(!showPassword)}>
              {showPassword?<FaEyeSlash/>:<FaEye/>}
            </span>
          </div>

          <div className="remember-row">
            <label>
              <input
                type="checkbox"
                checked={remember}
                onChange={()=>setRemember(!remember)}
              />
              {" "}Remember Me
            </label>
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>

          <button className="login-btn" onClick={login} disabled={loading}>
            {loading ? <div className="loader"/> : "Login"}
          </button>

          <div className="signup-links">
            <Link to="/signup/admin">Create Admin Account</Link>
            <Link to="/signup/client">Create Client Account</Link>
          </div>

        </div>
      </div>

    </div>
  );
}

export default Login;
