import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../services/authService";

function LogoutButton() {
  const navigate = useNavigate();

  const logout = async () => {
    await logoutUser();
    navigate("/login");
  };

  return (
    <button className="logout-btn" onClick={logout}>
      Logout
    </button>
  );
}

export default LogoutButton;
