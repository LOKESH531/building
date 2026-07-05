import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminRoute({ children }) {
  const { currentUser, role, loading } = useAuth();

  if (loading) return <h2>Loading...</h2>;

  if (!currentUser) return <Navigate to="/login" replace />;

  if (role !== "admin") return <Navigate to="/login" replace />;

  return children;
}

export default AdminRoute;
