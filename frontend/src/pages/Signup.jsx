import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Signup() {
  const navigate = useNavigate();
  const { signup, isAuthenticated } = useAuth();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "donor",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  // Redirect if already logged in
  if (isAuthenticated) {
    navigate("/", { replace: true });
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear field-level error on change
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
    setError("");
  };

  // ── Client-side validation ─────────────────────────────────────────────────
  const validate = () => {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = "Full name is required.";
    if (!form.email.trim()) {
      errs.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      errs.email = "Enter a valid email address.";
    }
    if (!form.phone.trim()) errs.phone = "Phone number is required.";
    if (!form.password) {
      errs.password = "Password is required.";
    } else if (form.password.length < 6) {
      errs.password = "Password must be at least 6 characters.";
    }
    if (!form.confirmPassword) {
      errs.confirmPassword = "Please confirm your password.";
    } else if (form.password !== form.confirmPassword) {
      errs.confirmPassword = "Passwords do not match.";
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }
    setFieldErrors({});
    setLoading(true);
    try {
      await signup(form);
      navigate("/", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
        (err.message === "Network Error"
          ? "Unable to connect to server. Please check if the server is running."
          : err.message || "Signup failed. Please try again.")
      );
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { value: "donor", label: "🩸 Blood Donor", desc: "Register to donate blood" },
    { value: "recipient", label: "🏥 Recipient", desc: "Request blood for a patient" },
  ];

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
        .auth-input.field-error {
          border-color: #ef4444 !important;
        }
        .auth-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 16px 36px rgba(214,69,69,0.4) !important;
        }
        .auth-btn:active:not(:disabled) {
          transform: translateY(0);
        }
        .role-card {
          transition: all 0.2s ease;
        }
        .role-card:hover {
          border-color: #d64545 !important;
          background: #fff5f5 !important;
        }
        .toggle-pw:hover { color: #d64545 !important; }
        .login-link:hover { color: #b92d2d !important; text-decoration: underline; }
      `}</style>

      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <span style={styles.logo}>🩸</span>
          <h1 style={styles.title}>Create Account</h1>
          <p style={styles.subtitle}>Join DonorLink and help save lives</p>
        </div>

        {/* Global error */}
        {error && (
          <div style={styles.alertError} role="alert">
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate style={styles.form}>
          {/* Role Selection */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>I want to register as</label>
            <div style={styles.roleGrid}>
              {roleOptions.map((opt) => (
                <label
                  key={opt.value}
                  style={{
                    ...styles.roleCard,
                    ...(form.role === opt.value ? styles.roleCardActive : {}),
                  }}
                  className="role-card"
                >
                  <input
                    type="radio"
                    name="role"
                    value={opt.value}
                    checked={form.role === opt.value}
                    onChange={handleChange}
                    style={{ display: "none" }}
                  />
                  <span style={styles.roleLabel}>{opt.label}</span>
                  <span style={styles.roleDesc}>{opt.desc}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Full Name */}
          <Field
            id="signup-fullname"
            label="Full Name"
            name="fullName"
            type="text"
            value={form.fullName}
            onChange={handleChange}
            placeholder="John Doe"
            error={fieldErrors.fullName}
            disabled={loading}
            autoComplete="name"
          />

          {/* Email */}
          <Field
            id="signup-email"
            label="Email Address"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            error={fieldErrors.email}
            disabled={loading}
            autoComplete="email"
          />

          {/* Phone */}
          <Field
            id="signup-phone"
            label="Phone Number"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            placeholder="+1 234 567 8900"
            error={fieldErrors.phone}
            disabled={loading}
            autoComplete="tel"
          />

          {/* Password */}
          <div style={styles.fieldGroup}>
            <label htmlFor="signup-password" style={styles.label}>Password</label>
            <div style={styles.passwordWrap}>
              <input
                id="signup-password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Min. 6 characters"
                autoComplete="new-password"
                disabled={loading}
                style={{
                  ...styles.input,
                  paddingRight: "48px",
                  ...(fieldErrors.password ? styles.inputError : {}),
                }}
                className={`auth-input${fieldErrors.password ? " field-error" : ""}`}
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
            {fieldErrors.password && <span style={styles.fieldError}>{fieldErrors.password}</span>}
          </div>

          {/* Confirm Password */}
          <div style={styles.fieldGroup}>
            <label htmlFor="signup-confirm-password" style={styles.label}>Confirm Password</label>
            <div style={styles.passwordWrap}>
              <input
                id="signup-confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                autoComplete="new-password"
                disabled={loading}
                style={{
                  ...styles.input,
                  paddingRight: "48px",
                  ...(fieldErrors.confirmPassword ? styles.inputError : {}),
                }}
                className={`auth-input${fieldErrors.confirmPassword ? " field-error" : ""}`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                style={styles.eyeBtn}
                className="toggle-pw"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? "🙈" : "👁️"}
              </button>
            </div>
            {fieldErrors.confirmPassword && (
              <span style={styles.fieldError}>{fieldErrors.confirmPassword}</span>
            )}
          </div>

          {/* Submit */}
          <button
            id="signup-submit-btn"
            type="submit"
            disabled={loading}
            style={styles.submitBtn}
            className="auth-btn"
          >
            {loading ? (
              <span style={styles.btnInner}>
                <span style={styles.spinner} />
                Creating account…
              </span>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <p style={styles.footerText}>
          Already have an account?{" "}
          <Link to="/login" style={styles.link} className="login-link">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

// ─── Reusable field component ──────────────────────────────────────────────────
function Field({ id, label, name, type, value, onChange, placeholder, error, disabled, autoComplete }) {
  return (
    <div style={styles.fieldGroup}>
      <label htmlFor={id} style={styles.label}>{label}</label>
      <input
        id={id}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        disabled={disabled}
        style={{ ...styles.input, ...(error ? styles.inputError : {}) }}
        className={`auth-input${error ? " field-error" : ""}`}
      />
      {error && <span style={styles.fieldError}>{error}</span>}
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = {
  pageWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    minHeight: "calc(100vh - 120px)",
    padding: "32px 16px 48px",
  },
  card: {
    background: "white",
    borderRadius: "24px",
    padding: "44px 40px",
    width: "100%",
    maxWidth: "480px",
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
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  roleGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
  },
  roleCard: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    padding: "14px 12px",
    border: "2px solid #e5d7d7",
    borderRadius: "12px",
    cursor: "pointer",
    background: "#fffafa",
  },
  roleCardActive: {
    borderColor: "#d64545",
    background: "#fff5f5",
    boxShadow: "0 0 0 3px rgba(214,69,69,0.1)",
  },
  roleLabel: {
    fontWeight: "700",
    fontSize: "14px",
    color: "#1f2937",
  },
  roleDesc: {
    fontSize: "12px",
    color: "#6b7280",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
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
  inputError: {
    borderColor: "#ef4444",
  },
  fieldError: {
    fontSize: "12px",
    color: "#ef4444",
    fontWeight: "500",
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

export default Signup;
