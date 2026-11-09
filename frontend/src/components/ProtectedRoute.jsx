import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * ProtectedRoute — renders children only if the user is authenticated.
 * Optionally restricts to specific roles via the `roles` prop.
 *
 * Usage:
 *   <ProtectedRoute>                        — any authenticated user
 *   <ProtectedRoute roles={["admin"]}>       — admins only
 *   <ProtectedRoute roles={["donor","admin"]}>
 */
function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // Show nothing while the auth state is being verified on mount
  if (loading) {
    return (
      <div style={styles.loadingWrap}>
        <div style={styles.spinner} />
        <p style={styles.loadingText}>Checking authentication…</p>
      </div>
    );
  }

  // Redirect unauthenticated users to login, preserving the intended destination
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role check — if roles provided and user's role is not in list, redirect to home
  if (roles && roles.length > 0 && !roles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

const styles = {
  loadingWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "60vh",
    gap: "16px",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid rgba(214,69,69,0.15)",
    borderTop: "4px solid #d64545",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  loadingText: {
    color: "#6b7280",
    fontSize: "14px",
  },
};

export default ProtectedRoute;
