import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <style>{`
        .nav-logout-btn:hover {
          background: rgba(255,255,255,0.25) !important;
        }
        .nav-login-btn:hover {
          background: rgba(255,255,255,0.25) !important;
        }
        .nav-signup-btn:hover {
          background: white !important;
          color: #b92d2d !important;
        }
      `}</style>

      {/* Brand */}
      <NavLink to="/" style={styles.brand}>
        <span style={styles.icon}>🩸</span>
        <span>DonorLink</span>
      </NavLink>

      {/* Navigation links */}
      <div style={styles.links}>
        <NavLink
          to="/"
          end
          style={({ isActive }) => ({ ...styles.link, ...(isActive ? styles.activeLink : {}) })}
        >
          Home
        </NavLink>
        <NavLink
          to="/donors"
          style={({ isActive }) => ({ ...styles.link, ...(isActive ? styles.activeLink : {}) })}
        >
          Donors
        </NavLink>
        <NavLink
          to="/patients"
          style={({ isActive }) => ({ ...styles.link, ...(isActive ? styles.activeLink : {}) })}
        >
          Patients
        </NavLink>
        <NavLink
          to="/requests"
          style={({ isActive }) => ({ ...styles.link, ...(isActive ? styles.activeLink : {}) })}
        >
          Requests
        </NavLink>
      </div>

      {/* Auth controls */}
      <div style={styles.authControls}>
        {isAuthenticated ? (
          <>
            <div style={styles.userInfo}>
              <span style={styles.roleBadge}>{user?.role}</span>
              <span style={styles.userName}>{user?.fullName?.split(" ")[0]}</span>
            </div>
            <button
              id="nav-logout-btn"
              onClick={handleLogout}
              style={styles.logoutBtn}
              className="nav-logout-btn"
            >
              Sign Out
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" style={styles.loginBtn} className="nav-login-btn">
              Sign In
            </NavLink>
            <NavLink to="/signup" style={styles.signupBtn} className="nav-signup-btn">
              Get Started
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    background: "linear-gradient(90deg, #d64545 0%, #b92d2d 100%)",
    padding: "14px 28px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 8px 30px rgba(185, 45, 45, 0.2)",
    position: "sticky",
    top: 0,
    zIndex: 100,
    gap: "16px",
  },
  brand: {
    color: "white",
    fontSize: "22px",
    fontWeight: "800",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    letterSpacing: "0.3px",
    textDecoration: "none",
    flexShrink: 0,
  },
  icon: {
    fontSize: "24px",
  },
  links: {
    display: "flex",
    gap: "4px",
    alignItems: "center",
  },
  link: {
    color: "rgba(255,255,255,0.88)",
    fontSize: "14px",
    fontWeight: "600",
    padding: "7px 12px",
    borderRadius: "999px",
    transition: "background 0.2s",
    textDecoration: "none",
  },
  activeLink: {
    backgroundColor: "rgba(255,255,255,0.2)",
    color: "white",
  },
  authControls: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexShrink: 0,
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  roleBadge: {
    fontSize: "11px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    backgroundColor: "rgba(255,255,255,0.22)",
    color: "white",
    padding: "3px 8px",
    borderRadius: "999px",
    border: "1px solid rgba(255,255,255,0.3)",
  },
  userName: {
    color: "white",
    fontSize: "14px",
    fontWeight: "600",
  },
  loginBtn: {
    color: "rgba(255,255,255,0.92)",
    fontSize: "14px",
    fontWeight: "600",
    padding: "7px 14px",
    borderRadius: "999px",
    textDecoration: "none",
    transition: "background 0.2s",
  },
  signupBtn: {
    backgroundColor: "rgba(255,255,255,0.15)",
    color: "white",
    fontSize: "14px",
    fontWeight: "700",
    padding: "7px 16px",
    borderRadius: "999px",
    border: "1.5px solid rgba(255,255,255,0.5)",
    textDecoration: "none",
    transition: "background 0.2s, color 0.2s",
  },
  logoutBtn: {
    backgroundColor: "rgba(255,255,255,0.12)",
    color: "white",
    fontSize: "14px",
    fontWeight: "600",
    padding: "7px 14px",
    borderRadius: "999px",
    border: "1.5px solid rgba(255,255,255,0.35)",
    cursor: "pointer",
    transition: "background 0.2s",
  },
};

export default Navbar;