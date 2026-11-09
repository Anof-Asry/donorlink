import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ─── Helper: generate JWT and set HttpOnly cookie ─────────────────────────────
const generateTokenAndSetCookie = (res, userId, role) => {
  const token = jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );

  // Set HttpOnly cookie (not accessible from JS — XSS safe)
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // HTTPS only in production
    sameSite: "strict",                             // CSRF protection
    maxAge: 24 * 60 * 60 * 1000,                  // 1 day in ms
  });

  return token;
};

// ─── POST /api/auth/signup ─────────────────────────────────────────────────────
export const signup = async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword, phone, role } = req.body;

    // Validate required fields
    if (!fullName || !email || !password || !confirmPassword || !phone) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    // Ensure passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    // Prevent admin self-registration
    if (role === "admin") {
      return res.status(403).json({ message: "Admin accounts cannot be created through signup." });
    }

    // Validate role
    const allowedRoles = ["donor", "recipient"];
    const assignedRole = role && allowedRoles.includes(role) ? role : "donor";

    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    // Create user (password hashed by pre-save hook in User model)
    const user = await User.create({
      fullName,
      email,
      password,
      phone,
      role: assignedRole,
    });

    // Issue token
    const token = generateTokenAndSetCookie(res, user._id, user.role);

    res.status(201).json({
      message: "Account created successfully.",
      token,  // Also send token in response body for clients that prefer Bearer
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key (email) from MongoDB unique index
      return res.status(409).json({ message: "An account with this email already exists." });
    }
    console.error("Signup error:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};

// ─── POST /api/auth/login ──────────────────────────────────────────────────────
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    // Find user with password (normally excluded by select:false)
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user) {
      // Generic message — don't reveal whether email exists
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Compare password with bcrypt hash
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Issue token
    const token = generateTokenAndSetCookie(res, user._id, user.role);

    res.status(200).json({
      message: "Logged in successfully.",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};

// ─── POST /api/auth/logout ─────────────────────────────────────────────────────
export const logout = (req, res) => {
  try {
    // Clear the HttpOnly cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.status(200).json({ message: "Logged out successfully." });
  } catch (error) {
    console.error("Logout error:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────
export const getMe = async (req, res) => {
  try {
    // req.user is populated by authenticate middleware
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json({
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("GetMe error:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};
