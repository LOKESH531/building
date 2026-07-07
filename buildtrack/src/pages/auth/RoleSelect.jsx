import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";

function RoleSelect() {
  const navigate = useNavigate();

  const handleRoleSelect = async (role) => {
    try {
      await signOut(auth);
      navigate("/login", { state: { role } });
    } catch (error) {
      console.error("Logout before role select failed:", error);
      navigate("/login", { state: { role } });
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Choose Account</h1>
        <p style={styles.subtitle}>Select account type to login</p>

        <button
          style={styles.button}
          onClick={() => handleRoleSelect("contractor")}
        >
          🏗 Contractor / Admin
        </button>

        <button
          style={styles.button}
          onClick={() => handleRoleSelect("client")}
        >
          🏠 House Owner / Client
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#eef4f8",
  },
  card: {
    width: "360px",
    background: "#fff",
    padding: "32px",
    borderRadius: "18px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    textAlign: "center",
  },
  title: {
    marginBottom: "8px",
    color: "#12345a",
  },
  subtitle: {
    marginBottom: "24px",
    color: "#6b7280",
  },
  button: {
    width: "100%",
    padding: "14px",
    marginBottom: "12px",
    border: "none",
    borderRadius: "12px",
    background: "#0b6b37",
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer",
  },
};

export default RoleSelect;
