import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ClientRoute({ children }) {
  const { currentUser, role, loading } = useAuth();

  if (loading) return <h2>Loading...</h2>;

  if (!currentUser) return <Navigate to="/login" replace />;

  if (role !== "client") return <Navigate to="/login" replace />;

  return children;
}

export default ClientRoute;
