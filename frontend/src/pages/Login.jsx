import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  const from = location.state?.from?.pathname || "/";

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Redirect if already logged in
  if (isAuthenticated) {
    navigate(from, { replace: true });
    return null;
  }

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Basic client-side validation
    if (!form.email || !form.password) {
      return setError("Email and password are required.");
    }

    setLoading(true);
    try {
      const data = await login(form);
      setSuccess(`Welcome back, ${data.user.fullName}!`);
      setTimeout(() => navigate(from, { replace: true }), 800);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        (err.message === "Network Error"
          ? "Unable to connect to server. Please check if the server is running."
          : err.message || "Login failed. Please try again.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .auth-input:focus {
          border-color: #d64545 !important;
          box-shadow: 0 0 0 3px rgba(214,69,69,0.18) !important;
        }
        .auth-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 16px 36px rgba(214,69,69,0.4) !important;
        }
        .auth-btn:active:not(:disabled) {
          transform: translateY(0);
        }
        .toggle-pw:hover {
          color: #d64545 !important;
        }
        .signup-link:hover {
          color: #b92d2d !important;
          text-decoration: underline;
        }
      `}</style>

      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <span style={styles.logo}>🩸</span>
          <h1 style={styles.title}>Welcome Back</h1>
          <p style={styles.subtitle}>Sign in to your DonorLink account</p>
        </div>

        {/* Error / Success alerts */}
        {error && (
          <div style={styles.alertError} role="alert">
            <span style={styles.alertIcon}>⚠️</span>
            {error}
          </div>
        )}
        {success && (
          <div style={styles.alertSuccess} role="alert">
            <span style={styles.alertIcon}>✅</span>
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate style={styles.form}>
          {/* Email */}
          <div style={styles.fieldGroup}>
            <label htmlFor="login-email" style={styles.label}>Email Address</label>
            <input
              id="login-email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
              disabled={loading}
              style={styles.input}
              className="auth-input"
            />
          </div>

          {/* Password */}
          <div style={styles.fieldGroup}>
            <label htmlFor="login-password" style={styles.label}>Password</label>
            <div style={styles.passwordWrap}>
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="current-password"
                disabled={loading}
                style={{ ...styles.input, paddingRight: "48px" }}
                className="auth-input"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                style={styles.eyeBtn}
                className="toggle-pw"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            id="login-submit-btn"
            type="submit"
            disabled={loading}
            style={styles.submitBtn}
            className="auth-btn"
          >
            {loading ? (
              <span style={styles.btnInner}>
                <span style={styles.spinner} />
                Signing in…
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Footer */}
        <p style={styles.footerText}>
          Don&apos;t have an account?{" "}
          <Link to="/signup" style={styles.link} className="signup-link">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = {
  pageWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "calc(100vh - 120px)",
    padding: "32px 16px",
  },
  card: {
    background: "white",
    borderRadius: "24px",
    padding: "44px 40px",
    width: "100%",
    maxWidth: "440px",
    boxShadow: "0 24px 64px rgba(214,69,69,0.12), 0 4px 20px rgba(0,0,0,0.06)",
    border: "1px solid rgba(214,69,69,0.1)",
    animation: "fadeUp 0.45s ease forwards",
  },
  header: {
    textAlign: "center",
    marginBottom: "28px",
  },
  logo: {
    fontSize: "44px",
    display: "block",
    marginBottom: "10px",
    filter: "drop-shadow(0 4px 12px rgba(214,69,69,0.3))",
  },
  title: {
    fontSize: "28px",
    fontWeight: "800",
    color: "#b92d2d",
    margin: "0 0 6px",
  },
  subtitle: {
    color: "#6b7280",
    fontSize: "14px",
    margin: 0,
  },
  alertError: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    borderLeft: "4px solid #ef4444",
    color: "#b91c1c",
    padding: "12px 14px",
    borderRadius: "10px",
    fontSize: "14px",
    marginBottom: "18px",
    lineHeight: 1.5,
  },
  alertSuccess: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#f0fdf4",
    border: "1px solid #bbf7d0",
    borderLeft: "4px solid #22c55e",
    color: "#15803d",
    padding: "12px 14px",
    borderRadius: "10px",
    fontSize: "14px",
    marginBottom: "18px",
    lineHeight: 1.5,
  },
  alertIcon: {
    fontSize: "16px",
    flexShrink: 0,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#374151",
    letterSpacing: "0.01em",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    border: "1.5px solid #e5d7d7",
    borderRadius: "10px",
    fontSize: "15px",
    color: "#1f2937",
    background: "#fffafa",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  passwordWrap: {
    position: "relative",
  },
  eyeBtn: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    fontSize: "18px",
    cursor: "pointer",
    color: "#9ca3af",
    transition: "color 0.2s",
    padding: "4px",
    lineHeight: 1,
  },
  submitBtn: {
    width: "100%",
    padding: "14px",
    background: "linear-gradient(135deg, #d64545 0%, #b92d2d 100%)",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "700",
    boxShadow: "0 10px 24px rgba(214,69,69,0.3)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    cursor: "pointer",
    marginTop: "4px",
  },
  btnInner: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  spinner: {
    width: "16px",
    height: "16px",
    border: "2px solid rgba(255,255,255,0.4)",
    borderTop: "2px solid white",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
    display: "inline-block",
  },
  footerText: {
    textAlign: "center",
    marginTop: "22px",
    fontSize: "14px",
    color: "#6b7280",
  },
  link: {
    color: "#d64545",
    fontWeight: "600",
    transition: "color 0.2s",
  },
};

export default Login;
