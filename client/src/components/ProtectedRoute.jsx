import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ roles = [] }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-ink-50 dark:bg-ink-950">
        <div className="h-16 w-16 animate-pulse rounded-lg bg-jade-100 dark:bg-jade-400/20" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const slug = user.role?.slug || user.role;
  if (roles.length > 0 && !roles.includes(slug)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
