import { useNavigate } from "react-router-dom";
import { logout as authLogout } from "../../services/authService";

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authLogout();
    navigate("/login", { replace: true });
  };

  return (
    <button className="logout-btn" onClick={handleLogout}>
      Logout
    </button>
  );
}

export default LogoutButton;
