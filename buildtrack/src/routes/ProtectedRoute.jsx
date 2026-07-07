import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, allowedRoles }) {
  const { currentUser, userData, role, loading } = useAuth();

  if (loading) return <div className="auth-loading">Loading...</div>;

  if (!currentUser) return <Navigate to="/login" replace />;

if (!userData || userData.status !== "active") {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) return <Navigate to="/login" replace />;

  return children;
}

export default ProtectedRoute;
